import os
import json
import anyio
import google.generativeai as genai

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise RuntimeError("Missing GEMINI_API_KEY")

genai.configure(api_key=GEMINI_API_KEY)

MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")
MODEL = genai.GenerativeModel(MODEL_NAME, generation_config={"response_mime_type": "application/json"})

_ANALYZE_PROMPT = """You are an analysis tool.
Given the INPUT text, do three tasks:
1) Detect the ISO 639-1 language code of the text (e.g., "en","fr","ar","es").
2) Translate the text into English; keep names/brands.
3) Classify sentiment as exactly one of: "positive", "neutral", "negative".

Return ONLY valid JSON with keys exactly:
{
  "language": "<code>",
  "translated_text": "<english translation>",
  "sentiment": "<positive|neutral|negative>"
}

INPUT:
"""

_TRANSLATE_PROMPT = """Translate the following text into English and detect its source language.
Return ONLY valid JSON exactly as:
{
  "translated_text": "<english>",
  "language": "<ISO 639-1 code>"
}

INPUT:
"""

async def _gen_json(prompt: str, text: str) -> dict:
    def _call():
        return MODEL.generate_content([{"text": prompt + text}])
    resp = await anyio.to_thread.run_sync(_call)
    try:
        return json.loads(resp.text.strip())
    except Exception as e:
        raise RuntimeError(f"Gemini JSON parse error: {e}; raw={resp.text!r}")

async def analyze_text(text: str) -> dict:
    return await _gen_json(_ANALYZE_PROMPT, text)

async def translate_text(text: str) -> dict:
    return await _gen_json(_TRANSLATE_PROMPT, text)
