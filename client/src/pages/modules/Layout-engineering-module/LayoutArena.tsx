import { basicSetup } from 'codemirror'
import { EditorState } from '@codemirror/state'
import { EditorView } from '@codemirror/view'
import { css as cssLanguage } from '@codemirror/lang-css'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Check,
  ChevronRight,
  Clock3,
  Eye,
  Lightbulb,
  Lock,
  RefreshCw,
  SkipForward,
  Sparkles,
  Trophy,
  X,
  Zap,
} from 'lucide-react'
import type {
  BuildModeValidation,
  DebugModeValidation,
  LayoutChallenge,
} from '@/types/layout-engineering.types'
import { useLayoutEngineering } from '@/hooks/useLayoutEngineering'
import {
  scoreBuildChallenge,
  scoreDebugChallenge,
  validateBuildMode,
  validateDebugMode,
} from '@/lib/layout-challenge.utils'
import './LayoutArena.css'

interface LayoutArenaProps {
  challenge: LayoutChallenge
  levelIndex: number
  totalLevels: number
  allChallenges: LayoutChallenge[]
  onNextLevel?: () => void
  onPrevLevel?: () => void
}

interface RequiredProperty {
  id: string
  selector: string
  property: string
  value: string
}

interface CssEditorProps {
  value: string
  onChange: (value: string) => void
}

function parseDeclarationBlock(block: string): Array<{ property: string; value: string }> {
  return block
    .split(';')
    .map((declaration) => declaration.trim())
    .filter(Boolean)
    .map((declaration) => {
      const [property, ...rest] = declaration.split(':')
      return {
        property: property.trim(),
        value: rest.join(':').trim(),
      }
    })
    .filter((entry) => entry.property && entry.value)
}

function cssRecordToString(record: Record<string, string>): string {
  return Object.entries(record)
    .map(([selector, declarations]) => `${selector} {\n${parseDeclarationBlock(declarations)
      .map(({ property, value }) => `  ${property}: ${value};`)
      .join('\n')}\n}`)
    .join('\n\n')
}

function buildStarterCss(challenge: LayoutChallenge): string {
  if (challenge.mode === 'debug' && challenge.brokenCss) {
    return cssRecordToString(challenge.brokenCss)
  }

  const selectors = Object.keys(challenge.targetCss)
  const intro = [`/* ${challenge.title} */`, `/* Focus: ${challenge.learningFocus.join(', ')} */`, '']

  return `${intro.join('\n')}${selectors
    .map((selector) => `${selector} {\n  \n}`)
    .join('\n\n')}`
}

function buildPreviewDocument({
  title,
  html,
  css,
  overlayMode,
}: {
  title: string
  html: string
  css: string
  overlayMode: 'target' | 'output'
}): string {
  const chromeOutline =
    overlayMode === 'target'
      ? 'outline: 1px dashed rgba(129, 140, 248, 0.45);'
      : 'outline: 1px dashed rgba(34, 197, 94, 0.28);'

  return `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${title}</title>
        <style>
          :root {
            color-scheme: dark;
            font-family: 'Public Sans', sans-serif;
          }

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            min-height: 100vh;
            background:
              radial-gradient(circle at top left, rgba(99, 102, 241, 0.14), transparent 42%),
              linear-gradient(180deg, #17172a 0%, #11111b 100%);
            color: rgba(241, 245, 249, 0.92);
          }

          .challenge-preview {
            min-height: 100vh;
            padding: 22px;
          }

          .challenge-preview [class] {
            ${chromeOutline}
            outline-offset: 3px;
            transition: all 180ms ease;
          }

          .challenge-preview a {
            color: inherit;
            text-decoration: none;
          }

          ${css}
        </style>
      </head>
      <body>
        <div class="challenge-preview">${html}</div>
      </body>
    </html>
  `
}

function getScoreTone(score: number): 'danger' | 'warning' | 'success' {
  if (score >= 90) return 'success'
  if (score >= 60) return 'warning'
  return 'danger'
}

function formatElapsed(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainder = seconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`
}

function CssEditor({ value, onChange }: CssEditorProps) {
  const hostRef = useRef<HTMLDivElement | null>(null)
  const editorRef = useRef<EditorView | null>(null)
  const onChangeRef = useRef(onChange)
  const initialValueRef = useRef(value)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    if (!hostRef.current) return

    const theme = EditorView.theme(
      {
        '&': {
          height: '100%',
          backgroundColor: 'var(--terminal-bg)',
          color: 'var(--terminal-text)',
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '13px',
        },
        '.cm-scroller': {
          fontFamily: 'JetBrains Mono, monospace',
          lineHeight: '1.65',
        },
        '.cm-content': {
          padding: '16px 0',
          caretColor: 'var(--accent)',
        },
        '.cm-line': {
          padding: '0 16px',
        },
        '.cm-gutters': {
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          color: 'var(--text-tertiary)',
          borderRight: '1px solid var(--border-subtle)',
        },
        '.cm-activeLine': {
          backgroundColor: 'rgba(99, 102, 241, 0.1)',
        },
        '.cm-activeLineGutter': {
          backgroundColor: 'rgba(99, 102, 241, 0.12)',
        },
        '.cm-selectionBackground, .cm-content ::selection': {
          backgroundColor: 'rgba(99, 102, 241, 0.24)',
        },
        '.cm-cursor': {
          borderLeftColor: 'var(--accent)',
        },
        '.tok-keyword, .tok-atom': {
          color: '#8b5cf6',
        },
        '.tok-propertyName': {
          color: '#f8fafc',
        },
        '.tok-string, .tok-number, .tok-unit': {
          color: '#22c55e',
        },
        '.tok-comment': {
          color: '#64748b',
        },
      },
      { dark: true }
    )

    const view = new EditorView({
      state: EditorState.create({
        doc: initialValueRef.current,
        extensions: [
          basicSetup,
          cssLanguage(),
          theme,
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              onChangeRef.current(update.state.doc.toString())
            }
          }),
        ],
      }),
      parent: hostRef.current,
    })

    editorRef.current = view

    return () => {
      view.destroy()
      editorRef.current = null
    }
  }, [])

  useEffect(() => {
    const view = editorRef.current
    if (!view) return
    const current = view.state.doc.toString()
    if (current === value) return

    view.dispatch({
      changes: { from: 0, to: current.length, insert: value },
    })
  }, [value])

  return <div ref={hostRef} className="challenge-editor__surface" />
}

export default function LayoutArena({
  challenge,
  levelIndex,
  totalLevels,
  allChallenges,
  onNextLevel,
}: LayoutArenaProps) {
  const navigate = useNavigate()
  const { completeChallenge, resetChallenge, setCurrentChallenge, updateCssInput } = useLayoutEngineering()

  const starterCss = useMemo(() => buildStarterCss(challenge), [challenge])
  const requiredProperties = useMemo<RequiredProperty[]>(() => {
    return Object.entries(challenge.targetCss).flatMap(([selector, declarations]) =>
      parseDeclarationBlock(declarations).map(({ property, value }) => ({
        id: `${selector}::${property}`,
        selector,
        property,
        value,
      }))
    )
  }, [challenge.targetCss])

  const [editorValue, setEditorValue] = useState(starterCss)
  const [liveCss, setLiveCss] = useState(starterCss)
  const [editCount, setEditCount] = useState(0)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [hintTier, setHintTier] = useState(0)
  const [hintXPLost, setHintXPLost] = useState(0)
  const [showVictory, setShowVictory] = useState(false)
  const [validation, setValidation] = useState<BuildModeValidation | DebugModeValidation | null>(null)

  const completionCommittedRef = useRef(false)
  const startTimeRef = useRef(0)
  const skipDebounceRef = useRef(true)

  const runValidation = useCallback(
    (cssToValidate: string, currentEditCount: number) => {
      if (challenge.mode === 'build') {
        const nextValidation = validateBuildMode(cssToValidate, challenge)
        setValidation(nextValidation)

        if (nextValidation.isComplete && !completionCommittedRef.current) {
          const timeSpent = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000))
          const scoring = scoreBuildChallenge(nextValidation.accuracy, challenge, timeSpent)

          completionCommittedRef.current = true
          setShowVictory(true)
          completeChallenge({
            challengeId: challenge.id,
            pathId: challenge.path,
            level: challenge.level,
            completedAt: new Date(),
            completed: true,
            accuracy: nextValidation.accuracy,
            targetCssMatches: nextValidation.matchedProperties.length,
            targetCssTotal: nextValidation.matchedProperties.length + nextValidation.missingProperties.length,
            xpEarned: Math.max(0, scoring.totalXP - hintXPLost),
            stars: scoring.stars,
            badges: scoring.badges,
            timeSpent,
          })
        }

        return nextValidation
      }

      const nextValidation = validateDebugMode(cssToValidate, challenge, currentEditCount)
      setValidation(nextValidation)

      if (nextValidation.isFixed && !completionCommittedRef.current) {
        const timeSpent = Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000))
        const scoring = scoreDebugChallenge(nextValidation.efficiency, challenge, timeSpent)

        completionCommittedRef.current = true
        setShowVictory(true)
        completeChallenge({
          challengeId: challenge.id,
          pathId: challenge.path,
          level: challenge.level,
          completedAt: new Date(),
          completed: true,
          efficiency: nextValidation.efficiency,
          editCount: currentEditCount,
          xpEarned: Math.max(0, scoring.totalXP - hintXPLost),
          stars: scoring.stars,
          badges: scoring.badges,
          timeSpent,
        })
      }

      return nextValidation
    },
    [challenge, completeChallenge, hintXPLost]
  )

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      completionCommittedRef.current = false
      skipDebounceRef.current = true
      startTimeRef.current = Date.now()
      setElapsedSeconds(0)
      setEditCount(0)
      setHintTier(0)
      setHintXPLost(0)
      setShowVictory(false)
      setValidation(null)
      setEditorValue(starterCss)
      setLiveCss(starterCss)
      setCurrentChallenge(challenge)
      updateCssInput(starterCss)
    })

    return () => window.cancelAnimationFrame(frame)
  }, [challenge, setCurrentChallenge, starterCss, updateCssInput])

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setElapsedSeconds(Math.max(0, Math.floor((Date.now() - startTimeRef.current) / 1000)))
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [challenge.id])

  useEffect(() => {
    if (skipDebounceRef.current) {
      skipDebounceRef.current = false
      const frame = window.requestAnimationFrame(() => {
        runValidation(starterCss, 0)
      })
      return () => window.cancelAnimationFrame(frame)
    }

    const timeoutId = window.setTimeout(() => {
      setLiveCss(editorValue)
      setEditCount((previous) => {
        const next = previous + 1
        runValidation(editorValue, next)
        return next
      })
    }, 300)

    return () => window.clearTimeout(timeoutId)
  }, [editorValue, runValidation, starterCss])

  const totalRequiredProperties = requiredProperties.length || 1
  const matchedPropertyIds = useMemo(() => {
    if (!validation) return new Set<string>()

    if (challenge.mode === 'build') {
      return new Set((validation as BuildModeValidation).matchedProperties)
    }

    const remainingIssues = new Set((validation as DebugModeValidation).remainingIssues)
    return new Set(
      requiredProperties
        .filter((property) => !remainingIssues.has(property.id))
        .map((property) => property.id)
    )
  }, [challenge.mode, requiredProperties, validation])

  const matchedPropertyCount = matchedPropertyIds.size
  const scorePercent = validation
    ? challenge.mode === 'build'
      ? (validation as BuildModeValidation).accuracy
      : (validation as DebugModeValidation).efficiency
    : 0
  const scoreTone = getScoreTone(scorePercent)
  const targetDoc = useMemo(
    () => buildPreviewDocument({ title: `${challenge.title} target`, html: challenge.targetHtml, css: cssRecordToString(challenge.targetCss), overlayMode: 'target' }),
    [challenge.targetCss, challenge.targetHtml, challenge.title]
  )
  const outputDoc = useMemo(
    () => buildPreviewDocument({ title: `${challenge.title} output`, html: challenge.targetHtml, css: liveCss, overlayMode: 'output' }),
    [challenge.targetHtml, challenge.title, liveCss]
  )

  const currentHint = hintTier > 0 ? [challenge.hints.conceptual, challenge.hints.specific, challenge.hints.codeTip][hintTier - 1] : null
  const propertyCompletionPercent = Math.round((matchedPropertyCount / totalRequiredProperties) * 100)
  const lineCount = editorValue.split(/\r?\n/).length
  const passThreshold = challenge.mode === 'build' ? challenge.accuracy?.perfectMatch ?? 90 : 100
  const xpPreview = Math.max(0, challenge.baseXP - hintXPLost)

  const handleEditorChange = useCallback(
    (nextValue: string) => {
      setEditorValue(nextValue)
      updateCssInput(nextValue)
    },
    [updateCssInput]
  )

  const handleReset = useCallback(() => {
    completionCommittedRef.current = false
    skipDebounceRef.current = true
    startTimeRef.current = Date.now()
    setElapsedSeconds(0)
    setEditCount(0)
    setHintTier(0)
    setHintXPLost(0)
    setShowVictory(false)
    setEditorValue(starterCss)
    setLiveCss(starterCss)
    resetChallenge()
    updateCssInput(starterCss)
    runValidation(starterCss, 0)
  }, [resetChallenge, runValidation, starterCss, updateCssInput])

  const handleCheckAnswer = useCallback(() => {
    setLiveCss(editorValue)
    runValidation(editorValue, editCount)
  }, [editCount, editorValue, runValidation])

  const handleRevealHint = useCallback(() => {
    if (hintTier >= 3) return
    const nextTier = hintTier + 1
    const costs = [0, 5, 10, 15]
    setHintTier(nextTier)
    setHintXPLost((previous) => previous + costs[nextTier])
  }, [hintTier])

  const handleAdvance = useCallback(() => {
    if (levelIndex < totalLevels - 1) {
      onNextLevel?.()
      return
    }

    navigate('/modules')
  }, [levelIndex, navigate, onNextLevel, totalLevels])

  const hintCards = [challenge.hints.conceptual, challenge.hints.specific, challenge.hints.codeTip]

  return (
    <div className="challenge-page">
      <div className="challenge-page__topbar">
        <div className="challenge-page__topbar-group">
          <span className="challenge-page__label">Challenge:</span>
          <h1 className="challenge-page__title">{challenge.title}</h1>
          <span className="challenge-page__live-badge">LIVE</span>
        </div>

        <div className={`challenge-page__match challenge-page__match--${scoreTone}`}>
          <Sparkles size={15} />
          <span>{scorePercent}% Match</span>
        </div>

        <div className="challenge-page__topbar-actions">
          <div className="challenge-page__timer">
            <Clock3 size={14} />
            <span>{formatElapsed(elapsedSeconds)}</span>
          </div>
          <button className="challenge-button challenge-button--primary" onClick={handleCheckAnswer}>
            Check Answer
          </button>
          <button className="challenge-button challenge-button--ghost" onClick={handleReset}>
            <RefreshCw size={14} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      <div className="challenge-page__workspace">
        <main className="challenge-page__main">
          <section className="challenge-preview-grid">
            <article className="challenge-panel challenge-panel--target">
              <header className="challenge-panel__header">
                <div className="challenge-panel__title-row">
                  <span className="challenge-panel__eyebrow">TARGET</span>
                  <Lock size={14} />
                </div>
                <span className="challenge-panel__meta">Reference locked</span>
              </header>

              <div className="challenge-panel__frame-wrap challenge-panel__frame-wrap--locked">
                <iframe
                  className="challenge-panel__frame"
                  sandbox="allow-same-origin"
                  srcDoc={targetDoc}
                  title={`${challenge.title} target layout`}
                />
              </div>

              <footer className="challenge-panel__footer">
                <span>{challenge.description}</span>
              </footer>
            </article>

            <article className="challenge-panel challenge-panel--output">
              <header className="challenge-panel__header">
                <div className="challenge-panel__title-row">
                  <span className="challenge-panel__eyebrow">YOUR OUTPUT</span>
                  <Eye size={14} />
                </div>
                <span className={`challenge-panel__meta challenge-panel__meta--${scoreTone}`}>
                  {propertyCompletionPercent}% properties aligned
                </span>
              </header>

              <div className={`challenge-panel__frame-wrap challenge-panel__frame-wrap--${scoreTone}`}>
                <iframe
                  className="challenge-panel__frame"
                  sandbox="allow-same-origin"
                  srcDoc={outputDoc}
                  title={`${challenge.title} live output`}
                />
              </div>

              <footer className="challenge-panel__footer challenge-panel__footer--status">
                <span>{matchedPropertyCount} / {totalRequiredProperties} required properties complete</span>
                <span>{challenge.mode === 'build' ? `Pass at ${passThreshold}%+` : 'Pass when all issues are resolved'}</span>
              </footer>
            </article>
          </section>

          <section className="challenge-editor">
            <header className="challenge-editor__header">
              <div className="challenge-editor__chrome">
                <span className="challenge-editor__dot challenge-editor__dot--red" />
                <span className="challenge-editor__dot challenge-editor__dot--yellow" />
                <span className="challenge-editor__dot challenge-editor__dot--green" />
              </div>

              <div className="challenge-editor__meta">
                <span className="challenge-editor__filename">styles.css</span>
                <span className="challenge-editor__linecount">{lineCount} lines</span>
              </div>
            </header>

            <div className="challenge-editor__body">
              <CssEditor value={editorValue} onChange={handleEditorChange} />
            </div>
          </section>
        </main>

        <aside className="mission-control">
          <header className="mission-control__header">
            <div>
              <span className="mission-control__eyebrow">Mission Control</span>
              <h2 className="mission-control__title">Flexbox Challenge</h2>
            </div>
            <span className="mission-control__xp-badge">+{challenge.baseXP} XP</span>
          </header>

          <section className="mission-control__scorecard">
            <div className={`mission-control__score-ring mission-control__score-ring--${scoreTone}`} style={{ ['--score' as string]: `${scorePercent}` }}>
              <div className="mission-control__score-ring-core">
                <strong>{scorePercent}%</strong>
                <span>Match</span>
              </div>
            </div>

            <div className="mission-control__scorecopy">
              <span className="mission-control__scorecopy-label">Live accuracy</span>
              <strong>{matchedPropertyCount} of {totalRequiredProperties} properties</strong>
              <span>{challenge.mode === 'build' ? 'Realtime comparison against the target layout.' : 'Realtime issue resolution tracking for debug mode.'}</span>
            </div>
          </section>

          <section className="mission-control__section">
            <div className="mission-control__section-header">
              <h3>Required Properties</h3>
              <span>{xpPreview} XP on completion</span>
            </div>

            <div className="mission-control__property-list">
              {requiredProperties.map((property) => {
                const isComplete = matchedPropertyIds.has(property.id)
                return (
                  <div key={property.id} className={`mission-control__property ${isComplete ? 'mission-control__property--complete' : ''}`}>
                    <span className="mission-control__property-icon">
                      {isComplete ? <Check size={14} /> : <X size={14} />}
                    </span>
                    <div className="mission-control__property-copy">
                      <strong>{property.property}</strong>
                      <span>{property.selector}{' -> '}{property.value}</span>
                    </div>
                    <span className="mission-control__property-xp">+{Math.max(4, Math.round(challenge.baseXP / totalRequiredProperties))} XP</span>
                  </div>
                )
              })}
            </div>
          </section>

          <section className="mission-control__section">
            <div className="mission-control__section-header">
              <h3>Hints</h3>
              <span>{hintTier} / 3 revealed</span>
            </div>

            <div className="mission-control__hints">
              {hintCards.map((hint, index) => {
                const isUnlocked = index < hintTier
                return (
                  <div key={index} className={`mission-control__hint ${isUnlocked ? 'mission-control__hint--unlocked' : ''}`}>
                    <div className="mission-control__hint-head">
                      <span>Hint {index + 1}</span>
                      {isUnlocked ? <Lightbulb size={14} /> : <Lock size={14} />}
                    </div>
                    <p>{hint}</p>
                  </div>
                )
              })}
            </div>

            <button className="challenge-button challenge-button--ghost challenge-button--block" onClick={handleRevealHint} disabled={hintTier >= 3}>
              <Lightbulb size={14} />
              <span>{hintTier >= 3 ? 'All hints revealed' : `Reveal next hint (-${[5, 10, 15][hintTier]} XP)`}</span>
            </button>
          </section>

          <section className="mission-control__section mission-control__section--status">
            <div className={`mission-control__status mission-control__status--${showVictory ? 'success' : scoreTone}`}>
              <div>
                <span className="mission-control__status-label">Status</span>
                <strong>{showVictory ? 'Challenge passed' : currentHint ?? 'Keep iterating. Your output updates after a 300ms pause.'}</strong>
              </div>
              {showVictory ? <Trophy size={18} /> : <Zap size={18} />}
            </div>
          </section>

          <footer className="mission-control__footer">
            <button className="challenge-button challenge-button--primary challenge-button--block" onClick={handleCheckAnswer}>
              Check Answer
            </button>
            <button className="challenge-button challenge-button--success challenge-button--block" onClick={handleAdvance} disabled={!showVictory}>
              <span>{levelIndex < totalLevels - 1 ? 'Next Challenge' : 'Finish Path'}</span>
              <ChevronRight size={14} />
            </button>
            <button className="challenge-button challenge-button--ghost challenge-button--block" onClick={handleAdvance}>
              <SkipForward size={14} />
              <span>Skip Challenge</span>
            </button>
          </footer>

          <div className="mission-control__rail">
            {allChallenges.map((entry, index) => {
              const state = index < levelIndex ? 'complete' : index === levelIndex ? 'active' : 'locked'
              return (
                <div key={entry.id} className={`mission-control__rail-item mission-control__rail-item--${state}`}>
                  <span className="mission-control__rail-index">{String(index + 1).padStart(2, '0')}</span>
                  <span className="mission-control__rail-title">{entry.title}</span>
                </div>
              )
            })}
          </div>
        </aside>
      </div>
    </div>
  )
}