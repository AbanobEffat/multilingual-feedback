from fastapi import APIRouter, Depends, Request
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import func, case
from app.db import get_db
from app.models.feedback_model import Feedback
from app import events  
import json

router = APIRouter()

@router.get("/stream")
async def stream(request: Request):
    """
    SSE stream that pushes a message whenever stats might have changed.
    Frontend can refetch /stats/overview on each message.
    """
    q = await events.subscribe()

    async def event_generator():
        # initial ping (helps some proxies keep the connection open)
        yield "event: ping\ndata: {}\n\n"
        try:
            while True:
                # if client disconnected, stop
                if await request.is_disconnected():
                    break
                payload = await q.get()
                yield f"data: {json.dumps(payload)}\n\n"
        finally:
            await events.unsubscribe(q)

    return StreamingResponse(event_generator(), media_type="text/event-stream")


@router.get("/overview")
async def overview(db: Session = Depends(get_db)):
    total = db.query(Feedback).count()
    pos = db.query(Feedback).filter(Feedback.sentiment == "positive").count()
    neg = db.query(Feedback).filter(Feedback.sentiment == "negative").count()
    neu = total - pos - neg
    return {"total": total, "positive": pos, "neutral": neu, "negative": neg}

@router.get("/trends")
async def trends(days: int = 30, interval: str = "day", db: Session = Depends(get_db)):
    if interval not in {"day", "week"}:
        interval = "day"
    bucket = func.date_trunc(interval, Feedback.created_at).label("bucket")
    total_expr = func.count(Feedback.id).label("total")
    pos_expr = func.sum(case((Feedback.sentiment == "positive", 1), else_=0)).label("positive")
    neg_expr = func.sum(case((Feedback.sentiment == "negative", 1), else_=0)).label("negative")
    neu_expr = func.sum(case((Feedback.sentiment == "neutral", 1), else_=0)).label("neutral")
    rows = (
        db.query(bucket, total_expr, pos_expr, neg_expr, neu_expr)
        .filter(Feedback.created_at >= func.now() - func.make_interval(0, 0, 0, days))
        .group_by(bucket)
        .order_by(bucket.asc())
    ).all()
    labels,total,positive,neutral,negative,pct_p,pct_u,pct_n = [],[],[],[],[],[],[],[]
    for b,t,p,n,u in rows:
        labels.append(b.isoformat())
        total.append(t); positive.append(p); neutral.append(u); negative.append(n)
        pct_p.append(round((p/t)*100,2) if t else 0.0)
        pct_u.append(round((u/t)*100,2) if t else 0.0)
        pct_n.append(round((n/t)*100,2) if t else 0.0)
    return {
        "labels": labels, "total": total, "positive": positive, "neutral": neutral, "negative": negative,
        "pct_positive": pct_p, "pct_neutral": pct_u, "pct_negative": pct_n, "interval": interval, "days": days
    }
@router.get("")
async def stats_alias(db: Session = Depends(get_db)):
    # Alias for GET /api/stats → return the overview payload
    total = db.query(Feedback).count()
    pos = db.query(Feedback).filter(Feedback.sentiment == "positive").count()
    neg = db.query(Feedback).filter(Feedback.sentiment == "negative").count()
    neu = total - pos - neg
    return {"total": total, "positive": pos, "neutral": neu, "negative": neg}