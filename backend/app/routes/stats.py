from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, case
from app.db import get_db
from app.models.feedback_model import Feedback

router = APIRouter()

@router.get("/trends")
async def trends(days: int = 30, interval: str = "day", db: Session = Depends(get_db)):
    """
    Time-series buckets (day/week) for last N days with totals and % per sentiment.
    """
    if interval not in {"day", "week"}:
        interval = "day"

    bucket = func.date_trunc(interval, Feedback.created_at).label("bucket")

    total_expr = func.count(Feedback.id).label("total")
    pos_expr = func.sum(case((Feedback.sentiment == "positive", 1), else_=0)).label("positive")
    neg_expr = func.sum(case((Feedback.sentiment == "negative", 1), else_=0)).label("negative")
    neu_expr = func.sum(case((Feedback.sentiment == "neutral", 1), else_=0)).label("neutral")

    q = (
        db.query(bucket, total_expr, pos_expr, neg_expr, neu_expr)
        .filter(Feedback.created_at >= func.now() - func.make_interval(0, 0, 0, days))
        .group_by(bucket)
        .order_by(bucket.asc())
    )
    rows = q.all()

    labels, total, positive, neutral, negative = [], [], [], [], []
    pct_positive, pct_neutral, pct_negative = [], [], []

    for b, t, p, n, u in rows:
        labels.append(b.isoformat())
        total.append(t)
        positive.append(p)
        neutral.append(u)
        negative.append(n)
        pct_positive.append(round((p / t) * 100.0, 2) if t else 0.0)
        pct_neutral.append(round((u / t) * 100.0, 2) if t else 0.0)
        pct_negative.append(round((n / t) * 100.0, 2) if t else 0.0)

    return {
        "labels": labels,
        "total": total,
        "positive": positive,
        "neutral": neutral,
        "negative": negative,
        "pct_positive": pct_positive,
        "pct_neutral": pct_neutral,
        "pct_negative": pct_negative,
        "interval": interval,
        "days": days,
    }
@router.get("/overview")
async def overview(db: Session = Depends(get_db)):
    total = db.query(Feedback).count()
    pos = db.query(Feedback).filter(Feedback.sentiment == "positive").count()
    neg = db.query(Feedback).filter(Feedback.sentiment == "negative").count()
    neu = total - pos - neg
    return {"total": total, "positive": pos, "neutral": neu, "negative": neg}