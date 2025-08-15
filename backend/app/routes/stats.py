from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db import get_db
from app.models.feedback_model import Feedback

router = APIRouter()

@router.get("/overview")
async def overview(db: Session = Depends(get_db)):
    total = db.query(Feedback).count()
    pos = db.query(Feedback).filter(Feedback.sentiment == "positive").count()
    neg = db.query(Feedback).filter(Feedback.sentiment == "negative").count()
    neu = total - pos - neg
    return {"total": total, "positive": pos, "neutral": neu, "negative": neg}
