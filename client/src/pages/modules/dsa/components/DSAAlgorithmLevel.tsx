import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { ArrowLeft, Eye, Brain, Code2, Lock, Check } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { GenericTracePanel } from "./GenericTracePanel"
import { SolvePanel } from "./SolvePanel"
import { CodePanel } from "./CodePanel"
import type { TraceQuestion, SolveProblem } from "@/lib/algorithms/binarySearchChallenges"
import type { DSAStep } from "@/types/dsa.types"
import { useProgressSync } from "@/hooks/useProgressSync"

type Tab = "trace" | "solve" | "code"

const TABS: { id: Tab; label: string; icon: typeof Eye; sub: string }[] = [
  { id: "trace", label: "Trace", icon: Eye, sub: "Step through the algorithm" },
  { id: "solve", label: "Solve", icon: Brain, sub: "Apply without visuals" },
  { id: "code", label: "Code", icon: Code2, sub: "Write the implementation" },
]

interface DSAAlgorithmLevelProps {
  title: string
  levelNumber: number
  totalXp: number
  steps: DSAStep[]
  traceQuestions: TraceQuestion[]
  solveProblems: SolveProblem[]
  renderVisualizer: (step: DSAStep) => React.ReactNode
  codeXp?: number
}

export default function DSAAlgorithmLevel({
  title,
  levelNumber,
  totalXp,
  steps,
  traceQuestions,
  solveProblems,
  renderVisualizer,
  codeXp = 50,
}: DSAAlgorithmLevelProps) {
  const { completeLevel } = useProgressSync("dsa")
  const [activeTab, setActiveTab] = useState<Tab>("trace")
  const [completedTabs, setCompletedTabs] = useState<Set<Tab>>(new Set())
  const [traceXp, setTraceXp] = useState(0)
  const [solveXp, setSolveXp] = useState(0)
  const [codeXpEarned, setCodeXpEarned] = useState(0)

  const currentXp = traceXp + solveXp + codeXpEarned
  const fullTotalXp = totalXp + codeXp

  const handleTabComplete = useCallback((tab: Tab) => {
    setCompletedTabs((prev) => {
      const next = new Set([...prev, tab])
      if (next.size === 3) {
        completeLevel(levelNumber, traceXp + solveXp + codeXpEarned)
      }
      return next
    })
  }, [completeLevel, levelNumber, traceXp, solveXp, codeXpEarned])

  const isTabLocked = (tab: Tab): boolean => {
    if (tab === "trace") return false
    if (tab === "solve") return !completedTabs.has("trace")
    if (tab === "code") return !completedTabs.has("solve")
    return false
  }

  const switchTab = (tab: Tab) => {
    if (!isTabLocked(tab)) setActiveTab(tab)
  }

  const progressPercent = Math.round((currentXp / fullTotalXp) * 100)

  return (
    <div className="flex min-h-full flex-col gap-5 py-2 font-sans">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/modules/dsa"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-(--bg-elevated) text-(--text-secondary) transition-colors hover:text-foreground hover:border-(--border-hover)"
          >
            <ArrowLeft size={15} />
          </Link>
          <div>
            <h1 className="text-[16px] font-semibold font-grotesk text-foreground">
              {title}
            </h1>
            <p className="text-[12px] text-(--text-tertiary)">Level {levelNumber}</p>
          </div>
        </div>

        {/* XP pill */}
        <div className="flex items-center gap-2.5 rounded-lg border border-border bg-(--bg-elevated) pl-3 pr-2 py-1.5">
          <div className="flex items-baseline gap-1">
            <span className="text-[14px] font-semibold text-[#F59E0B] tabular-nums">{currentXp}</span>
            <span className="text-[11px] text-(--text-tertiary)">/ {fullTotalXp} XP</span>
          </div>
          <Progress value={progressPercent} className="h-1.5 w-20" indicatorColor="#F59E0B" />
        </div>
      </div>

      {/* Tab selector */}
      <div className="grid grid-cols-3 gap-2">
        {TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          const isCompleted = completedTabs.has(tab.id)
          const locked = isTabLocked(tab.id)

          return (
            <button
              key={tab.id}
              onClick={() => switchTab(tab.id)}
              disabled={locked}
              className={[
                "relative flex items-center gap-3 rounded-xl border px-4 py-3.5 text-left transition-all duration-150",
                locked
                  ? "border-transparent bg-(--bg-elevated)/50 opacity-40 cursor-not-allowed"
                  : isActive
                    ? "border-[#6C47FF]/40 bg-[#6C47FF]/6 shadow-[0_0_0_1px_rgba(108,71,255,0.08)]"
                    : "border-border bg-(--bg-elevated) hover:border-(--border-hover) cursor-pointer",
              ].join(" ")}
            >
              <div className={[
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[13px] font-semibold transition-colors",
                isCompleted
                  ? "bg-green-500/12 text-green-500"
                  : isActive
                    ? "bg-[#6C47FF]/12 text-[#6C47FF]"
                    : locked
                      ? "bg-(--bg-surface) text-(--text-tertiary)"
                      : "bg-(--bg-surface) text-(--text-secondary)",
              ].join(" ")}>
                {locked ? <Lock size={14} /> : isCompleted ? <Check size={16} strokeWidth={2.5} /> : <Icon size={16} />}
              </div>

              <div className="min-w-0 flex-1">
                <p className={`text-[13px] font-medium leading-none ${isActive ? "text-foreground" : "text-(--text-secondary)"}`}>
                  {tab.label}
                </p>
                <p className="mt-1 text-[11px] leading-none text-(--text-tertiary)">{tab.sub}</p>
              </div>

              {isActive && (
                <motion.div
                  layoutId="activeTabBar"
                  className="absolute -bottom-px left-3 right-3 h-0.5 rounded-full bg-[#6C47FF]"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0">
        {activeTab === "trace" && (
          <GenericTracePanel
            steps={steps}
            questions={traceQuestions}
            renderVisualizer={renderVisualizer}
            onXpChange={setTraceXp}
            onComplete={() => handleTabComplete("trace")}
          />
        )}
        {activeTab === "solve" && (
          <SolvePanel
            problems={solveProblems}
            onXpChange={setSolveXp}
            onComplete={() => handleTabComplete("solve")}
          />
        )}
        {activeTab === "code" && (
          <CodePanel
            onXpChange={setCodeXpEarned}
            onComplete={() => handleTabComplete("code")}
          />
        )}
      </div>
    </div>
  )
}
