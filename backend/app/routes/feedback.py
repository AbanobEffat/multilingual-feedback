from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from app.db import get_db
from app.models.feedback_model import Feedback

router = APIRouter()

class FeedbackCreate(BaseModel):
    text: str
    product_id: int | None = None

@router.post("/", status_code=201)
async def create_feedback(payload: FeedbackCreate, db: Session = Depends(get_db)):
    # Placeholder for Gemini AI
    detected_language = "en"
    translated = payload.text
    sentiment = "neutral"

    db_obj = Feedback(
        product_id=payload.product_id,
        original_text=payload.text,
        translated_text=translated,
        language=detected_language,
        sentiment=sentiment,
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
