import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import TopBar from "@/components/Git & GitHub/TopBar"
import GitGraph from "@/components/Git & GitHub/GitGraph"
import Terminal from "@/components/Git & GitHub/Terminal"
import type { TerminalEntry } from "@/components/Git & GitHub/Terminal"
import MissionControl from "@/components/Git & GitHub/MissionControl"
import { processCommand } from "@/lib/gitSimulator"
import type { GitState, Commit } from "@/lib/gitSimulator"
import { allMissions, doesCommandCompleteStep } from "@/lib/mission.utils"
import type { Mission } from "@/lib/mission.utils"
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

export default function GitLearningPage() {
  const navigate = useNavigate()
  const [missionIndex, setMissionIndex] = useState(0)
  const mission = allMissions[missionIndex]

  const [gitState, setGitState] = useState<GitState>(() => buildInitialState(mission))
  const [terminalHistory, setTerminalHistory] = useState<TerminalEntry[]>([])
  const [inputValue, setInputValue] = useState("")
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const [showHint, setShowHint] = useState(false)
  const [timer, setTimer] = useState(0)
  const [missionComplete, setMissionComplete] = useState(false)
  const [newCommitId, setNewCommitId] = useState<string | null>(null)

  /* Timer */
  useEffect(() => {
    if (missionComplete) return
    const interval = setInterval(() => setTimer((t) => t + 1), 1000)
    return () => clearInterval(interval)
  }, [missionComplete])

  /* Current branch for terminal prompt */
  const currentBranch =
    gitState.HEAD.type === "branch" ? gitState.HEAD.ref : "HEAD"

  /* Process a command */
  const handleSubmit = useCallback(() => {
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
  }, [inputValue, gitState, currentBranch, currentStep, mission.steps])

  /* Run test: check if current step command works */
  const handleRunTest = useCallback(() => {
    if (missionComplete) return
    const step = mission.steps[currentStep]
    if (!step) return
    setTerminalHistory((prev) => [
      ...prev,
      { type: "output", text: `\n▸ Testing: ${step.instruction.replace(/`/g, "")}`, outputType: "normal" },
    ])
  }, [currentStep, mission.steps, missionComplete])

  /* Format timer for modal */
  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0")
    const sec = (s % 60).toString().padStart(2, "0")
    return `${m}:${sec}`
  }

  return (
    <div className="git-learning-page">
      {/* Zone 1: Top Bar */}
      <TopBar
        missionTitle={mission.title}
        timer={timer}
        onRunTest={handleRunTest}
      />

      {/* Body: Main + Mission Control */}
      <div className="git-learning-page__body">
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
          onToggleHint={() => setShowHint((s) => !s)}
          onSkip={() => navigate("/modules")}
        />
      </div>

      {/* Mission Complete Modal */}
      {missionComplete && (
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
                onClick={() => navigate("/modules")}
              >
                Back to Modules
              </button>
              <button
                className="mission-complete-modal__btn mission-complete-modal__btn--primary"
                onClick={() => {
                  const nextIdx = missionIndex + 1
                  if (nextIdx < allMissions.length) {
                    setMissionIndex(nextIdx)
                    const nextMission = allMissions[nextIdx]
                    setMissionComplete(false)
                    setGitState(buildInitialState(nextMission))
                    setTerminalHistory([])
                    setCurrentStep(0)
                    setCompletedSteps([])
                    setTimer(0)
                    setShowHint(false)
                    setNewCommitId(null)
                    setInputValue("")
                  } else {
                    navigate("/modules")
                  }
                }}
              >
                {missionIndex + 1 < allMissions.length ? "Next Mission →" : "All Done! 🏆"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
