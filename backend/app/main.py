from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import feedback, stats, translate
from app.db import Base, engine

app = FastAPI(title="Multilingual Feedback API (Gemini)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auto-create tables on startup (dev convenience)
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"[WARN] DB init skipped/failed: {e}")

app.include_router(feedback.router,  prefix="/api/feedback",  tags=["feedback"])
app.include_router(stats.router,     prefix="/api/stats",     tags=["stats"])
app.include_router(translate.router, prefix="/api/translate", tags=["translate"])

@app.get("/")
async def root():
    return {"msg": "Multilingual Feedback API with Gemini"}
