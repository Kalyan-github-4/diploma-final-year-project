import { Trophy, ChevronRight, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { CssChallenge } from "../types"

interface VictoryModalProps {
  challenge: CssChallenge
  stars: number
  isLastChallenge: boolean
  onNext: () => void
  onStay: () => void
}

export default function VictoryModal({
  challenge,
  stars,
  isLastChallenge,
  onNext,
  onStay,
}: VictoryModalProps) {
  const topicColor = challenge.topic === "flexbox" ? "#6366f1" : "#06b6d4"

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm mx-4 rounded-2xl border border-border bg-(--bg-elevated) p-8 shadow-2xl text-center">
        {/* Icon */}
        <div
          className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl"
          style={{ background: topicColor + "18" }}
        >
          <Trophy size={32} style={{ color: topicColor }} />
        </div>

        {/* Title */}
        <h2 className="font-grotesk text-2xl font-bold text-foreground mb-1">
          Challenge Complete!
        </h2>
        <p className="text-sm text-(--text-secondary) mb-5">
          You nailed <strong className="text-foreground">{challenge.title}</strong>
        </p>

        {/* XP badge */}
        <div
          className="inline-flex items-center gap-2 rounded-xl px-5 py-3 mb-6"
          style={{ background: topicColor + "12", border: `1px solid ${topicColor}30` }}
        >
          <span className="font-mono text-2xl font-black" style={{ color: topicColor }}>
            +{challenge.xp}
          </span>
          <span className="text-sm font-semibold text-(--text-secondary)">XP earned</span>
        </div>

        {/* Stars */}
        <div className="flex justify-center gap-2 mb-7">
          {[1, 2, 3].map((s) => (
            <span key={s} className="text-2xl" style={{ opacity: s <= stars ? 1 : 0.25 }}>
              ⭐
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          {!isLastChallenge ? (
            <Button onClick={onNext} className="w-full rounded-xl gap-2">
              Next Challenge
              <ChevronRight size={16} />
            </Button>
          ) : (
            <Button onClick={onNext} className="w-full rounded-xl gap-2">
              See Summary
              <Trophy size={16} />
            </Button>
          )}
          <button
            onClick={onStay}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm text-(--text-tertiary) transition-colors hover:text-(--text-secondary) hover:bg-(--bg-surface)"
          >
            <RotateCcw size={13} />
            Stay here
          </button>
        </div>
      </div>
    </div>
  )
}
