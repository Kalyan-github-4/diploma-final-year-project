from pydantic import BaseModel, Field


# ─── Git Mission Schemas ──────────────────────────────────────────────────────

class GitMissionStep(BaseModel):
    id: str = Field(description="Step identifier like 'step-1', 'step-2'")
    instruction: str = Field(description="What the student should do. Use markdown backticks for commands like `git status`.")
    completedBy: str = Field(description="The exact git command that completes this step")
    alternates: list[str] = Field(default_factory=list, description="Alternative valid commands")
    hint: str = Field(description="A short hint if the student is stuck")

class GitInitialGraphState(BaseModel):
    commits: dict = Field(description="Map of commit SHA to {message, parent}")
    branches: dict = Field(description="Map of branch name to commit SHA")
    HEAD: dict = Field(description="HEAD pointer: {type: 'branch', ref: 'main'}")

class GitMission(BaseModel):
    missionId: str = Field(description="Unique mission ID like 'mission-git-L7-1'")
    title: str = Field(description="Short engaging mission title")
    topicId: str = Field(description="Topic identifier matching curriculum")
    xp: int = Field(description="XP reward for completing this mission")
    difficulty: int = Field(ge=1, le=10, description="Difficulty 1-10")
    steps: list[GitMissionStep] = Field(description="Ordered list of mission steps")
    initialGraphState: GitInitialGraphState = Field(description="Starting git graph state for the visualizer")

class GitMissionSet(BaseModel):
    missions: list[GitMission] = Field(description="List of 3 missions sorted by difficulty")


# ─── DSA Mission Schemas ─────────────────────────────────────────────────────

class DSAMissionStep(BaseModel):
    id: str = Field(description="Step identifier")
    instruction: str = Field(description="What to predict or observe at this step")
    expectedAnswer: str = Field(description="The correct answer for this step")
    hint: str = Field(description="A short hint")

class DSAMission(BaseModel):
    missionId: str = Field(description="Unique mission ID")
    title: str = Field(description="Short engaging mission title")
    topicId: str = Field(description="Topic identifier matching curriculum")
    xp: int = Field(description="XP reward")
    difficulty: int = Field(ge=1, le=10, description="Difficulty 1-10")
    problemDescription: str = Field(description="The problem to solve or trace")
    inputData: dict = Field(description="Input data for the algorithm (array, graph, etc.)")
    steps: list[DSAMissionStep] = Field(description="Ordered prediction/trace steps")

class DSAMissionSet(BaseModel):
    missions: list[DSAMission] = Field(description="List of 3 missions sorted by difficulty")


# ─── Request Schema ──────────────────────────────────────────────────────────

class GenerateMissionsRequest(BaseModel):
    module: str = Field(description="Module slug: 'git-github' or 'dsa'")
    level: int = Field(ge=1, description="Level number")
    userId: str = Field(default="anonymous", description="User ID for dedup")
    previousMissionTitles: list[str] = Field(default_factory=list, description="Titles to avoid repeating")
