from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db import get_db
from app.models.feedback_model import Feedback
from app.ai_client import analyze_sentiment

router = APIRouter()

class FeedbackCreate(BaseModel):
    text: str
    product_id: int | None = None

@router.post("/", status_code=201)
async def create_feedback(payload: FeedbackCreate, db: Session = Depends(get_db)):
    ai = await analyze_sentiment(payload.text)
    db_obj = Feedback(
        product_id=payload.product_id,
        original_text=payload.text,
        translated_text=ai["translated_text"],
        language=ai["language"],
        sentiment=ai["sentiment"],
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.get("/")
async def list_feedback(product_id: int | None = None, language: str | None = None, db: Session = Depends(get_db)):
    q = db.query(Feedback)
    if product_id is not None:
        q = q.filter(Feedback.product_id == product_id)
    if language is not None:
        q = q.filter(Feedback.language == language)
    return q.order_by(Feedback.created_at.desc()).limit(200).all()
