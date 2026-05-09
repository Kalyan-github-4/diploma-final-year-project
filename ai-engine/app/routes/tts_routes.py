# app/routes/tts_routes.py
#
# OpenAI-compatible /v1/audio/speech endpoint.
# The Node server (and the client fallback) POST to this with:
#   { input, voice, model, response_format }
# We ignore `model` and `response_format` and always return WAV.

from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel
from app.services.tts_service import synthesize, VALID_VOICES, DEFAULT_VOICE

router = APIRouter()


class TTSRequest(BaseModel):
    input: str
    voice: str = DEFAULT_VOICE
    model: str = "kokoro"
    response_format: str = "wav"
    speed: float = 1.0


@router.post("/v1/audio/speech")
def text_to_speech(req: TTSRequest):
    if not req.input or not req.input.strip():
        raise HTTPException(status_code=400, detail="input text is required")

    voice = req.voice if req.voice in VALID_VOICES else DEFAULT_VOICE

    try:
        audio_bytes = synthesize(req.input.strip(), voice=voice, speed=req.speed)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"TTS synthesis failed: {e}")

    return Response(
        content=audio_bytes,
        media_type="audio/wav",
        headers={"Cache-Control": "no-store"},
    )


@router.get("/v1/voices")
def list_voices():
    """List available voice ids (for debugging)."""
    return {"voices": sorted(VALID_VOICES), "default": DEFAULT_VOICE}
