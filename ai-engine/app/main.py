from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.ai_routes import router
from app.routes.tts_routes import router as tts_router


@asynccontextmanager
async def lifespan(_app: FastAPI):
    # Pre-warm the Kokoro TTS model so the first user request is fast
    try:
        from app.services.tts_service import _get_kokoro
        import asyncio
        loop = asyncio.get_event_loop()
        await loop.run_in_executor(None, _get_kokoro)
        print("[TTS] Kokoro model pre-warmed and ready.")
    except Exception as e:
        print(f"[TTS] Pre-warm failed (TTS will load on first request): {e}")
    yield


app = FastAPI(
    title="CodeKing AI Engine",
    description="Curriculum-driven mission generation and TTS",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:4000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/ai")
# OpenAI-compatible TTS — mounted at root so /v1/audio/speech matches
# what the Node server and client already call.
app.include_router(tts_router)
