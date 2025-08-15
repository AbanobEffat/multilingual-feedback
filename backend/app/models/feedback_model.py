from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from app.db import Base

class Feedback(Base):
    __tablename__ = "feedback"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, nullable=True)
    original_text = Column(Text, nullable=False)
    translated_text = Column(Text, nullable=True)
    language = Column(String(10), nullable=True)
    sentiment = Column(String(20), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
