from sqlalchemy import Column, Integer, String, Text, DateTime, func
from app.db import Base

class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, nullable=True)
    original_text = Column(Text, nullable=False)
    translated_text = Column(Text, nullable=True)
    language = Column(String(8), nullable=True, index=True)
    sentiment = Column(String(16), nullable=True, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
