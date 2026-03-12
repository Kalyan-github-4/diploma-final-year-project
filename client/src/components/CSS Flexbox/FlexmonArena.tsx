import { useState, useCallback } from "react"
import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import QuestionPanel from "./Flexbox King/QuestionPanel"
import BattleArena from "./Flexbox King/BattleArena"
import { pokemonLevels } from "./levels/pokemonLevels"

export default function FlexmonArena() {
  const [levelIndex, setLevelIndex] = useState(0)
  const [cssInput, setCssInput] = useState("")
  const [completedLevels, setCompletedLevels] = useState<Set<number>>(
    new Set()
  )

  const currentLevel = pokemonLevels[levelIndex]
  const isComplete = completedLevels.has(currentLevel.id)

  const handleVictory = useCallback(() => {
    setCompletedLevels((prev) => {
      const next = new Set(prev)
      next.add(currentLevel.id)
      return next
    })
  }, [currentLevel.id])

  const handleNextLevel = useCallback(() => {
    if (levelIndex < pokemonLevels.length - 1) {
      setLevelIndex((i) => i + 1)
      setCssInput("")
    }
  }, [levelIndex])

  const handlePrevLevel = useCallback(() => {
    if (levelIndex > 0) {
      setLevelIndex((i) => i - 1)
      setCssInput("")
    }
  }, [levelIndex])

  const navigate = useNavigate()

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/modules")}
            className="p-1.5 rounded-lg hover:bg-(--bg-elevated) transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-(--text-secondary)" />
          </button>
          <h1 className="text-lg font-bold font-grotesk text-(--text-primary)">
            Flexmon Arena
          </h1>
        </div>

        <div className="flex items-center gap-4 text-sm font-sans text-(--text-secondary)">
          <span>
            Levels Cleared:{" "}
            <span className="text-green-400 font-bold">
              {completedLevels.size}
            </span>
            /{pokemonLevels.length}
          </span>
          <span>
            Total XP:{" "}
            <span className="text-yellow-400 font-bold">
              {pokemonLevels
                .filter((l) => completedLevels.has(l.id))
                .reduce((sum, l) => sum + l.rewardXP, 0)}
            </span>
          </span>
        </div>
      </div>

      {/* Split Layout */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden">
        {/* Left: Question Panel */}
        <QuestionPanel
          level={currentLevel}
          cssInput={cssInput}
          onCodeChange={setCssInput}
          onNextLevel={handleNextLevel}
          onPrevLevel={handlePrevLevel}
          currentLevelIndex={levelIndex}
          totalLevels={pokemonLevels.length}
          isComplete={isComplete}
        />

        {/* Right: Monster Arena */}
        <BattleArena
          cssInput={cssInput}
          level={currentLevel}
          isComplete={isComplete}
          onVictory={handleVictory}
        />
      </div>
    </div>
  )
}
