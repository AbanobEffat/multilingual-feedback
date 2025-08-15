from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import feedback, stats, translate

app = FastAPI(title="Multilingual Feedback API")

# Allow frontend requests in dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(feedback.router, prefix="/api/feedback", tags=["feedback"])
app.include_router(stats.router, prefix="/api/stats", tags=["stats"])
app.include_router(translate.router, prefix="/api/translate", tags=["translate"])

@app.get("/")
async def root():
    return {"msg": "Multilingual Feedback API"}
