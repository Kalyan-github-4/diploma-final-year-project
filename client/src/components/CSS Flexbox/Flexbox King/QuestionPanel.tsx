"use client"

import { useState } from "react"
import { Swords, Lightbulb, ChevronRight, ChevronLeft } from "lucide-react"
import type { PokemonLevel } from "../levels/pokemonLevels"

// ─── Props ───────────────────────────────────────────────

interface QuestionPanelProps {
  level: PokemonLevel
  cssInput: string
  onCodeChange: (css: string) => void
  onNextLevel: () => void
  onPrevLevel: () => void
  currentLevelIndex: number
  totalLevels: number
  isComplete: boolean
}

// ─── Sub-components ──────────────────────────────────────

/** Level header with navigation, description, tags, and hint toggle */
function LevelHeader({
  level,
  currentLevelIndex,
  totalLevels,
  onPrevLevel,
  onNextLevel,
}: Readonly<{
  level: PokemonLevel
  currentLevelIndex: number
  totalLevels: number
  onPrevLevel: () => void
  onNextLevel: () => void
}>) {
  const [showHint, setShowHint] = useState(false)
  const [prevLevelId, setPrevLevelId] = useState(level.id)

  // Reset hint when the level changes (React-recommended pattern)
  if (prevLevelId !== level.id) {
    setPrevLevelId(level.id)
    setShowHint(false)
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-5">
      {/* Top row: level badge + navigation */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Swords className="w-5 h-5 text-red-400" />
          <span className="text-xs font-medium uppercase tracking-wider text-red-400">
            Level {level.id}
          </span>
          {level.category && (
            <span className="text-[10px] uppercase tracking-wider text-(--text-primary) bg-white/5 px-2 py-0.5 rounded-full">
              {level.category}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={onPrevLevel}
            disabled={currentLevelIndex === 0}
            className="p-1 rounded-md hover:bg-white/10 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs text-(--text-secondary) px-1 ">
            {currentLevelIndex + 1}/{totalLevels}
          </span>
          <button
            onClick={onNextLevel}
            disabled={currentLevelIndex === totalLevels - 1}
            className="p-1 rounded-md hover:bg-white/10 disabled:opacity-30 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Title & description */}
      <h2 className="text-xl font-semibold font-grotesk text-(--text-primary)">
        {level.title}
      </h2>
      <p className="text-xs text-(--text-secondary) font-sans mt-1">{level.description}</p>

      {/* Tags */}
      <div className="flex items-center gap-2 mt-3 flex-wrap">
        <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded-full">
          +{level.rewardXP} XP
        </span>
        <span className="font-grotesk text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full">
          {level.pokemonNames.map((p) => p.name).join(", ")}
        </span>
      </div>

      {/* Hint toggle */}
      <button
        onClick={() => setShowHint((prev) => !prev)}
        className="mt-3 flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 transition-colors"
      >
        <Lightbulb className="w-3.5 h-3.5" />
        {showHint ? "Hide Hint" : "Show Hint"}
      </button>
      {showHint && (
        <p className="mt-2 text-xs text-amber-300/80 bg-amber-500/10 rounded-lg px-3 py-2 border border-amber-500/20">
          {level.hint}
        </p>
      )}
    </div>
  )
}

/** Mock code-editor with syntax-highlighted context lines */
function CssEditor({
  cssInput,
  onCodeChange,
}: Readonly<{
  cssInput: string
  onCodeChange: (css: string) => void
}>) {
  return (
    <div className="flex-1 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden flex flex-col">
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/10 bg-white/5">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <div className="w-3 h-3 rounded-full bg-green-500/70" />
        </div>
        <span className="text-xs text-(--text-primary) font-sans ml-2 font-mono">
          style.css
        </span>
      </div>

      {/* Read-only context (pre-set CSS) */}
      <div className="px-4 py-3 text-xs font-mono text-(--text-primary) border-b border-white/5 select-none">
        <span className="text-purple-400">.arena</span>{" "}
        <span className="text-white">{"{"}</span>
        <br />
        <span className="ml-4 text-blue-400">display</span>
        <span className="text-white">:</span>{" "}
        <span className="text-green-400">flex</span>
        <span className="text-white">;</span>
        <br />
        <span className="ml-4 text-blue-400">height</span>
        <span className="text-white">:</span>{" "}
        <span className="text-green-400">100%</span>
        <span className="text-white">;</span>
      </div>

      {/* Editable textarea */}
      <textarea
        value={cssInput}
        onChange={(e) => onCodeChange(e.target.value)}
        placeholder={`  /* Write your CSS here */\n  justify-content: center;\n  align-items: flex-start;`}
        spellCheck={false}
        style={{ outline: "none", boxShadow: "none" }}
        className="flex-1 w-full bg-transparent text-sm font-mono text-green-400 p-4 resize-none outline-none ring-0 shadow-none border-none focus:ring-0 focus:outline-none focus:border-transparent focus:shadow-none focus-visible:outline-none placeholder:text-white/20 caret-green-400"
      />

      {/* Closing brace */}
      <div className="px-4 py-3 text-xs font-mono text-(--text-primary) border-t border-white/5 select-none">
        <span className="text-white">{"}"}</span>
      </div>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────

export default function QuestionPanel({
  level,
  cssInput,
  onCodeChange,
  onNextLevel,
  onPrevLevel,
  currentLevelIndex,
  totalLevels,
  isComplete,
}: Readonly<QuestionPanelProps>) {
  return (
    <div className="flex flex-col h-full gap-4">
      <LevelHeader
        level={level}
        currentLevelIndex={currentLevelIndex}
        totalLevels={totalLevels}
        onPrevLevel={onPrevLevel}
        onNextLevel={onNextLevel}
      />

      <CssEditor cssInput={cssInput} onCodeChange={onCodeChange} />

      {/* Victory banner */}
      {isComplete && (
        <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-center">
          <p className="text-green-400 font-bold font-game text-lg">
            Pokémon Caught!
          </p>
          <p className="text-xs text-green-300/70 mt-1">
            +{level.rewardXP} XP earned
          </p>
        </div>
      )}
    </div>
  )
}
