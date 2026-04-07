import { AlignJustify, ArrowUpDown, Brain, ChevronsRight, Eye, Gauge, GripVertical, Layers, Network, Pause, Play, RotateCcw, Route, Search, SkipBack, SkipForward } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { DSAAlgorithm, PlaybackState } from "@/types/dsa.types"

interface DSAHeaderControlsProps {
  algorithm: DSAAlgorithm
  algorithmLabel: string
  playback: PlaybackState
  isQuestionAnswered: boolean
  onModeChange: (value: PlaybackState["mode"]) => void
  onReplay: () => void
  onBack: () => void
  onTogglePlay: () => void
  onNext: () => void
  onEnd: () => void
  onSpeedChange: (value: number) => void
}

export function DSAHeaderControls({
  algorithm,
  algorithmLabel,
  playback,
  isQuestionAnswered,
  onModeChange,
  onReplay,
  onBack,
  onTogglePlay,
  onNext,
  onEnd,
  onSpeedChange,
}: DSAHeaderControlsProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-(--card-border) bg-card p-3">
      <div>
        <p className="m-0 text-xs text-(--text-secondary) font-grotesk">Algorithm</p>
        <h1 className="m-0 inline-flex items-center gap-2 text-[20px] font-bold font-grotesk">
          {algorithm === "binary-search" ? (
            <Search className="size-5" aria-hidden="true" />
          ) : algorithm === "bfs" ? (
            <Network className="size-5" aria-hidden="true" />
          ) : algorithm === "stack" ? (
            <Layers className="size-5" aria-hidden="true" />
          ) : algorithm === "queue" ? (
            <AlignJustify className="size-5" aria-hidden="true" />
          ) : algorithm === "dijkstra" ? (
            <Route className="size-5" aria-hidden="true" />
          ) : (
            <ArrowUpDown className="size-5" aria-hidden="true" />
          )}
          <span>{algorithmLabel}</span>
        </h1>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <Select value={playback.mode} onValueChange={(value) => onModeChange(value as PlaybackState["mode"])}>
            <SelectTrigger className="h-9 min-w-36 rounded-[10px] border-border bg-background text-foreground shadow-none hover:border-(--border-hover) hover:bg-(--bg-surface)">
              <SelectValue placeholder="Select mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="watch">
                <span className="inline-flex items-center gap-2">
                  <Eye className="size-4" aria-hidden="true" />
                  Watch
                </span>
              </SelectItem>
              <SelectItem value="predict">
                <span className="inline-flex items-center gap-2">
                  <Brain className="size-4" aria-hidden="true" />
                  Predict
                </span>
              </SelectItem>
              <SelectItem value="build">
                <span className="inline-flex items-center gap-2">
                  <GripVertical className="size-4" aria-hidden="true" />
                  Build
                </span>
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={String(playback.speedMs)} onValueChange={(value) => onSpeedChange(Number(value))}>
            <SelectTrigger className="h-9 min-w-36 rounded-[10px] border-border bg-background text-foreground shadow-none hover:border-(--border-hover) hover:bg-(--bg-surface)">
              <SelectValue placeholder="Speed" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1200">
                <span className="inline-flex items-center gap-2">
                  <Gauge className="size-4" aria-hidden="true" />
                  Slow
                </span>
              </SelectItem>
              <SelectItem value="900">
                <span className="inline-flex items-center gap-2">
                  <Gauge className="size-4" aria-hidden="true" />
                  Normal
                </span>
              </SelectItem>
              <SelectItem value="600">
                <span className="inline-flex items-center gap-2">
                  <Gauge className="size-4" aria-hidden="true" />
                  Fast
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button className="h-8.5 rounded-lg" onClick={onReplay}>
          <RotateCcw className="size-4" aria-hidden="true" />
          Reset
        </Button>
        <Button className="h-8.5 rounded-lg" onClick={onBack}>
          <SkipBack className="size-4" aria-hidden="true" />
          Back
        </Button>
        <Button className="h-8.5 rounded-lg" onClick={onTogglePlay} disabled={playback.mode === "predict"}>
          {playback.isPlaying ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
          {playback.isPlaying ? "Pause" : "Play"}
        </Button>
        <Button className="h-8.5 rounded-lg" onClick={onNext} disabled={!isQuestionAnswered}>
          <SkipForward className="size-4" aria-hidden="true" />
          Next
        </Button>
        <Button className="h-8.5 rounded-lg" onClick={onEnd}>
          <ChevronsRight className="size-4" aria-hidden="true" />
          End
        </Button>

      </div>
    </div>
  )
}