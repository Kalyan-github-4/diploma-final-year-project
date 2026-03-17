import { useState, useEffect, useCallback, useRef } from "react"
import { useNavigate, useParams } from "react-router-dom"
import TopBar from "@/pages/modules/git/git-and-gitHub/TopBar"
import GitGraph from "@/pages/modules/git/git-and-gitHub/GitGraph"
import Terminal from "@/pages/modules/git/git-and-gitHub/Terminal"
import type { TerminalEntry } from "@/pages/modules/git/git-and-gitHub/Terminal"
import MissionControl from "@/pages/modules/git/git-and-gitHub/MissionControl"
import { processCommand } from "@/lib/gitSimulator"
import type { GitState, Commit } from "@/lib/gitSimulator"
import { doesCommandCompleteStep } from "@/lib/mission.utils"
import type { Mission } from "@/lib/mission.utils"
import { generateGitMissions } from "@/services/git-missions.service"
import { Skeleton } from "@/components/ui/skeleton"
import {
  gitLevels,
  completeLevel,
} from "@/pages/modules/git/levels.data"
import LevelCompletionModal from "@/pages/modules/git/LevelCompletionModal"
import "./GitLearningPage.css"

/* Build initial GitState from any mission's graph data */
function buildInitialState(mission: Mission): GitState {


  const mg = mission.initialGraphState
  const commits: Record<string, Commit> = {}

  /* Determine which branch each commit belongs to by checking branch pointers */
  const commitToBranch: Record<string, string> = {}
  for (const [branchName, tipId] of Object.entries(mg.branches)) {
    let id: string | null = tipId
    while (id && mg.commits[id] && !commitToBranch[id]) {
      commitToBranch[id] = branchName
      id = mg.commits[id].parent
    }
  }

  for (const [id, data] of Object.entries(mg.commits)) {
    commits[id] = {
      id,
      message: data.message,
      parent: data.parent,
      branch: commitToBranch[id] || "main",
    }
  }

  /* Pre-initialized if there are already commits */
  const hasInit = mission.steps[0]?.completedBy !== "git init"

  return {
    commits,
    branches: { ...mg.branches },
    HEAD: { ...mg.HEAD },
    staging: [],
    workingDir: [{ name: "README.md", status: "modified" }],
    initialized: hasInit,
  }
}

function buildEmptyState(): GitState {
  return {
    commits: {},
    branches: {},
    HEAD: { type: "branch", ref: "main" },
    staging: [],
    workingDir: [],
    initialized: false,
  }
}

export default function GitLearningPage() {
  const navigate = useNavigate()
  const { slug = "git-github", levelId: rawLevelId = "1" } = useParams<{
    slug: string
    levelId: string
  }>()
  const levelId = Number(rawLevelId)
  const levelData = gitLevels.find((l) => l.id === levelId) ?? gitLevels[0]

  /* Retry key – incrementing re-triggers the mission generation effect */
  const [retryKey, setRetryKey] = useState(0)
  /* Track hint usage for star rating */
  const [hintsUsed, setHintsUsed] = useState(0)
  /* Guard against double-saving level completion */
  const hasMarkedLevelComplete = useRef(false)

  const [missions, setMissions] = useState<Mission[]>([])
  const [missionIndex, setMissionIndex] = useState(0)
  const [isLoadingMissions, setIsLoadingMissions] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const mission = missions[missionIndex] ?? null

  const [gitState, setGitState] = useState<GitState>(() => buildEmptyState())
  const [terminalHistory, setTerminalHistory] = useState<TerminalEntry[]>([])
  const [inputValue, setInputValue] = useState("")
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [showHint, setShowHint] = useState(false)
  const [timer, setTimer] = useState(0)
  const [missionComplete, setMissionComplete] = useState(false)
  const [newCommitId, setNewCommitId] = useState<string | null>(null)

  const resetMissionState = useCallback((nextMission: Mission) => {
    setMissionComplete(false)
    setGitState(buildInitialState(nextMission))
    setTerminalHistory([])
    setCurrentStep(0)
    setCompletedSteps([])
    setTimer(0)
    setShowHint(false)
    setNewCommitId(null)
    setInputValue("")
    setHintsUsed(0)
  }, [])

  const resetToEmptyState = useCallback(() => {
    setMissionComplete(false)
    setGitState(buildEmptyState())
    setTerminalHistory([])
    setCurrentStep(0)
    setCompletedSteps([])
    setTimer(0)
    setShowHint(false)
    setNewCommitId(null)
    setInputValue("")
    setHintsUsed(0)
  }, [])

  //AI Assistant context
  const currentModule = "Git"
  const currentTopic = mission?.title ?? levelData.topic

  useEffect(() => {
    let cancelled = false

    async function loadGeneratedMissions() {
      setIsLoadingMissions(true)
      setLoadError(null)
      setMissions([])
      setMissionIndex(0)
      resetToEmptyState()
      const userId = localStorage.getItem("codeking_user_id") || "guest-user"

      try {
        const generated = await generateGitMissions({
          userId,
          level: levelId,
          topic: levelData.topic,
        })

        if (cancelled) return

        if (generated.length > 0) {
          setMissions(generated)
          setMissionIndex(0)
          resetMissionState(generated[0])
          return
        }

        setLoadError("No AI-generated missions were returned for this level.")
      } catch {
        if (cancelled) return
        setLoadError("Mission generation is unavailable right now. Please retry.")
      } finally {
        if (!cancelled) {
          setIsLoadingMissions(false)
        }
      }
    }

    loadGeneratedMissions()

    return () => {
      cancelled = true
    }
  }, [resetMissionState, resetToEmptyState, levelId, levelData.topic, retryKey])

  /* Timer */
  useEffect(() => {
    if (missionComplete || isLoadingMissions || !mission) return
    const interval = setInterval(() => setTimer((t) => t + 1), 1000)
    return () => clearInterval(interval)
  }, [missionComplete, isLoadingMissions, mission])

  /* Current branch for terminal prompt */
  const currentBranch =
    gitState.HEAD.type === "branch" ? gitState.HEAD.ref : "HEAD"

  /* Process a command */
  const handleSubmit = useCallback(() => {
    if (isLoadingMissions || missionComplete || !mission) return

    const cmd = inputValue.trim()
    if (!cmd) return

    /* Add command to history */
    setTerminalHistory((prev) => [
      ...prev,
      { type: "command", text: cmd, branch: currentBranch },
    ])

    /* Process through simulator */
    const result = processCommand(cmd, gitState)

    /* Add output if any */
    if (result.output) {
      const isError =
        result.output.includes("fatal:") ||
        result.output.includes("error:") ||
        result.output.includes("command not found")
      const isSuccess =
        result.output.includes("Initialized") ||
        result.output.includes("Switched") ||
        result.output.includes("Fast-forward")
      setTerminalHistory((prev) => [
        ...prev,
        {
          type: "output",
          text: result.output,
          outputType: isError ? "error" : isSuccess ? "success" : "normal",
        },
      ])
    }

    /* Update git state */
    setGitState(result.newState)

    /* Track new commit for animation */
    if (result.graphChanged) {
      const newIds = Object.keys(result.newState.commits).filter(
        (id) => !gitState.commits[id]
      )
      if (newIds.length > 0) {
        setNewCommitId(newIds[0])
        setTimeout(() => setNewCommitId(null), 500)
      }
    }

    /* Check step completion */
    if (currentStep < mission.steps.length) {
      const step = mission.steps[currentStep]
      if (doesCommandCompleteStep(cmd, step)) {
        setCompletedSteps((prev) => [...prev, step.id])
        const nextStep = currentStep + 1
        setCurrentStep(nextStep)
        setShowHint(false)
        if (nextStep >= mission.steps.length) {
          setMissionComplete(true)
        }
      }
    }

    setInputValue("")
  }, [isLoadingMissions, missionComplete, mission, inputValue, gitState, currentBranch, currentStep])

  /* Run test: check if current step command works */
  const handleRunTest = useCallback(() => {
    if (missionComplete || !mission) return
    const step = mission.steps[currentStep]
    if (!step) return
    setTerminalHistory((prev) => [
      ...prev,
      { type: "output", text: `\n▸ Testing: ${step.instruction.replace(/`/g, "")}`, outputType: "normal" },
    ])
  }, [currentStep, mission, missionComplete])

  /* Format timer for modal */
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0")
    const sec = (s % 60).toString().padStart(2, "0")
    return `${m}:${sec}`
  }

  /* Level-complete derived state */
  const isLevelComplete = !!mission && missionComplete && missionIndex + 1 >= missions.length

  /* Save level progress once when the level is finished */
  useEffect(() => {
    if (isLevelComplete && !hasMarkedLevelComplete.current) {
      hasMarkedLevelComplete.current = true
      completeLevel(slug, levelId, levelData.xp)
    }
  }, [isLevelComplete, slug, levelId, levelData.xp])

  /* Retry same level with fresh AI-generated questions */
  const handleRetryLevel = useCallback(() => {
    hasMarkedLevelComplete.current = false
    setHintsUsed(0)
    setRetryKey((k) => k + 1)
  }, [])

  /* Navigate to the next level */
  const handleNextLevel = useCallback(() => {
    navigate(`/modules/${slug}/level/${levelId + 1}`)
  }, [navigate, slug, levelId])

  return (
    <div className="git-learning-page">
      {/* Zone 1: Top Bar */}
      <TopBar
        missionTitle={isLoadingMissions ? "Generating AI mission..." : mission?.title || "No mission available"}
        timer={timer}
        onRunTest={handleRunTest}
        module={currentModule}
        topic={currentTopic}
      />

      {/* Body: Main + Mission Control */}
      <div className="git-learning-page__body">
        {isLoadingMissions ? (
          <>
            <div className="git-learning-page__main git-learning-page__loading-main">
              <div className="git-learning-page__graph git-learning-page__loading-panel">
                <Skeleton className="h-full w-full rounded-none" />
              </div>
              <div className="git-learning-page__terminal git-learning-page__loading-panel">
                <Skeleton className="h-full w-full rounded-none" />
              </div>
            </div>
            <aside className="mission-control git-learning-page__loading-sidebar">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-10 w-full" />
            </aside>
          </>
        ) : mission ? (
          <>
            {/* Zone 2: Main Area */}
            <div className="git-learning-page__main">
              {/* Zone 2A: Git Graph */}
              <div className="git-learning-page__graph">
                <GitGraph gitState={gitState} newCommitId={newCommitId} />
              </div>

              {/* Zone 2B: Terminal */}
              <div className="git-learning-page__terminal">
                <Terminal
                  history={terminalHistory}
                  currentBranch={currentBranch}
                  inputValue={inputValue}
                  onInputChange={setInputValue}
                  onSubmit={handleSubmit}
                />
              </div>
            </div>

            {/* Zone 3: Mission Control */}
            <MissionControl
              xp={mission.xp}
              steps={mission.steps}
              currentStep={currentStep}
              completedSteps={completedSteps}
              showHint={showHint}
              onToggleHint={() => {
                if (!showHint) setHintsUsed((h) => h + 1)
                setShowHint((s) => !s)
              }}
              onSkip={() => navigate(`/modules/${slug}`)}
            />
          </>
        ) : (
          <div className="git-learning-page__empty-state">
            <h3>No AI-generated missions yet</h3>
            <p>{loadError || "Try generating this level again."}</p>
            <button className="git-learning-page__retry-btn" onClick={handleRetryLevel}>
              Retry mission generation
            </button>
          </div>
        )}
      </div>

      {/* ── Mid-level mission complete (more missions remaining) ── */}
      {mission && missionComplete && !isLevelComplete && (
        <div className="mission-overlay">
          <div className="mission-complete-modal">
            <h2 className="mission-complete-modal__heading">
              Mission Complete! 🎉
            </h2>
            <div className="mission-complete-modal__stats">
              <div className="mission-complete-modal__stat">
                XP Earned: <strong>+{mission.xp} XP</strong>
              </div>
              <div className="mission-complete-modal__stat">
                Time: <strong>{formatTime(timer)}</strong>
              </div>
              <div className="mission-complete-modal__stat">
                Steps: <strong>{mission.steps.length} / {mission.steps.length}</strong>
              </div>
            </div>
            <div className="mission-complete-modal__buttons">
              <button
                className="mission-complete-modal__btn mission-complete-modal__btn--ghost"
                onClick={() => navigate(`/modules/${slug}`)}
              >
                Back to Module
              </button>
              <button
                className="mission-complete-modal__btn mission-complete-modal__btn--primary"
                onClick={() => {
                  const nextIdx = missionIndex + 1
                  setMissionIndex(nextIdx)
                  resetMissionState(missions[nextIdx])
                }}
              >
                Next Mission →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Level complete — all missions in this level are done ── */}
      {isLevelComplete && (
        <LevelCompletionModal
          levelData={levelData}
          moduleSlug={slug}
          timer={timer}
          hintsUsed={hintsUsed}
          isLastLevel={levelId >= gitLevels.length}
          onRetry={handleRetryLevel}
          onNextLevel={handleNextLevel}
        />
      )}
    </div>
  )
}
