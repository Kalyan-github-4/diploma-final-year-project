import { useState, useEffect, useMemo, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { CSS_CHALLENGES } from "./data/challenges.data"
import { validateCss } from "./lib/validate"
import CssTopBar from "./components/CssTopBar"
import LayoutPreview from "./components/LayoutPreview"
import CssEditor from "./components/CssEditor"
import GoalPanel from "./components/GoalPanel"
import VictoryModal from "./components/VictoryModal"

const STORAGE_KEY = "codeking-css-layout-progress"

function loadCompletedIds(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Set()
    const parsed = JSON.parse(raw)
    return new Set(Array.isArray(parsed.completedIds) ? parsed.completedIds : [])
  } catch {
    return new Set()
  }
}

function saveCompletedIds(ids: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ completedIds: [...ids] }))
}

export default function CssLayoutPage() {
  const navigate = useNavigate()

  const [challengeIndex, setChallengeIndex] = useState(0)
  const [completedIds, setCompletedIds] = useState<Set<string>>(loadCompletedIds)
  const [sessionXp, setSessionXp] = useState(0)

  const challenge = CSS_CHALLENGES[challengeIndex]

  /* Per-challenge editor state — reset when challenge changes */
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

  /* Live match % */
  const matchPercent = useMemo(
    () => validateCss(userCss, challenge.requiredProperties),
    [userCss, challenge.requiredProperties],
  )

  /* Auto-detect victory — setState during render (no effect needed) */
  if (matchPercent === 100 && !completedIds.has(challenge.id) && !showVictory) {
    const next = new Set(completedIds)
    next.add(challenge.id)
    setCompletedIds(next)
    setShowVictory(true)
    setSessionXp((prev) => prev + challenge.xp)
  }

  /* Persist to localStorage whenever completedIds changes — no setState here */
  useEffect(() => {
    saveCompletedIds(completedIds)
  }, [completedIds])

  const goNext = useCallback(() => {
    if (challengeIndex < CSS_CHALLENGES.length - 1) {
      setChallengeIndex((i) => i + 1)
    } else {
      navigate("/modules")
    }
  }, [challengeIndex, navigate])

  const goPrev = useCallback(() => {
    setChallengeIndex((i) => Math.max(0, i - 1))
  }, [])

  const handleSkip = useCallback(() => {
    if (challengeIndex < CSS_CHALLENGES.length - 1) {
      setChallengeIndex((i) => i + 1)
    }
  }, [challengeIndex])

  const handleReset = useCallback(() => {
    setUserCss(challenge.startingCss)
  }, [challenge.startingCss])

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      {/* Top bar */}
      <CssTopBar
        challenge={challenge}
        challengeIndex={challengeIndex}
        totalChallenges={CSS_CHALLENGES.length}
        sessionXp={sessionXp}
        completedIds={completedIds}
        onPrev={goPrev}
        onNext={goNext}
      />

      {/* Main arena */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel — 75% */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Live preview — top 60% */}
          <div className="border-b border-border" style={{ flex: "0 0 60%" }}>
            <LayoutPreview
              html={challenge.htmlTemplate}
              css={userCss}
              label="Your Layout — live preview"
            />
          </div>

          {/* CSS editor — bottom 40% */}
          <div style={{ flex: "0 0 40%" }} className="overflow-hidden">
            <CssEditor value={userCss} onChange={setUserCss} onReset={handleReset} />
          </div>
        </div>

        {/* Right panel — 25% */}
        <GoalPanel
          challenge={challenge}
          matchPercent={matchPercent}
          showHint={showHint}
          onToggleHint={() => {
            if (!showHint) setHintUsed(true)
            setShowHint((s) => !s)
          }}
          onSkip={handleSkip}
        />
      </div>

      {/* Victory overlay */}
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
