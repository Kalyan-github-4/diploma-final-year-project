from fastapi import APIRouter, HTTPException
from app.utils.loader import load_curriculum
from app.schemas import GenerateMissionsRequest
from app.services.prompt_builder import (
    build_git_system_prompt,
    build_git_user_prompt,
    build_dsa_system_prompt,
    build_dsa_user_prompt,
)
from app.services.ai_service import generate_git_missions, generate_dsa_missions

router = APIRouter()


@router.get("/health")
def health():
    return {"status": "ok", "service": "ai-engine"}


@router.get("/curriculum/{module}/{level}")
def get_curriculum(module: str, level: int):
    """Get raw curriculum data for a level (useful for debugging)."""
    try:
        data = load_curriculum(module)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"Module '{module}' not found")

    level_data = data["levels"].get(str(level))
    if not level_data:
        raise HTTPException(status_code=404, detail=f"Level {level} not found in {module}")

    return {"module": module, "level": level, "data": level_data}


@router.post("/generate-missions")
def generate_missions(req: GenerateMissionsRequest):
    """Generate structured missions using curriculum + Instructor."""
    try:
        data = load_curriculum(req.module)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"Module '{req.module}' not found")

    level_data = data["levels"].get(str(req.level))
    if not level_data:
        raise HTTPException(status_code=404, detail=f"Level {req.level} not found in {req.module}")

    try:
        if req.module == "git-github":
            system_prompt = build_git_system_prompt()
            user_prompt = build_git_user_prompt(level_data, req.previousMissionTitles)
            result = generate_git_missions(system_prompt, user_prompt)
        elif req.module == "dsa":
            system_prompt = build_dsa_system_prompt()
            user_prompt = build_dsa_user_prompt(level_data, req.previousMissionTitles)
            result = generate_dsa_missions(system_prompt, user_prompt)
        else:
            raise HTTPException(status_code=400, detail=f"Module '{req.module}' does not support mission generation yet")

        return {
            "module": req.module,
            "level": req.level,
            "count": len(result.missions),
            "missions": [m.model_dump() for m in result.missions],
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Mission generation failed: {str(e)}")
