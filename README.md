# Multilingual Customer Feedback Analyzer (Gemini)

Full-stack project:
- Backend: FastAPI + SQLAlchemy + PostgreSQL, Gemini SDK for language/translation/sentiment
- Frontend: React (Vite) with charts
- Docker Compose for easy setup

## Quick Start

1) Copy env templates:
```
cp .env.example .env
cp frontend/.env.example frontend/.env
# edit .env and set GEMINI_API_KEY
```

2) Start services:
```
docker compose up --build
```

3) Open:
- Backend docs: http://localhost:8000/docs
- Frontend: http://localhost:3000

### API Routes
- POST `/api/feedback/` → { text, product_id? } → creates feedback (Gemini: detect/translate/sentiment)
- GET `/api/feedback/` → query params: q, product_id, language, sentiment, limit, offset
- GET `/api/stats` → { total, positive, neutral, negative }
- GET `/api/stats/overview` → same as `/api/stats`
- GET `/api/stats/trends` → params: days=30, interval=day|week
- POST `/api/translate/` → { text } → { translated_text, language }

## Notes
- Backend auto-creates tables on startup.
- Frontend base API URL is configurable via `frontend/.env`.
