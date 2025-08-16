from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db import get_db
from app.models.feedback_model import Feedback
from app.ai_client import analyze_text
from app import events
from typing import Optional
from fastapi import Query

router = APIRouter()

class FeedbackCreate(BaseModel):
  text: str
  product_id: int | None = None

@router.post("/", status_code=201)
async def create_feedback(payload: FeedbackCreate, db: Session = Depends(get_db)):
  try:
    ai = await analyze_text(payload.text)
  except Exception as e:
    raise HTTPException(status_code=502, detail=str(e))
  db_obj = Feedback(
    product_id=payload.product_id,
    original_text=payload.text,
    translated_text=ai.get("translated_text"),
    language=ai.get("language"),
    sentiment=ai.get("sentiment"),
  )
  db.add(db_obj)
  db.commit()
  db.refresh(db_obj)
  await events.notify_stats_changed()

  return {
    "id": db_obj.id,
    "product_id": db_obj.product_id,
    "original_text": db_obj.original_text,
    "translated_text": db_obj.translated_text,
    "language": db_obj.language,
    "sentiment": db_obj.sentiment,
    "created_at": db_obj.created_at,
  }



@router.get("/")
async def list_feedback(
    db: Session = Depends(get_db),
    q: Optional[str] = Query(None),
    product_id: Optional[int] = Query(None),
    language: Optional[str] = Query(None, min_length=2, max_length=8),
    language_mode: str = Query("source", regex="^(source|target)$"),
    sentiment: Optional[str] = Query(None, regex="^(positive|neutral|negative)$"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    query = db.query(Feedback)

    if product_id is not None:
        query = query.filter(Feedback.product_id == product_id)
    if sentiment:
        query = query.filter(Feedback.sentiment == sentiment)
    if language:
        if language_mode == "source":
            query = query.filter(Feedback.language == language.lower())
        else:
            # target=English means we have a translation (always English in this app)
            # treat 'en' as "has translated_text"
            if language.lower() == "en":
                query = query.filter(Feedback.translated_text.isnot(None))
            else:
                # for now we only translate to English; non-en target -> empty
                query = query.filter(False)

    if q:
        like = f"%{q}%"
        query = query.filter(
            (Feedback.original_text.ilike(like)) |
            (Feedback.translated_text.ilike(like))
        )

    total = query.count()
    items = (query.order_by(Feedback.created_at.desc())
                  .offset(offset).limit(limit).all())
    return {"total": total, "items": items, "limit": limit, "offset": offset}

