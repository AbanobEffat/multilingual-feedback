from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

class TranslateIn(BaseModel):
    text: str

class TranslateOut(BaseModel):
    translated_text: str
    language: str | None = None

@router.post("/", response_model=TranslateOut)
async def translate(payload: TranslateIn):
    return {"translated_text": payload.text, "language": "en"}
