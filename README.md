# Multilingual Customer Feedback Analyzer

A full-stack demo application for collecting, translating, and analyzing customer feedback across multiple languages.  
It uses **Gemini Studio** for translation, language detection, and sentiment classification, with a **React frontend**, **FastAPI backend**, and a **PostgreSQL** database.  

---

## 🚀 Project Summary
This tool allows customers to submit product feedback in any language. The backend automatically:
- Detects the input language
- Translates non-English feedback to English
- Classifies sentiment (positive / neutral / negative)

Admins can:
- Search and filter feedback by product or language
- View original + translated versions side by side
- Monitor sentiment trends in real time (via SSE-powered dashboard)

---

## 🛠 Getting Started

### Prerequisites
- Docker & Docker Compose installed
- A valid **Gemini Studio API key**  

### Environment Variables
Create a `.env` file in the project root:

```ini
# Backend
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.0-flash
ADMIN_TOKEN=supersecret

# Database
POSTGRES_USER=feedback
POSTGRES_PASSWORD=feedback123
POSTGRES_DB=feedbackdb
```

### Build & Run
```bash
docker compose up --build
```

- Frontend: http://localhost:3000  
- Backend API: http://localhost:8000/api  

---

## ▶️ How to Run
1. Open the frontend at [http://localhost:3000](http://localhost:3000)  
2. Submit feedback (optionally with product ID)  
3. View live charts and sentiment breakdown  
4. To unlock **search & filter**, enter your admin token in the “Admin” bar  

---

## 🔌 API Routes

### Feedback
- `POST /api/feedback/` → Submit feedback  
  ```json
  { "text": "Ce produit est excellent!", "product_id": 101 }
  ```
- `GET /api/feedback/` → List feedback (admin only, supports filters)  
  ```http
  GET /api/feedback?language=fr&product_id=101
  Headers: X-Admin-Token: <token>
  ```

### Stats
- `GET /api/stats/` → Sentiment summary  
- `GET /api/stats/stream` → Server-Sent Events (live updates)  
- `GET /api/stats/trends` → Time-series breakdown  

### Translation
- `POST /api/translate/` → Translate + sentiment for a raw string  

---

## 🖼 Frontend Overview
- Built with **React + Vite**  
- Features:
  - Feedback form with optional product ID
  - Real-time dashboard of sentiment trends (via SSE)
  - Admin-only search and filtering
  - Displays original + translated text side by side  

---

## ⚙ Backend Overview
- **FastAPI** REST API with OpenAPI docs at `/docs`
- Async database access with SQLAlchemy + PostgreSQL
- **AI client** wraps Gemini Studio calls for:
  - Language detection
  - Translation
  - Sentiment classification
- Protected admin routes via `X-Admin-Token`  

---

## 🗄 Data Schema

### feedback
| Field            | Type        | Notes                                |
|------------------|------------|--------------------------------------|
| id               | int (PK)   | Auto increment                       |
| product_id       | int        | Optional product identifier          |
| original_text    | text       | Raw customer input                   |
| translated_text  | text       | English translation (if needed)      |
| language         | varchar    | ISO-639-1 code of original language  |
| sentiment        | varchar    | "positive", "neutral", "negative"    |
| created_at       | timestamp  | Auto-generated                       |

---

## 🤖 Gemini Studio Integration
The backend calls Gemini via the Python SDK:
- **Prompt 1**: Detect source language  
- **Prompt 2**: Translate to English + classify sentiment  

All AI responses are parsed as JSON to keep output structured.  

---

## ⚠️ Known Limitations
- No authentication beyond simple `X-Admin-Token` header (for demo only)  
- No pagination UI yet (backend supports `limit`/`offset`)  
- Charts refresh in real-time via SSE, but may fall back to polling if SSE fails  
- Gemini model quality may vary for low-resource languages  

---

✅ With this setup, the project is **demo-ready**: you can submit feedback in any language, see translations and sentiment in real time, and filter/search as an admin.  
