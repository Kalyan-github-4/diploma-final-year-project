/**
 * Layout Engineering Page - Main Entry Point
 * Wraps the experience with context provider and path selection
 */

import { useState, useMemo } from 'react'
import LayoutArena from '@/components/Layout Engineering/LayoutArena'
import { LayoutEngineeringProvider } from '../../../context/layout-engineering.provider'
import { useLayoutEngineering } from '../../../hooks/useLayoutEngineering'
import { pathMetadata } from '@/lib/layout-paths.data'
import { flexboxChallenges } from '@/pages/modules/layout-engineering/layout-paths/flexbox-path/levels/flexbox-levels.data'
import { gridChallenges } from '@/pages/modules/layout-engineering/layout-paths/grid-path/levels/grid-levels.data'
import { layoutProChallenges } from '@/pages/modules/layout-engineering/layout-paths/layout-pro-path/levels/layout-pro-levels.data'
import type { PathId, LayoutChallenge } from '@/types/layout-engineering.types'

/** All challenges indexed by path */
const challengesByPath: Record<PathId, LayoutChallenge[]> = {
  flexbox: flexboxChallenges,
  grid: gridChallenges,
  'layout-pro': layoutProChallenges,
}

/**
 * Path Selector — shown when no path is active (or user backs out)
 */
function PathSelector({ onStart }: { onStart: (pathId: PathId) => void }) {
  const { pathProgress } = useLayoutEngineering()
  const paths: PathId[] = ['flexbox', 'grid', 'layout-pro']

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        gap: 32,
        padding: 40,
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <h1
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 28,
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: 8,
          }}
        >
          Layout Engineering
        </h1>
        <p
          style={{
            fontFamily: "'Public Sans', sans-serif",
            fontSize: 14,
            color: 'var(--text-secondary)',
            maxWidth: 500,
          }}
        >
          Master real-world CSS layouts through progressive missions. Choose a
          path to begin.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 20,
          maxWidth: 840,
          width: '100%',
        }}
      >
        {paths.map((pathId) => {
          const meta = pathMetadata[pathId]
          const progress = pathProgress[pathId]
          const done = progress.completedLevels.size
          const pct = Math.round((done / 6) * 100)

          return (
            <button
              key={pathId}
              onClick={() => onStart(pathId)}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                padding: 24,
                borderRadius: 12,
                border: '2px solid var(--border-subtle)',
                background: 'var(--bg-elevated)',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = meta.color
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor =
                  'var(--border-subtle)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    background: meta.color,
                  }}
                >
                  {meta.icon}
                </div>
                <span
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 16,
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                  }}
                >
                  {meta.name}
                </span>
              </div>

              <p
                style={{
                  fontFamily: "'Public Sans', sans-serif",
                  fontSize: 12,
                  lineHeight: 1.5,
                  color: 'var(--text-secondary)',
                  margin: 0,
                }}
              >
                {meta.description}
              </p>

              {/* progress */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11,
                  }}
                >
                  <span style={{ color: 'var(--text-tertiary)' }}>
                    {done}/6 Complete
                  </span>
                  <span style={{ fontWeight: 700, color: meta.color }}>
                    {progress.xpEarned} XP
                  </span>
                </div>
                <div
                  style={{
                    height: 4,
                    borderRadius: 2,
                    background: 'var(--bg-surface)',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${pct}%`,
                      borderRadius: 2,
                      background: meta.color,
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>
              </div>

              <span
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 13,
                  fontWeight: 600,
                  color: meta.color,
                  marginTop: 4,
                }}
              >
                {done === 0 ? 'Start Path →' : 'Continue →'}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

/**
 * Internal page content — switches between path selector and arena
 */
function LayoutEngineeringContent() {
  const {
    currentPathId,
    currentLevelIndex,
    selectPath,
    moveToNextLevel,
    moveToPreviousLevel,
  } = useLayoutEngineering()

  const [started, setStarted] = useState(false)

  const allChallenges = useMemo(
    () => challengesByPath[currentPathId] ?? [],
    [currentPathId]
  )

  const challenge = allChallenges[currentLevelIndex] ?? null

  const handleStart = (pathId: PathId) => {
    selectPath(pathId)
    setStarted(true)
  }

  // Show path selector until user picks a path
  if (!started || !challenge) {
    return <PathSelector onStart={handleStart} />
  }

  return (
    <LayoutArena
      key={challenge.id}
      challenge={challenge}
      levelIndex={currentLevelIndex}
      totalLevels={allChallenges.length}
      allChallenges={allChallenges}
      onNextLevel={moveToNextLevel}
      onPrevLevel={moveToPreviousLevel}
    />
  )
}

/**
 * Main page component - wraps with provider
 */
export default function LayoutEngineeringPage() {
  return (
    <LayoutEngineeringProvider>
      <LayoutEngineeringContent />
    </LayoutEngineeringProvider>
  )
}
