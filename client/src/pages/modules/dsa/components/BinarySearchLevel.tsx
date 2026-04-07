import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { ArrowLeft, Eye, Brain, Code2, Lock, Check } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { TracePanel } from "./TracePanel"
import { SolvePanel } from "./SolvePanel"
import { CodePanel } from "./CodePanel"
import { LEVEL_TOTAL_XP, BINARY_SEARCH_SOLVE_PROBLEMS } from "@/lib/algorithms/binarySearchChallenges"
import { useProgressSync } from "@/hooks/useProgressSync"

type Tab = "trace" | "solve" | "code"

const TABS: { id: Tab; label: string; icon: typeof Eye; sub: string }[] = [
  { id: "trace", label: "Trace", icon: Eye, sub: "Step through the algorithm" },
  { id: "solve", label: "Solve", icon: Brain, sub: "Apply without visuals" },
  { id: "code", label: "Code", icon: Code2, sub: "Write the implementation" },
]

const LEVEL_ID = 1

export default function BinarySearchLevel() {
  const { completeLevel } = useProgressSync("dsa")
  const [activeTab, setActiveTab] = useState<Tab>("trace")
  const [completedTabs, setCompletedTabs] = useState<Set<Tab>>(new Set())
  const [traceXp, setTraceXp] = useState(0)
  const [solveXp, setSolveXp] = useState(0)
  const [codeXp, setCodeXp] = useState(0)

  const totalXp = traceXp + solveXp + codeXp

  const handleTabComplete = useCallback((tab: Tab) => {
    setCompletedTabs((prev) => {
      const next = new Set([...prev, tab])
      // When all 3 tabs done, persist to DB
      if (next.size === 3) {
        completeLevel(LEVEL_ID, traceXp + solveXp + codeXp)
      }
      return next
    })
  }, [completeLevel, traceXp, solveXp, codeXp])

  const isTabLocked = (tab: Tab): boolean => {
    if (tab === "trace") return false
    if (tab === "solve") return !completedTabs.has("trace")
    if (tab === "code") return !completedTabs.has("solve")
    return false
  }

  const switchTab = (tab: Tab) => {
    if (!isTabLocked(tab)) setActiveTab(tab)
  }

  const progressPercent = Math.round((totalXp / LEVEL_TOTAL_XP) * 100)

  return (
    <div className="flex min-h-full flex-col gap-5 py-2 font-sans">
      {/* ── Header ── */}
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
              Binary Search
            </h1>
            <p className="text-[12px] text-(--text-tertiary)">Level 1</p>
          </div>
        </div>

        {/* XP pill */}
        <div className="flex items-center gap-2.5 rounded-lg border border-border bg-(--bg-elevated) pl-3 pr-2 py-1.5">
          <div className="flex items-baseline gap-1">
            <span className="text-[14px] font-semibold text-[#F59E0B] tabular-nums">{totalXp}</span>
            <span className="text-[11px] text-(--text-tertiary)">/ {LEVEL_TOTAL_XP} XP</span>
          </div>
          <Progress value={progressPercent} className="h-1.5 w-20" indicatorColor="#F59E0B" />
        </div>
      </div>

      {/* ── Tab selector ── */}
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
              {/* Step indicator */}
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

              {/* Bottom bar */}
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

      {/* ── Content ── */}
      <div className="flex-1 min-h-0">
        {activeTab === "trace" && (
          <TracePanel onXpChange={setTraceXp} onComplete={() => handleTabComplete("trace")} />
        )}
        {activeTab === "solve" && (
          <SolvePanel problems={BINARY_SEARCH_SOLVE_PROBLEMS} onXpChange={setSolveXp} onComplete={() => handleTabComplete("solve")} />
        )}
        {activeTab === "code" && (
          <CodePanel onXpChange={setCodeXp} onComplete={() => handleTabComplete("code")} />
        )}
      </div>
    </div>
  )
}
