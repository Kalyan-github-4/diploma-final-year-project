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

function isAncestor(
  commits: Record<string, Commit>,
  ancestorId: string,
  descendantId: string
): boolean {
  let cursor: string | null = descendantId

  while (cursor && commits[cursor]) {
    if (cursor === ancestorId) return true
    cursor = commits[cursor].parent
  }

  return false
}

function countDistanceToAncestor(
  commits: Record<string, Commit>,
  ancestorId: string,
  descendantId: string
): number {
  let cursor: string | null = descendantId
  let distance = 0

  while (cursor && commits[cursor]) {
    if (cursor === ancestorId) return distance
    cursor = commits[cursor].parent
    distance += 1
  }

  return 0
}

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
    remotes: { ...(mg.remotes || { origin: "https://github.com/codeking/simulated-repo.git" }) },
    upstreams: { ...(mg.upstreams || {}) },
    pullRequests: [...(mg.pullRequests || [])],
    nextPullRequestId: mg.nextPullRequestId || 1,
    conflictRules: [...(mg.conflictRules || [])],
    mergeConflict: null,
    stashStack: [],
    tags: {},
    reflog: [],
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
    remotes: {},
    upstreams: {},
    pullRequests: [],
    nextPullRequestId: 1,
    conflictRules: [],
    mergeConflict: null,
    stashStack: [],
    tags: {},
    reflog: [],
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
  const [coachingTips, setCoachingTips] = useState<string[]>([])
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
    setCoachingTips([])
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
    setCoachingTips([])
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
      const generationNonce = `${Date.now()}-${retryKey}-${Math.random().toString(36).slice(2, 8)}`

      try {
        const generated = await generateGitMissions({
          userId,
          level: levelId,
          topic: levelData.topic,
          generationNonce,
        })

        if (cancelled) return

        if (generated.length > 0) {
          setMissions(generated)
          setMissionIndex(0)
          resetMissionState(generated[0])
          return
        }

        setLoadError("Missions for this level are coming soon.")
      } catch {
        if (cancelled) return

        setLoadError("Couldn't load missions. Please retry.")
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

  const currentBranchTip =
    gitState.HEAD.type === "branch" ? gitState.branches[gitState.HEAD.ref] : null
  const upstreamRef =
    gitState.HEAD.type === "branch"
      ? gitState.upstreams?.[gitState.HEAD.ref] || `origin/${gitState.HEAD.ref}`
      : null
  const upstreamTip = upstreamRef ? gitState.branches[upstreamRef] : null

  let aheadBy = 0
  let behindBy = 0
  if (currentBranchTip && upstreamTip) {
    if (isAncestor(gitState.commits, currentBranchTip, upstreamTip)) {
      behindBy = countDistanceToAncestor(gitState.commits, currentBranchTip, upstreamTip)
    } else if (isAncestor(gitState.commits, upstreamTip, currentBranchTip)) {
      aheadBy = countDistanceToAncestor(gitState.commits, upstreamTip, currentBranchTip)
    }
  }

  const remoteBranches = Object.keys(gitState.branches).filter((name) => name.includes("/"))
  const openPr = (gitState.pullRequests || []).find((pr) => pr.status === "open") || null

  const getTipsFromOutput = (output: string): string[] => {
    const tips: string[] = []
    const text = output.toLowerCase()

    if (text.includes("fatal: not possible to fast-forward") || text.includes("divergent")) {
      tips.push("Remote has diverged; run git pull --rebase before pushing.")
    }
    if (text.includes("merge conflict") || text.includes("conflict")) {
      tips.push("Resolve conflicted files, then run git add and git merge --continue.")
    }
    if (text.includes("no upstream") || text.includes("set-upstream")) {
      tips.push("Set tracking once with git push -u origin <branch>.")
    }
    if (text.includes("changes requested")) {
      tips.push("Review feedback and push follow-up commits to the same branch.")
    }
    if (text.includes("checks pending") || text.includes("checks are still pending")) {
      tips.push("Wait for CI checks to pass before attempting merge.")
    }

    return tips
  }

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

      const nextTips = getTipsFromOutput(result.output)
      if (nextTips.length > 0) {
        setCoachingTips((prev) => {
          const merged = [...prev]
          for (const tip of nextTips) {
            if (!merged.includes(tip)) merged.push(tip)
          }
          return merged.slice(-5)
        })
      }
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

  const handleGenerateNewSet = useCallback(() => {
    if (isLoadingMissions) return
    hasMarkedLevelComplete.current = false
    setHintsUsed(0)
    setRetryKey((k) => k + 1)
  }, [isLoadingMissions])

  /* Navigate to the next level */
  const handleNextLevel = useCallback(() => {
    navigate(`/modules/${slug}/level/${levelId + 1}`)
  }, [navigate, slug, levelId])

  return (
    <div className="-m-6 flex h-[calc(100%+48px)] flex-col overflow-hidden">
      {/* Zone 1: Top Bar */}
      <TopBar
        missionTitle={isLoadingMissions ? "Generating AI mission..." : mission?.title || "No mission available"}
        timer={timer}
        onRunTest={handleRunTest}
        onGenerateNewSet={handleGenerateNewSet}
        isGenerating={isLoadingMissions}
        module={currentModule}
        topic={currentTopic}
      />

      {/* Body: Main + Mission Control */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {isLoadingMissions ? (
          <>
            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
              <div className="flex min-h-0 flex-55 overflow-hidden bg-card">
                <Skeleton className="h-full w-full rounded-none" />
              </div>
              <div className="flex min-h-0 flex-45 overflow-hidden bg-card">
                <Skeleton className="h-full w-full rounded-none" />
              </div>
            </div>
            <aside className="flex w-95 min-w-[320px] flex-col gap-3 p-4.5">
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
            <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
              {/* Zone 2A: Git Graph */}
              <div className="flex min-h-0 flex-55 overflow-hidden">
                <GitGraph gitState={gitState} newCommitId={newCommitId} />
              </div>

              {/* Zone 2B: Terminal */}
              <div className="flex min-h-0 flex-45 overflow-hidden">
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
              teamSync={{
                branch: currentBranch,
                upstream: upstreamRef,
                aheadBy,
                behindBy,
                remoteBranches,
              }}
              prStatus={openPr}
              coachingTips={coachingTips}
              onToggleHint={() => {
                if (!showHint) setHintsUsed((h) => h + 1)
                setShowHint((s) => !s)
              }}
              onSkip={() => navigate(`/modules/${slug}`)}
            />
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-2.5 p-5 text-center">
            <h3 className="m-0 text-lg font-bold text-(--foreground)">No AI-generated missions yet</h3>
            <p className="m-0 text-sm text-(--muted-foreground)">{loadError || "Try generating this level again."}</p>
            <button
              className="h-9.5 cursor-pointer rounded-lg border border-(--border) bg-(--primary) px-4 text-sm font-semibold text-(--primary-foreground) hover:opacity-90"
              onClick={handleRetryLevel}
            >
              Retry mission generation
            </button>
          </div>
        )}
      </div>

      {/* ── Mid-level mission complete (more missions remaining) ── */}
      {mission && missionComplete && !isLevelComplete && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/70">
          <div className="w-[90%] max-w-100 rounded-2xl border border-border bg-(--bg-elevated) p-10 text-center">
            <h2 className="mb-5 text-2xl font-bold text-foreground font-grotesk">
              Mission Complete! 🎉
            </h2>
            <div className="mb-7 flex flex-col gap-2">
              <div className="font-mono text-sm text-(--text-secondary)">
                XP Earned: <strong>+{mission.xp} XP</strong>
              </div>
              <div className="font-mono text-sm text-(--text-secondary)">
                Time: <strong>{formatTime(timer)}</strong>
              </div>
              <div className="font-mono text-sm text-(--text-secondary)">
                Steps: <strong>{mission.steps.length} / {mission.steps.length}</strong>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                className="flex-1 rounded-lg border border-border bg-transparent px-4 py-2.5 text-sm font-semibold font-grotesk"
                onClick={() => navigate(`/modules/${slug}`)}
              >
                Back to Module
              </button>
              <button
                className="flex-1 rounded-lg bg-(--accent) px-4 py-2.5 text-sm font-semibold text-white font-grotesk hover:bg-(--accent-hover)"
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
