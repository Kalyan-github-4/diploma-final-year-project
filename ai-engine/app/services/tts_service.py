# app/services/tts_service.py
#
# Kokoro-ONNX TTS service.
# Lazy-loads the model on first use so startup stays fast.

import io
import threading
from pathlib import Path
import soundfile as sf

# Model files live in the ai-engine root (one level above app/)
_ENGINE_ROOT = Path(__file__).parent.parent.parent
ONNX_PATH   = str(_ENGINE_ROOT / "kokoro-v1.0.int8.onnx")
VOICES_PATH = str(_ENGINE_ROOT / "voices-v1.0.bin")

_lock = threading.Lock()
_kokoro = None


def _get_kokoro():
    global _kokoro
    if _kokoro is not None:
        return _kokoro
    with _lock:
        if _kokoro is None:
            from kokoro_onnx import Kokoro
            _kokoro = Kokoro(ONNX_PATH, VOICES_PATH)
    return _kokoro


# Kokoro voice ids → human names used in VOICE_OPTIONS on the client.
VALID_VOICES = {
    "af_heart", "af_bella", "af_nova", "af_sarah",
    "am_adam", "am_michael",
    "bf_emma", "bm_george",
}

DEFAULT_VOICE = "af_heart"


def synthesize(text: str, voice: str, speed: float = 1.0) -> bytes:
    """
    Generate MP3 audio for `text` using `voice`.
    Returns raw MP3 bytes.
    """
    if not text or not text.strip():
        raise ValueError("text must not be empty")

    if voice not in VALID_VOICES:
        voice = DEFAULT_VOICE

    kokoro = _get_kokoro()

    # kokoro_onnx returns (samples: np.ndarray, sample_rate: int)
    samples, sample_rate = kokoro.create(text, voice=voice, speed=speed, lang="en-us")

    # Encode to MP3 via soundfile (writes WAV then we re-encode) or direct WAV.
    # soundfile doesn't support MP3 natively; write WAV and return that —
    # the client Audio element handles WAV fine and the server already sends
    # Content-Type: audio/wav.
    buf = io.BytesIO()
    sf.write(buf, samples, sample_rate, format="WAV")
    buf.seek(0)
    return buf.read()
