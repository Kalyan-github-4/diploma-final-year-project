import { ArrowUpDown, Brain, ChevronsRight, Eye, Gauge, GripVertical, Pause, Play, RotateCcw, Search, SkipBack, SkipForward } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { DSAAlgorithm, PlaybackState } from "@/types/dsa.types"

interface DSAHeaderControlsProps {
  algorithm: DSAAlgorithm
  algorithmLabel: string
  playback: PlaybackState
  isQuestionAnswered: boolean
  onAlgorithmChange: (value: DSAAlgorithm) => void
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
  onAlgorithmChange,
  onModeChange,
  onReplay,
  onBack,
  onTogglePlay,
  onNext,
  onEnd,
  onSpeedChange,
}: DSAHeaderControlsProps) {
  return (
    <div className="dsa-page__topbar">
      <div>
        <p className="dsa-page__label font-grotesk">Algorithm</p>
        <h1 className="dsa-page__title dsa-page__title--icon font-grotesk">
          {algorithm === "binary-search" ? <Search className="size-5" aria-hidden="true" /> : <ArrowUpDown className="size-5" aria-hidden="true" />}
          <span>{algorithmLabel}</span>
        </h1>
      </div>

      <div className="dsa-page__controls">
        <Select value={algorithm} onValueChange={(value) => onAlgorithmChange(value as DSAAlgorithm)}>
          <SelectTrigger className="dsa-page__select-trigger">
            <SelectValue placeholder="Select algorithm" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="binary-search">
              <Search className="size-4" aria-hidden="true" />
              Binary Search
            </SelectItem>
            <SelectItem value="bubble-sort" className="flex gap-2">
              <ArrowUpDown className="size-4" aria-hidden="true" />
              Bubble Sort
            </SelectItem>
          </SelectContent>
        </Select>

        <Select value={playback.mode} onValueChange={(value) => onModeChange(value as PlaybackState["mode"])}>
          <SelectTrigger className="dsa-page__select-trigger">
            <SelectValue placeholder="Select mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="watch" className="flex gap-2">
              <Eye className="size-4" aria-hidden="true" />
              Watch
            </SelectItem>
            <SelectItem value="predict" className="flex gap-2">
              <Brain className="size-4" aria-hidden="true" />
              Predict
            </SelectItem>
            <SelectItem value="build" className="flex gap-2">
              <GripVertical className="size-4" aria-hidden="true" />
              Build
            </SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={onReplay}>
          <RotateCcw className="size-4" aria-hidden="true" />
          Reset
        </Button>
        <Button onClick={onBack}>
          <SkipBack className="size-4" aria-hidden="true" />
          Back
        </Button>
        <Button onClick={onTogglePlay} disabled={playback.mode === "predict"}>
          {playback.isPlaying ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
          {playback.isPlaying ? "Pause" : "Play"}
        </Button>
        <Button onClick={onNext} disabled={!isQuestionAnswered}>
          <SkipForward className="size-4" aria-hidden="true" />
          Next
        </Button>
        <Button onClick={onEnd}>
          <ChevronsRight className="size-4" aria-hidden="true" />
          End
        </Button>

        <Select value={String(playback.speedMs)} onValueChange={(value) => onSpeedChange(Number(value))}>
          <SelectTrigger className="dsa-page__select-trigger dsa-page__select-trigger--speed">
            <SelectValue placeholder="Speed" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1200">
              <Gauge className="size-4" aria-hidden="true" />
              Slow
            </SelectItem>
            <SelectItem value="900">
              <Gauge className="size-4" aria-hidden="true" />
              Normal
            </SelectItem>
            <SelectItem value="600">
              <Gauge className="size-4" aria-hidden="true" />
              Fast
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}