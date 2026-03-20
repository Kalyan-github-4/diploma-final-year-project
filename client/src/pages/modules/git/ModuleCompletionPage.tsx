import { useNavigate, useParams, Link } from "react-router-dom"
import { useState } from "react"
import { ArrowLeft, Crown, Target, Zap, RotateCcw, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { renderGitIcon } from "@/pages/modules/git/git-icons"
import {
  gitLevels,
  gitBadges,
  loadModuleProgress,
} from "@/pages/modules/git/levels.data"

export default function ModuleCompletionPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [progress] = useState(() => loadModuleProgress(slug ?? ""))

  const completedCount = progress.completedLevels.length
  const totalLevels = gitLevels.length
  const allComplete = completedCount >= totalLevels

  const progressPercent = Math.round((completedCount / totalLevels) * 100)

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">

      {/* ── Back link ── */}
      <Link
        to={`/modules/${slug}`}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft size={14} />
        Back to Module Map
      </Link>

      {/* ── Hero ── */}
      <div className="text-center mb-10">
        <div className="mb-4 flex justify-center">
          {allComplete ? <Crown size={56} className="text-(--accent)" /> : <Target size={56} className="text-(--accent)" />}
        </div>
        <h1 className="text-3xl font-bold font-grotesk text-foreground">
          {allComplete ? "Git & GitHub King!" : "Great Progress!"}
        </h1>
        <p className="text-muted-foreground mt-2">
          {allComplete
            ? "You completed the full path from basics to advanced real-world workflows."
            : `You've completed ${completedCount} of ${totalLevels} levels. Keep going!`}
        </p>
      </div>

      {/* ── Stats grid ── */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-(--bg-elevated) border border-border rounded-2xl p-5 text-center">
          <div className="text-2xl font-bold font-grotesk text-foreground">
            {completedCount}/{totalLevels}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Levels Done</div>
        </div>

        <div className="bg-(--bg-elevated) border border-border rounded-2xl p-5 text-center">
          <div className="flex items-center justify-center gap-1 text-2xl font-bold font-grotesk text-orange-400">
            <Zap size={20} />
            {progress.totalXpEarned}
          </div>
          <div className="text-xs text-muted-foreground mt-1">XP Earned</div>
        </div>

        <div className="bg-(--bg-elevated) border border-border rounded-2xl p-5 text-center">
          <div className="text-2xl font-bold font-grotesk text-foreground">
            {progressPercent}%
          </div>
          <div className="text-xs text-muted-foreground mt-1">Complete</div>
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div className="mb-8">
        <div className="flex justify-between text-xs text-muted-foreground mb-2">
          <span>Overall Progress</span>
          <span>{completedCount} / {totalLevels} levels</span>
        </div>
        <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{ width: `${progressPercent}%`, background: "#F97316" }}
          />
        </div>
      </div>

      {/* ── Badges ── */}
      <div className="mb-8">
        <h2 className="text-base font-bold font-grotesk text-foreground mb-4">
          Badges Earned
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {gitBadges.map((badge) => {
            const earned = badge.minLevels <= completedCount
            return (
              <div
                key={badge.id}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all ${
                  earned
                    ? "bg-(--bg-elevated) border-orange-500/30"
                    : "bg-muted/30 border-border opacity-40"
                }`}
              >
                <span className={`text-3xl ${earned ? "" : "grayscale"}`}>
                  {renderGitIcon(badge.icon, 28, earned ? "text-(--accent)" : "text-muted-foreground")}
                </span>
                <span className="text-xs font-medium text-center text-foreground leading-tight">
                  {badge.label}
                </span>
                <span className="text-[10px] text-muted-foreground text-center">
                  {badge.description}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Level summary list ── */}
      <div className="mb-8">
        <h2 className="text-base font-bold font-grotesk text-foreground mb-4">
          Level Summary
        </h2>
        <div className="space-y-2">
          {gitLevels.map((level) => {
            const done = progress.completedLevels.includes(level.id)
            return (
              <div
                key={level.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-(--bg-elevated) border border-border"
              >
                <span className="w-7 text-center text-(--accent)">{renderGitIcon(level.icon, 18, "text-(--accent)")}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-medium text-foreground">
                    {level.title}
                  </span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {level.subtitle}
                  </span>
                </div>
                {done ? (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/15 text-green-400 font-medium shrink-0">
                    ✓ Done
                  </span>
                ) : (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground shrink-0">
                    Available
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Actions ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          className="flex-1 rounded-xl gap-2"
          onClick={() => navigate(`/modules/${slug}`)}
        >
          <RotateCcw size={15} />
          Back to Level Map
        </Button>

        <Button
          className="flex-1 rounded-xl gap-2 bg-orange-500 hover:bg-orange-600"
          onClick={() => navigate("/modules")}
        >
          <ArrowRight size={15} />
          Explore More Modules
        </Button>
      </div>

    </div>
  )
}
