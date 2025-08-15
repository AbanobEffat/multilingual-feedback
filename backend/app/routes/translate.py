from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.ai_client import translate_text

router = APIRouter()

class TranslateIn(BaseModel):
    text: str

class TranslateOut(BaseModel):
    translated_text: str
    language: str

@router.post("/", response_model=TranslateOut)
async def translate(payload: TranslateIn):
    try:
        r = await translate_text(payload.text)
        return r
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))
