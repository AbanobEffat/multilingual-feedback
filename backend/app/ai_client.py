import os
import google.generativeai as genai

# Load Gemini API key from environment variable
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise RuntimeError("Missing GEMINI_API_KEY environment variable")

# Configure SDK
genai.configure(api_key=GEMINI_API_KEY)

# Create model instance
MODEL = genai.GenerativeModel("gemini-2.0-flash")

async def detect_language(text: str) -> str:
    """
    Detects the language of given text using Gemini.
    Returns an ISO 639-1 language code (e.g., 'en', 'fr', 'ar').
    """
    prompt = f"Detect the language of this text and reply ONLY with its 2-letter ISO 639-1 code:\n{text}"
    try:
        response = MODEL.generate_content(prompt)
        lang_code = response.text.strip().lower()
        if len(lang_code) != 2:
            raise ValueError(f"Unexpected response from Gemini: {lang_code}")
        return lang_code
    except Exception as e:
        raise RuntimeError(f"Gemini language detection failed: {e}")

async def translate_text(text: str, target_lang: str) -> str:
    """
    Translate text into the given target language using Gemini.
    """
    prompt = f"Translate the following text into {target_lang}:\n{text}"
    try:
        response = MODEL.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        raise RuntimeError(f"Gemini translation failed: {e}")

async def analyze_sentiment(text: str) -> str:
    """
    Analyze sentiment of given text as 'positive', 'neutral', or 'negative' using Gemini.
    """
    prompt = f"Classify the sentiment of this text as exactly one of: positive, neutral, negative.\n{text}"
    try:
        response = MODEL.generate_content(prompt)
        sentiment = response.text.strip().lower()
        if sentiment not in {"positive", "neutral", "negative"}:
            raise ValueError(f"Unexpected sentiment from Gemini: {sentiment}")
        return sentiment
    except Exception as e:
        raise RuntimeError(f"Gemini sentiment analysis failed: {e}")
