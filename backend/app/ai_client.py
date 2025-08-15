import os
import httpx

API_URL = os.getenv("GEMINI_API_URL")
API_KEY = os.getenv("GEMINI_API_KEY")

async def analyze_text(text: str):
    headers = {"Authorization": f"Bearer {API_KEY}"} if API_KEY else {}
    async with httpx.AsyncClient() as client:
        resp = await client.post(API_URL, json={"text": text}, headers=headers)
        resp.raise_for_status()
        return resp.json()
