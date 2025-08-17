# Multilingual Customer Feedback Analyzer

## 📌 Project Summary
A full-stack demo app for collecting and analyzing multilingual customer feedback.  
It integrates **Gemini Studio** to detect language, translate non-English feedback into English, and classify sentiment (positive/neutral/negative).  
Admins can search and filter feedback by product, language, or sentiment, while dashboards visualize sentiment trends.

Stack:
- **Backend:** FastAPI + SQLAlchemy
- **Frontend:** React (Vite, Chart.js)
- **Database:** PostgreSQL (via SQLAlchemy ORM)
- **AI:** Google Gemini
- **Containerization:** Docker Compose

---

## 🚀 Getting Started

### Prerequisites
- Docker + Docker Compose
- Gemini API key (`GEMINI_API_KEY`)

### Steps
```bash
# Clone repo
git clone <your_repo_url>
cd multilingual-feedback

# Copy example envs and edit
cp backend/.env.example backend/.env

# Build & run full stack
docker-compose up --build
```

### Environment variables
- `GEMINI_API_KEY`: your Google Gemini key
- `GEMINI_MODEL`: optional, defaults to `gemini-2.0-flash`
- `ADMIN_TOKEN`: shared secret for admin access (default: `changeme`)

---

## ▶️ How to Run
- Backend API: http://localhost:8000/api/docs  
- Frontend UI: http://localhost:3000  
- Database persists via Docker volume.

---

## 📡 API Routes

### Feedback
- `POST /api/feedback/`
  ```json
  { "text": "Ce produit est excellent!", "product_id": 101 }
  ```
- `GET /api/feedback/` (admin only, supports filters/pagination)
  ```
  ?product_id=101&language=fr&sentiment=positive&limit=20&offset=0
  ```

### Stats
- `GET /api/stats` → sentiment percentages
- `GET /api/stats/stream` → SSE stream (push updates)
- `GET /api/stats/trends` → sentiment counts over time

### Translate (debug)
- `POST /api/translate`  
  ```json
  { "text": "هذا رائع" }
  ```

---

## 🖥 Frontend + Backend Overview
- **Frontend:**  
  - React SPA (Vite)  
  - Feedback form, admin bar, dashboard (charts + list)  
  - Uses Axios to call FastAPI backend  
  - SSE for live stats updates  
  - Pagination UI for browsing feedback  

- **Backend:**  
  - FastAPI w/ SQLAlchemy ORM  
  - Routes: `/feedback`, `/stats`, `/translate`  
  - Middleware for admin token check  
  - Async integration with Gemini for translation + sentiment  

---

## 🗄 Data Schema
```sql
Feedback(
  id SERIAL PRIMARY KEY,
  product_id INT NULL,
  original_text TEXT NOT NULL,
  translated_text TEXT NULL,
  language VARCHAR(10) NOT NULL,
  sentiment VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
)
```

---

## 🤖 Gemini Studio Integration
- Detects input language (`ISO-639-1`)  
- Translates non-English into English  
- Classifies sentiment (positive/neutral/negative)  
- Uses JSON-only structured outputs for safe parsing

---

## ⚠️ Limitations / Known Issues
- No user authentication beyond admin token (basic security only).  
- Only supports English as translation target.  
- SSE may fall back to polling if client/browser issues occur.  
- Basic UI styling, not production-grade.  
- Pagination is offset-based, no cursor-based API yet.

---

## ✅ Status
Core features working:  
✔ Feedback submission  
✔ Gemini integration (detect/translate/analyze)  
✔ Stats & dashboard charts  
✔ Admin search/filter + pagination  
✔ SSE auto-refresh  
✔ Dockerized full stack
