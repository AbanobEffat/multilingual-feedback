from fastapi import APIRouter
from pydantic import BaseModel
from app.ai_client import translate_text

router = APIRouter()

class TranslateIn(BaseModel):
    text: str

class TranslateOut(BaseModel):
    translated_text: str
    language: str | None = None

@router.post("/", response_model=TranslateOut)
async def translate(payload: TranslateIn):
    r = await translate_text(payload.text)
    return r
