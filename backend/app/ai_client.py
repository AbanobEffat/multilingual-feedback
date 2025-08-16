import os, json, anyio, google.generativeai as genai

# --- Gemini setup ---
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise RuntimeError("GEMINI_API_KEY is not set")

genai.configure(api_key=GEMINI_API_KEY)
MODEL_NAME = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")
MODEL = genai.GenerativeModel(
    MODEL_NAME,
    generation_config={
        "response_mime_type": "application/json",
        "temperature": 0.0,
    },
)

# --- Prompts ---
_DETECT_PROMPT = """Reply ONLY with a JSON object:
{"language":"<ISO-639-1 source language of the INPUT text (not English translation)>"}
Rules:
- Language MUST describe the INPUT's original language.
- Examples:
  INPUT: "Ce produit est excellent!" -> {"language":"fr"}
  INPUT: "هذا رائع جدا" -> {"language":"ar"}
  INPUT: "This is great" -> {"language":"en"}
INPUT:
"""

_ANALYZE_PROMPT = """Return ONLY JSON with:
{"translated_text":"<English>","sentiment":"positive|neutral|negative"}
INPUT:
"""

_TRANSLATE_PROMPT = """Translate the INPUT text into English and detect its source language.
Return ONLY JSON exactly as:
{"translated_text":"<English>","language":"<ISO-639-1 of INPUT>"}
INPUT:
"""

# --- Helpers ---
async def _gen_json(prompt: str, text: str) -> dict:
    """Call Gemini and parse a JSON response; tolerate fenced/plain JSON."""
    def _call():
        return MODEL.generate_content([{"text": prompt + text}])
    resp = await anyio.to_thread.run_sync(_call)
    raw = (resp.text or "").strip()
    try:
        return json.loads(raw)
    except Exception:
        import re
        m = re.search(r"\{.*\}", raw, re.S)
        if m:
            return json.loads(m.group(0))
        raise RuntimeError(f"Gemini JSON parse error; raw={raw!r}")

# --- Public API used by routes ---
async def analyze_text(text: str) -> dict:
    """
    Return: { language, translated_text, sentiment }
    - language: ISO-639-1 of the ORIGINAL text
    - translated_text: English translation
    - sentiment: positive | neutral | negative
    """
    # 1) robust source language detection
    lang = (await _gen_json(_DETECT_PROMPT, text)).get("language", "").lower() or "en"
    # 2) translate + sentiment
    out = await _gen_json(_ANALYZE_PROMPT, text)
    sent = (out.get("sentiment") or "").lower()
    if sent not in {"positive", "neutral", "negative"}:
        sent = "neutral"
    return {
        "language": lang,
        "translated_text": out.get("translated_text") or text,
        "sentiment": sent,
    }

async def translate_text(text: str) -> dict:
    """
    Return: { translated_text, language }
    - language: ISO-639-1 of the ORIGINAL text
    - translated_text: English translation
    """
    out = await _gen_json(_TRANSLATE_PROMPT, text)
    lang = (out.get("language") or "").lower()
    translated = out.get("translated_text") or text
    # Fallback: if language missing, detect explicitly
    if not lang:
        lang = (await _gen_json(_DETECT_PROMPT, text)).get("language", "").lower() or "en"
    return {"translated_text": translated, "language": lang}
