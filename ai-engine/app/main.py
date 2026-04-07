from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.ai_routes import router

app = FastAPI(
    title="CodeKing AI Engine",
    description="Curriculum-driven mission generation with structured output",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:4000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/ai")
