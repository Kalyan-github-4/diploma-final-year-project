import instructor
from openai import OpenAI
from app.config import settings
from app.schemas import GitMissionSet, DSAMissionSet


def get_client():
    """Get an Instructor-patched client. Tries Ollama first (free, local), falls back to OpenAI."""
    # Try Ollama first — free, unlimited, no quota issues
    try:
        import requests
        r = requests.get(f"{settings.OLLAMA_BASE_URL}/api/tags", timeout=2)
        if r.ok:
            return instructor.from_openai(
                OpenAI(
                    base_url=f"{settings.OLLAMA_BASE_URL}/v1",
                    api_key="ollama",
                ),
                mode=instructor.Mode.JSON,  # JSON mode works with all Ollama models
            ), settings.OLLAMA_MODEL
    except Exception:
        pass

    # Fallback to OpenAI if Ollama is not running
    if settings.OPENAI_API_KEY:
        return instructor.from_openai(
            OpenAI(api_key=settings.OPENAI_API_KEY),
        ), settings.OPENAI_MODEL

    raise RuntimeError("No AI provider available. Start Ollama or set OPENAI_API_KEY.")


def generate_git_missions(system_prompt: str, user_prompt: str) -> GitMissionSet:
    """Generate structured Git missions using Instructor."""
    client, model = get_client()

    return client.chat.completions.create(
        model=model,
        response_model=GitMissionSet,
        max_retries=3,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.4,
    )


def generate_dsa_missions(system_prompt: str, user_prompt: str) -> DSAMissionSet:
    """Generate structured DSA missions using Instructor."""
    client, model = get_client()

    return client.chat.completions.create(
        model=model,
        response_model=DSAMissionSet,
        max_retries=3,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.4,
    )
