from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db import get_db
from app.models.feedback_model import Feedback
from app.ai_client import analyze_text

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
async def list_feedback(db: Session = Depends(get_db)):
  q = db.query(Feedback).order_by(Feedback.created_at.desc()).limit(200)
  return q.all()
