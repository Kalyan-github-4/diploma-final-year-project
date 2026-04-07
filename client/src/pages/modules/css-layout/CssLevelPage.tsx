import { useState, useEffect, useMemo, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { CSS_CHALLENGES } from "./data/challenges.data"
import { validateCss } from "./lib/validate"
import { loadModuleProgress, saveModuleProgress } from "../git/levels.data"
import { useProgressSync } from "@/hooks/useProgressSync"
import CssTopBar from "./components/CssTopBar"
import LayoutPreview from "./components/LayoutPreview"
import CssEditor from "./components/CssEditor"
import GoalPanel from "./components/GoalPanel"
import VictoryModal from "./components/VictoryModal"

const SLUG = "css-layout"

export default function CssLevelPage() {
  const { levelId } = useParams<{ levelId: string }>()
  const navigate = useNavigate()
  const { completeLevel: syncLevel } = useProgressSync(SLUG)

  const levelNum = parseInt(levelId ?? "1", 10)        // 1-based
  const challengeIndex = levelNum - 1                  // 0-based
  const challenge = CSS_CHALLENGES[challengeIndex] ?? CSS_CHALLENGES[0]

  const [completedLevels, setCompletedLevels] = useState<Set<number>>(
    () => new Set(loadModuleProgress(SLUG).completedLevels)
  )

  /* Per-level editor state — reset when level changes (setState during render) */
  const [prevChallengeId, setPrevChallengeId] = useState(challenge.id)
  const [userCss, setUserCss] = useState(challenge.startingCss)
  const [showHint, setShowHint] = useState(false)
  const [hintUsed, setHintUsed] = useState(false)
  const [showVictory, setShowVictory] = useState(false)

  if (prevChallengeId !== challenge.id) {
    setPrevChallengeId(challenge.id)
    setUserCss(challenge.startingCss)
    setShowHint(false)
    setHintUsed(false)
    setShowVictory(false)
  }

  const matchPercent = useMemo(
    () => validateCss(userCss, challenge.requiredProperties),
    [userCss, challenge.requiredProperties],
  )

  /* Auto-detect victory — setState during render (no effect needed) */
  if (matchPercent === 100 && !completedLevels.has(levelNum) && !showVictory) {
    setShowVictory(true)
    setCompletedLevels((prev) => new Set([...prev, levelNum]))
    syncLevel(levelNum, challenge.xp)
  }

  /* Persist progress to localStorage when completedLevels changes — no setState here */
  useEffect(() => {
    const totalXpEarned = [...completedLevels].reduce(
      (sum, id) => sum + (CSS_CHALLENGES[id - 1]?.xp ?? 0),
      0,
    )
    saveModuleProgress(SLUG, { completedLevels: [...completedLevels], totalXpEarned })
  }, [completedLevels])

  const goNext = useCallback(() => {
    if (challengeIndex < CSS_CHALLENGES.length - 1) {
      navigate(`/modules/${SLUG}/level/${levelNum + 1}`)
    } else {
      navigate(`/modules/${SLUG}`)
    }
  }, [challengeIndex, levelNum, navigate])

  const goPrev = useCallback(() => {
    if (challengeIndex > 0) {
      navigate(`/modules/${SLUG}/level/${levelNum - 1}`)
    }
  }, [challengeIndex, levelNum, navigate])

  // Map completed level numbers to challenge string IDs for CssTopBar dot indicator
  const completedIds = useMemo(
    () => new Set([...completedLevels].map((n) => CSS_CHALLENGES[n - 1]?.id ?? "")),
    [completedLevels],
  )

  return (
    <div className="-m-6 flex h-[calc(100%+48px)] flex-col overflow-hidden bg-background">
      <CssTopBar
        challenge={challenge}
        challengeIndex={challengeIndex}
        totalChallenges={CSS_CHALLENGES.length}
        sessionXp={0}
        completedIds={completedIds}
        onPrev={goPrev}
        onNext={goNext}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Left panel — editor + preview */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="border-b border-border" style={{ flex: "0 0 60%" }}>
            <LayoutPreview
              html={challenge.htmlTemplate}
              css={userCss}
              label="Your Layout — live preview"
            />
          </div>
          <div style={{ flex: "0 0 40%" }} className="overflow-hidden">
            <CssEditor
              value={userCss}
              onChange={setUserCss}
              onReset={() => setUserCss(challenge.startingCss)}
            />
          </div>
        </div>

        {/* Right panel — goal + hint */}
        <GoalPanel
          challenge={challenge}
          matchPercent={matchPercent}
          showHint={showHint}
          onToggleHint={() => {
            if (!showHint) setHintUsed(true)
            setShowHint((s) => !s)
          }}
          onSkip={goNext}
        />
      </div>

      {showVictory && (
        <VictoryModal
          challenge={challenge}
          stars={hintUsed ? 2 : 3}
          isLastChallenge={challengeIndex === CSS_CHALLENGES.length - 1}
          onNext={() => {
            setShowVictory(false)
            goNext()
          }}
          onStay={() => setShowVictory(false)}
        />
      )}
    </div>
  )
}
