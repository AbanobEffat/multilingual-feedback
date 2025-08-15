import enum
from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Text, DateTime, ForeignKey, Enum, CheckConstraint, Index, func
)
from sqlalchemy.orm import declarative_base

Base = declarative_base()

class SentimentEnum(str, enum.Enum):
    positive = "positive"
    neutral = "neutral"
    negative = "negative"

class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("product.id", ondelete="SET NULL"), index=True, nullable=True)

    original_text   = Column(Text, nullable=False)
    translated_text = Column(Text, nullable=True)
    language        = Column(String(10), nullable=True)

    # Option A: strict enum (recommended)
    sentiment = Column(Enum(SentimentEnum, name="sentiment_enum"), nullable=True)
    # Option B (if not using Enum): uncomment a Check constraint instead
    # sentiment = Column(String(20), nullable=True)
    # __table_args__ = (
    #     CheckConstraint("sentiment IN ('positive','neutral','negative')", name="ck_feedback_sentiment"),
    # )

    # If on Postgres and you want DB time:
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    # If you prefer Python-side UTC (cross-DB consistent):
    # created_at = Column(DateTime(timezone=False), default=datetime.utcnow, nullable=False)

    def __repr__(self) -> str:
        return f"<Feedback id={self.id} product_id={self.product_id} lang={self.language} sentiment={self.sentiment}>"

# Optional composite index to speed up per-product queries by time
Index("ix_feedback_product_created", Feedback.product_id, Feedback.created_at.desc())
