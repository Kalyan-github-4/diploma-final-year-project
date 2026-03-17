import { useNavigate } from "react-router-dom"
import type { LevelData } from "./levels.data"
import { Button } from "@/components/ui/button"

interface LevelCompletionModalProps {
  levelData: LevelData
  moduleSlug: string
  timer: number
  hintsUsed: number
  isLastLevel: boolean
  onRetry: () => void
  onNextLevel: () => void
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0")
  const s = (seconds % 60).toString().padStart(2, "0")
  return `${m}:${s}`
}

function computeStars(hintsUsed: number): number {
  if (hintsUsed === 0) return 3
  if (hintsUsed <= 2) return 2
  return 1
}

export default function LevelCompletionModal({
  levelData,
  moduleSlug,
  timer,
  hintsUsed,
  isLastLevel,
  onRetry,
  onNextLevel,
}: LevelCompletionModalProps) {
  const navigate = useNavigate()
  const stars = computeStars(hintsUsed)

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-(--bg-elevated) border border-border rounded-2xl p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">

        {/* ── Header ── */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">{isLastLevel ? "🏆" : "🎉"}</div>
          <h2 className="text-2xl font-bold font-grotesk text-foreground">
            {isLastLevel ? "Module Complete!" : "Level Complete!"}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            <span className="font-medium text-foreground">{levelData.title}</span>
            {" "}&mdash; {levelData.subtitle}
          </p>
        </div>

        {/* ── Stars ── */}
        <div className="flex justify-center gap-3 mb-6">
          {[1, 2, 3].map((s) => (
            <span
              key={s}
              className={`text-3xl transition-all duration-300 ${
                s <= stars ? "opacity-100 scale-110" : "opacity-20"
              }`}
            >
              ⭐
            </span>
          ))}
        </div>

        {/* ── Stats ── */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-background border border-border rounded-xl p-3 text-center">
            <div className="text-lg font-bold font-grotesk text-foreground">
              +{levelData.xp}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">XP Earned</div>
          </div>

          <div className="bg-background border border-border rounded-xl p-3 text-center">
            <div className="text-lg font-bold font-grotesk text-foreground">
              {formatTime(timer)}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">Time</div>
          </div>

          <div className="bg-background border border-border rounded-xl p-3 text-center">
            <div className="text-lg font-bold font-grotesk text-foreground">
              {hintsUsed === 0 ? "None" : hintsUsed}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">Hints Used</div>
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="flex flex-col gap-3">
          {/* Primary: next level or module summary */}
          {isLastLevel ? (
            <Button
              className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors"
              onClick={() => navigate(`/modules/${moduleSlug}/complete`)}
            >
              View Module Summary 🏆
            </Button>
          ) : (
            <Button
              className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors"
              onClick={onNextLevel}
            >
              Next Level →
            </Button>
          )}

          {/* Secondary: retry with fresh AI questions */}
          <Button
            className="w-full py-3 rounded-xl border border-border hover:bg-background text-foreground font-medium transition-colors"
            onClick={onRetry}
          >
            Retry with New Questions
          </Button>

          {/* Tertiary: back to level map */}
          <Button
            className="text-sm text-muted-foreground hover:text-foreground transition-colors mt-1"
            onClick={() => navigate(`/modules/${moduleSlug}`)}
          >
            ← Back to Module Map
          </Button>
        </div>

      </div>
    </div>
  )
}
