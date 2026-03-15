/**
 * LayoutArena — Three-Panel CSS Layout Sandbox
 *
 * Left:   Mission Sidebar  (260 px fixed)
 * Center: Live Canvas       (flex)
 * Right:  CSS Controls      (280 px fixed)
 *
 * Design language matches the Git & GitHub module:
 * - BEM class naming
 * - index.css design tokens
 * - Space Grotesk headings · JetBrains Mono code · Public Sans body
 */

import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Check,
  Play,
  Lock,
  SlidersHorizontal,
  Lightbulb,
  RotateCcw,
  Monitor,
  Tablet,
  Smartphone,
} from 'lucide-react'
import type {
  LayoutChallenge,
  BuildModeValidation,
  DebugModeValidation,
} from '@/types/layout-engineering.types'
import { useLayoutEngineering } from '@/hooks/useLayoutEngineering'
import {
  validateBuildMode,
  validateDebugMode,
  scoreBuildChallenge,
  scoreDebugChallenge,
} from '@/lib/layout-challenge.utils'
import './LayoutArena.css'

/* ══════════════════════════════════════════════════════
   TYPES
   ══════════════════════════════════════════════════════ */

interface LayoutArenaProps {
  challenge: LayoutChallenge
  levelIndex: number
  totalLevels: number
  /** All challenges in the current path (used for step list) */
  allChallenges: LayoutChallenge[]
  onNextLevel?: () => void
  onPrevLevel?: () => void
}

type Viewport = 'desktop' | 'tablet' | 'mobile'

interface FlexCSS {
  justifyContent: string
  alignItems: string
  flexDirection: string
  flexWrap: string
  gap: number
  /* flex-item (sidebar) */
  flexGrow: string
  flexShrink: string
  flexBasis: string
  alignSelf: string
  order: string
}

interface LayoutInspectorStats {
  display: string
  flexDirection: string
  justifyContent: string
  alignItems: string
  flexWrap: string
  gap: string
  width: number
  height: number
  childCount: number
}

type HintTier = 0 | 1 | 2 | 3

const HINT_COSTS: Record<HintTier, number> = { 0: 0, 1: 5, 2: 15, 3: 30 }

const DEFAULT_FLEX: FlexCSS = {
  justifyContent: 'flex-start',
  alignItems: 'stretch',
  flexDirection: 'row',
  flexWrap: 'nowrap',
  gap: 0,
  flexGrow: '0',
  flexShrink: '1',
  flexBasis: 'auto',
  alignSelf: 'auto',
  order: '0',
}

const PROPERTY_EFFECTS: Record<keyof FlexCSS, string> = {
  justifyContent: 'Moves items along the main axis and controls spacing distribution.',
  alignItems: 'Aligns all items on the cross axis.',
  flexDirection: 'Changes row/column flow and flips the main axis orientation.',
  flexWrap: 'Controls whether items stay on one line or wrap into multiple lines.',
  gap: 'Adds consistent spacing between flex items.',
  flexGrow: 'Lets the selected item consume extra available space.',
  flexShrink: 'Controls how aggressively the selected item shrinks when space is tight.',
  flexBasis: 'Sets the selected item base size before grow/shrink is applied.',
  alignSelf: 'Overrides cross-axis alignment for one selected item.',
  order: 'Changes visual order while DOM order remains unchanged.',
}

/* helper: build CSS string from FlexCSS state */
function buildCSSString(f: FlexCSS, selector = '.container'): string {
  let css = `${selector} {\n`
  css += `  display: flex;\n`
  if (f.justifyContent !== 'flex-start')
    css += `  justify-content: ${f.justifyContent};\n`
  if (f.alignItems !== 'stretch')
    css += `  align-items: ${f.alignItems};\n`
  if (f.flexDirection !== 'row')
    css += `  flex-direction: ${f.flexDirection};\n`
  if (f.flexWrap !== 'nowrap') css += `  flex-wrap: ${f.flexWrap};\n`
  if (f.gap > 0) css += `  gap: ${f.gap}px;\n`
  css += `}`
  return css
}

/* helper: parse raw CSS text back to FlexCSS */
function parseCSSToFlex(raw: string): Partial<FlexCSS> {
  const out: Partial<FlexCSS> = {}
  const match = (prop: string) => {
    const re = new RegExp(`${prop}\\s*:\\s*([^;]+);`, 'i')
    const m = raw.match(re)
    return m ? m[1].trim() : undefined
  }
  const jc = match('justify-content')
  if (jc) out.justifyContent = jc
  const ai = match('align-items')
  if (ai) out.alignItems = ai
  const fd = match('flex-direction')
  if (fd) out.flexDirection = fd
  const fw = match('flex-wrap')
  if (fw) out.flexWrap = fw
  const g = match('gap')
  if (g) out.gap = parseInt(g, 10) || 0
  const fg = match('flex-grow')
  if (fg) out.flexGrow = fg
  const fs = match('flex-shrink')
  if (fs) out.flexShrink = fs
  const fb = match('flex-basis')
  if (fb) out.flexBasis = fb
  const as = match('align-self')
  if (as) out.alignSelf = as
  const ord = match('order')
  if (ord) out.order = ord
  return out
}

/* helper: syntax-highlighted CSS line */
function highlightCSS(raw: string): string {
  return raw
    .replace(
      /([a-z-]+)\s*:/gi,
      '<span class="css-prop">$1</span><span class="css-punct">:</span>'
    )
    .replace(
      /:\s*([^;{}\n]+)/g,
      ': <span class="css-value">$1</span>'
    )
    .replace(/(\.[\w-]+)/g, '<span class="css-selector">$1</span>')
    .replace(/([{}])/g, '<span class="css-punct">$1</span>')
}

/* ══════════════════════════════════════════════════════
   COMPONENT
   ══════════════════════════════════════════════════════ */

export default function LayoutArena({
  challenge,
  levelIndex,
  totalLevels,
  allChallenges,
  onNextLevel,
}: LayoutArenaProps) {
  const navigate = useNavigate()
  const {
    cssInput,
    updateCssInput,
    completeChallenge,
    resetChallenge,
  } = useLayoutEngineering()

  /* ── Local state ────────────────────────────────────── */
  const [startTime] = useState(() => Date.now())
  const [editCount, setEditCount] = useState(0)
  const [viewport, setViewport] = useState<Viewport>('desktop')
  const [flex, setFlex] = useState<FlexCSS>({ ...DEFAULT_FLEX })
  const [selectedItem, setSelectedItem] = useState<boolean>(false)
  const [hintTier, setHintTier] = useState<HintTier>(0)
  const [hintXPLost, setHintXPLost] = useState(0)
  const [showVictory, setShowVictory] = useState(false)
  const [codeEditMode, setCodeEditMode] = useState(false)
  const [lastChangedKey, setLastChangedKey] = useState<keyof FlexCSS | null>(null)
  const [inspectorStats, setInspectorStats] = useState<LayoutInspectorStats | null>(null)
  const [validation, setValidation] = useState<
    BuildModeValidation | DebugModeValidation | null
  >(null)
  const previewRootRef = useRef<HTMLDivElement | null>(null)

  /* ── Derived values ─────────────────────────────────── */
  const isColumn = flex.flexDirection === 'column' || flex.flexDirection === 'column-reverse'
  const codeIsEditable = levelIndex >= 2 // Level 3+
  const dropsHidden = levelIndex >= 4 // Level 5+
  const completedCount = allChallenges.filter((_, i) => i < levelIndex).length
  const progressPercent = Math.round(((completedCount) / totalLevels) * 100)

  /* Primary CSS selector from the challenge's targetCss (first key) */
  const primarySelector = Object.keys(challenge.targetCss)[0] ?? '.container'

  /* ── Build CSS string from flex state ───────────────── */
  const generatedCSS = useMemo(() => buildCSSString(flex, primarySelector), [flex, primarySelector])

  /* ── Shared validation runner ─────────────────────────── */
  const runValidation = useCallback(
    (css: string, edits: number) => {
      if (challenge.mode === 'build') {
        const v = validateBuildMode(css, challenge)
        setValidation(v)
        if (v.isComplete && !showVictory) {
          const t = Math.round((Date.now() - startTime) / 1000)
          const s = scoreBuildChallenge(v.accuracy, challenge, t)
          completeChallenge({
            challengeId: challenge.id,
            pathId: challenge.path,
            level: challenge.level,
            completedAt: new Date(),
            completed: true,
            accuracy: v.accuracy,
            targetCssMatches: v.matchedProperties.length,
            targetCssTotal: v.matchedProperties.length + v.missingProperties.length,
            xpEarned: Math.max(0, s.totalXP - hintXPLost),
            stars: s.stars,
            badges: s.badges,
            timeSpent: t,
          })
          setShowVictory(true)
        }
        return v
      } else {
        const v = validateDebugMode(css, challenge, edits)
        setValidation(v)
        if (v.isFixed && !showVictory) {
          const t = Math.round((Date.now() - startTime) / 1000)
          const s = scoreDebugChallenge(v.efficiency, challenge, t)
          completeChallenge({
            challengeId: challenge.id,
            pathId: challenge.path,
            level: challenge.level,
            completedAt: new Date(),
            completed: true,
            efficiency: v.efficiency,
            editCount: edits,
            xpEarned: Math.max(0, s.totalXP - hintXPLost),
            stars: s.stars,
            badges: s.badges,
            timeSpent: t,
          })
          setShowVictory(true)
        }
        return v
      }
    },
    [challenge, showVictory, startTime, hintXPLost, completeChallenge]
  )

  /* ── Dropdown change handler ────────────────────────── */
  const handleFlexChange = useCallback(
    (key: keyof FlexCSS, value: string | number) => {
      setLastChangedKey(key)
      setFlex((prev) => {
        const next = { ...prev, [key]: value }
        const css = buildCSSString(next, primarySelector)
        updateCssInput(css)
        const newEdits = editCount + 1
        setEditCount(newEdits)
        setCodeEditMode(false)
        // Defer validation to avoid batching issues
        queueMicrotask(() => runValidation(css, newEdits))
        return next
      })
    },
    [updateCssInput, editCount, runValidation, primarySelector]
  )

  /* ── Code textarea change handler ───────────────────── */
  const handleCodeChange = useCallback(
    (raw: string) => {
      setLastChangedKey(null)
      setCodeEditMode(true)
      updateCssInput(raw)
      const newEdits = editCount + 1
      setEditCount(newEdits)
      const parsed = parseCSSToFlex(raw)
      setFlex((prev) => ({ ...prev, ...parsed }))
      queueMicrotask(() => runValidation(raw, newEdits))
    },
    [updateCssInput, editCount, runValidation]
  )

  /* ── Submit handler ─────────────────────────────────── */
  const handleSubmit = () => {
    const css = codeEditMode ? cssInput : generatedCSS
    runValidation(css, editCount)
  }
  const handleUseHint = () => {
    const next = (hintTier + 1) as HintTier
    if (next > 3) return
    setHintTier(next)
    setHintXPLost((prev) => prev + HINT_COSTS[next])
  }

  const currentHintText =
    hintTier >= 1 && hintTier <= 3
      ? [challenge.hints.conceptual, challenge.hints.specific, challenge.hints.codeTip][hintTier - 1]
      : null

  const difficultyClass =
    levelIndex <= 1 ? 'beginner' : levelIndex <= 3 ? 'intermediate' : 'advanced'
  const difficultyLabel =
    levelIndex <= 1 ? 'BEGINNER' : levelIndex <= 3 ? 'INTERMEDIATE' : 'ADVANCED'

  const currentCSS = codeEditMode ? cssInput : generatedCSS

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      const previewRoot = previewRootRef.current
      const liveRoot = previewRoot?.querySelector('.wireframe-live') as HTMLElement | null
      const primaryElement = liveRoot?.querySelector(primarySelector) as HTMLElement | null

      if (!primaryElement) {
        setInspectorStats(null)
        return
      }

      const computed = getComputedStyle(primaryElement)
      const rect = primaryElement.getBoundingClientRect()

      setInspectorStats({
        display: computed.display,
        flexDirection: computed.flexDirection,
        justifyContent: computed.justifyContent,
        alignItems: computed.alignItems,
        flexWrap: computed.flexWrap,
        gap: computed.gap,
        width: Math.round(rect.width),
        height: Math.round(rect.height),
        childCount: primaryElement.children.length,
      })
    })

    return () => window.cancelAnimationFrame(frameId)
  }, [currentCSS, viewport, primarySelector, challenge.targetHtml])

  /* ══════════════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════════════ */

  return (
    <div className="layout-arena">
      {/* ═══ LEFT — Mission Sidebar ════════════════════════ */}
      <aside className="layout-arena__sidebar">
        <div className="sidebar__header">
          <span className="sidebar__label">Mission Control</span>
          <span className="sidebar__xp-badge">+{challenge.baseXP} XP</span>
        </div>

        {/* Progress Circle */}
        <div className="sidebar__progress">
          <div className="progress-circle">
            <svg width={100} height={100} className="progress-circle__svg">
              <circle cx={50} cy={50} r={44} className="progress-circle__bg" />
              <circle
                cx={50}
                cy={50}
                r={44}
                className="progress-circle__fill"
                strokeDasharray={2 * Math.PI * 44}
                strokeDashoffset={2 * Math.PI * 44 - (progressPercent / 100) * 2 * Math.PI * 44}
              />
              <text x={50} y={50} className="progress-circle__text">
                {progressPercent}%
              </text>
            </svg>
            <span className="progress-circle__label">Mission Progress</span>
            <span className="progress-circle__steps">
              {completedCount} of {totalLevels} Stages
            </span>
          </div>
        </div>

        <h1 className="sidebar__title">Instructions</h1>

        {/* Step List */}
        <div className="sidebar__steps">
          {allChallenges.map((ch, i) => {
            const isCompleted = i < levelIndex
            const isActive = i === levelIndex
            const isLocked = i > levelIndex
            const status = isCompleted
              ? 'completed'
              : isActive
                ? 'active'
                : 'locked'

            return (
              <div className="step-item" key={ch.id}>
                <div className={`step-item__indicator step-item__indicator--${status}`}>
                  {isCompleted && <Check size={12} />}
                  {isActive && <Play size={10} fill="white" />}
                  {isLocked && <Lock size={10} />}
                </div>
                <div className="step-item__content">
                  <span className={`step-item__tag ${isActive ? 'step-item__tag--active' : ''}`}>
                    STEP {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className={`step-item__name step-item__name--${status}`}>
                    {ch.title}
                  </span>
                  <div className="step-item__meta">
                    <span className="step-item__xp">+{ch.baseXP} XP</span>
                    {isActive && (
                      <span className="step-item__active-badge">ACTIVE</span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        
      </aside>

      {/* ═══ CENTER — Live Canvas ══════════════════════════ */}
      <div className="layout-arena__canvas">
        {/* Top Bar */}
        <div className="canvas__topbar">
          <div className="canvas__topbar-left">
            <span className="canvas__title">{challenge.title}</span>
            <span className={`canvas__difficulty-badge canvas__difficulty-badge--${difficultyClass}`}>
              {difficultyLabel}
            </span>
          </div>
          <div className="canvas__viewport-toggles">
            {(['desktop', 'tablet', 'mobile'] as Viewport[]).map((vp) => (
              <button
                className={`canvas__viewport-btn ${viewport === vp ? 'canvas__viewport-btn--active' : ''}`}
                key={vp}
                onClick={() => setViewport(vp)}
              >
                {vp === 'desktop' && <Monitor size={14} />}
                {vp === 'tablet' && <Tablet size={14} />}
                {vp === 'mobile' && <Smartphone size={14} />}
              </button>
            ))}
          </div>
        </div>

        {/* Canvas Body */}
        <div className="canvas__body">
          <div className={`canvas__wireframe ${viewport === 'tablet' ? 'canvas__wireframe--tablet' : ''} ${viewport === 'mobile' ? 'canvas__wireframe--mobile' : ''}`}>
            {/* Axis Indicators */}
            <div
              className={`canvas__axis-indicator canvas__axis-indicator--main ${isColumn ? 'canvas__axis-indicator--column' : ''}`}
            >
              <span className="canvas__axis-line" />
              <span className="canvas__axis-label">Main Axis</span>
              <span className="canvas__axis-line" />
            </div>

            <div
              className={`canvas__axis-indicator canvas__axis-indicator--cross ${isColumn ? 'canvas__axis-indicator--column' : ''}`}
            >
              <span className="canvas__axis-line" />
              <span className="canvas__axis-label">Cross Axis</span>
              <span className="canvas__axis-line" />
            </div>

            {/* Wireframe DOM Preview with user CSS applied */}
            <div
              role="button"
              tabIndex={0}
              onClick={() => setSelectedItem(prev => !prev)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedItem(prev => !prev) }}
              ref={previewRootRef}
              className="canvas__wireframe-viewport"
              dangerouslySetInnerHTML={{
                  __html: `
                    <style>
                      .wireframe-live * { box-sizing: border-box; }
                      .wireframe-live ${primarySelector} {
                        outline: 1px dashed rgba(245, 158, 11, 0.65);
                        outline-offset: 2px;
                      }
                      .wireframe-live [class] {
                        background: rgba(99, 102, 241, 0.12);
                        border: 1px solid rgba(99, 102, 241, 0.28);
                        border-radius: 4px;
                        min-height: 28px;
                        padding: 6px 10px;
                        font-family: 'JetBrains Mono', monospace;
                        font-size: 10px;
                        color: rgba(148, 163, 184, 0.75);
                        transition: all 0.25s ease;
                      }
                      ${currentCSS}
                    </style>
                    <div class="wireframe-live" style="width:100%;height:100%;padding:16px;">
                      ${challenge.targetHtml}
                    </div>
                  `,
                }}
              />
          </div>
        </div>

        <div className="canvas__inspector">
          <div className="canvas__inspector-header">
            <span className="canvas__inspector-title">Live Inspector</span>
            <span className="canvas__inspector-selector">Target: {primarySelector}</span>
          </div>

          {inspectorStats ? (
            <div className="canvas__inspector-grid">
              <span>display: {inspectorStats.display}</span>
              <span>direction: {inspectorStats.flexDirection}</span>
              <span>justify: {inspectorStats.justifyContent}</span>
              <span>align: {inspectorStats.alignItems}</span>
              <span>wrap: {inspectorStats.flexWrap}</span>
              <span>gap: {inspectorStats.gap}</span>
              <span>size: {inspectorStats.width}px × {inspectorStats.height}px</span>
              <span>children: {inspectorStats.childCount}</span>
            </div>
          ) : (
            <span className="canvas__inspector-empty">
              Primary selector not found in current challenge markup.
            </span>
          )}

          {lastChangedKey && (
            <div className="canvas__inspector-tip">
              <span className="canvas__inspector-tip-key">{lastChangedKey}</span>
              <span className="canvas__inspector-tip-text">{PROPERTY_EFFECTS[lastChangedKey]}</span>
            </div>
          )}
        </div>

        {/* Hint Banner (when active) */}
        {currentHintText && (
          <div className="canvas__hint-banner">
            <Lightbulb size={14} className="canvas__hint-banner-icon" />
            <span className="canvas__hint-banner-text">{currentHintText}</span>
            <span className="canvas__hint-cost">-{HINT_COSTS[hintTier as HintTier]} XP</span>
          </div>
        )}

        {/* Hint Trigger */}
        <div className="canvas__hint-trigger">
          <button
            className="canvas__hint-btn"
            onClick={handleUseHint}
            disabled={hintTier >= 3}
          >
            <Lightbulb size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
            {hintTier === 0 ? 'Use Hint' : hintTier < 3 ? `Next Hint (-${HINT_COSTS[(hintTier + 1) as HintTier]} XP)` : 'All Hints Used'}
          </button>
        </div>

        {/* Bottom Bar */}
        <div className="canvas__bottombar">
          <div className="canvas__status">
            <span className="canvas__status-dot" />
            {validation ? (
              <span className="canvas__status-text">
                {challenge.mode === 'build'
                  ? `ACCURACY: ${(validation as BuildModeValidation).accuracy}%`
                  : `EFFICIENCY: ${(validation as DebugModeValidation).efficiency}%`}
              </span>
            ) : (
              <span className="canvas__status-text">SIMULATOR ONLINE</span>
            )}
          </div>
          <div className="canvas__actions">
            <button
              className="canvas__btn--ghost"
              onClick={() => {
                setFlex({ ...DEFAULT_FLEX })
                setCodeEditMode(false)
                resetChallenge()
              }}
            >
              <RotateCcw size={13} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
              Reset Layout
            </button>
            <button
              className="canvas__btn--primary"
              onClick={handleSubmit}
              disabled={showVictory}
            >
              Submit Solution
            </button>
          </div>
        </div>
      </div>

      {/* ═══ RIGHT — CSS Controls ══════════════════════════ */}
      <div className="layout-arena__controls">
        <div className="controls__header">
          <SlidersHorizontal size={16} className="controls__header-icon" />
          <span className="controls__header-title">CSS Controls</span>
        </div>

        {/* Property Panel (hidden at level 5+) */}
        {!dropsHidden && (
          <div className="controls__property-panel">
            {/* FLEX CONTAINER section */}
            <span className="controls__section-label">Flex Container</span>

            {/* justify-content */}
            <div className="controls__prop-row">
              <span className="controls__prop-label">justify-content</span>
              <select
                className="controls__prop-select"
                value={flex.justifyContent}
                onChange={(e) => handleFlexChange('justifyContent', e.target.value)}
              >
                <option>flex-start</option>
                <option>flex-end</option>
                <option>center</option>
                <option>space-between</option>
                <option>space-around</option>
                <option>space-evenly</option>
              </select>
            </div>

            {/* align-items */}
            <div className="controls__prop-row">
              <span className="controls__prop-label">align-items</span>
              <select
                className="controls__prop-select"
                value={flex.alignItems}
                onChange={(e) => handleFlexChange('alignItems', e.target.value)}
              >
                <option>stretch</option>
                <option>flex-start</option>
                <option>flex-end</option>
                <option>center</option>
                <option>baseline</option>
              </select>
            </div>

            {/* flex-direction (segmented toggle) */}
            <div className="controls__prop-row">
              <span className="controls__prop-label">flex-direction</span>
              <div className="controls__segmented">
                {(['row', 'column', 'row-reverse', 'column-reverse'] as const).map(
                  (dir) => (
                    <button
                      key={dir}
                      className={`controls__segmented-btn ${flex.flexDirection === dir ? 'controls__segmented-btn--active' : ''}`}
                      onClick={() => handleFlexChange('flexDirection', dir)}
                    >
                      {dir}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* flex-wrap */}
            <div className="controls__prop-row">
              <span className="controls__prop-label">flex-wrap</span>
              <select
                className="controls__prop-select"
                value={flex.flexWrap}
                onChange={(e) => handleFlexChange('flexWrap', e.target.value)}
              >
                <option>nowrap</option>
                <option>wrap</option>
                <option>wrap-reverse</option>
              </select>
            </div>

            {/* gap */}
            <div className="controls__prop-row">
              <span className="controls__prop-label">gap</span>
              <div className="controls__slider-row">
                <input
                  type="range"
                  className="controls__slider"
                  min={0}
                  max={40}
                  value={flex.gap}
                  onChange={(e) => handleFlexChange('gap', Number(e.target.value))}
                />
                <span className="controls__slider-value">{flex.gap}px</span>
              </div>
            </div>

            {/* FLEX ITEM section */}
            <span className="controls__section-label" style={{ marginTop: 8 }}>
              Flex Item (Sidebar)
            </span>

            {!selectedItem ? (
              <span className="controls__item-placeholder">
                Click an item to edit
              </span>
            ) : (
              <>
                <div className="controls__prop-row">
                  <span className="controls__prop-label">flex-grow</span>
                  <select
                    className="controls__prop-select"
                    value={flex.flexGrow}
                    onChange={(e) => handleFlexChange('flexGrow', e.target.value)}
                  >
                    <option>0</option>
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                  </select>
                </div>
                <div className="controls__prop-row">
                  <span className="controls__prop-label">flex-shrink</span>
                  <select
                    className="controls__prop-select"
                    value={flex.flexShrink}
                    onChange={(e) => handleFlexChange('flexShrink', e.target.value)}
                  >
                    <option>0</option>
                    <option>1</option>
                    <option>2</option>
                  </select>
                </div>
                <div className="controls__prop-row">
                  <span className="controls__prop-label">align-self</span>
                  <select
                    className="controls__prop-select"
                    value={flex.alignSelf}
                    onChange={(e) => handleFlexChange('alignSelf', e.target.value)}
                  >
                    <option>auto</option>
                    <option>flex-start</option>
                    <option>flex-end</option>
                    <option>center</option>
                    <option>stretch</option>
                  </select>
                </div>
                {/* Locked at early levels */}
                <div className={`controls__prop-row ${levelIndex < 2 ? 'controls__prop-row--locked' : ''}`}>
                  <span className="controls__prop-label">flex-basis</span>
                  {levelIndex < 2 && <Lock size={12} className="controls__prop-lock-icon" />}
                  <select className="controls__prop-select" value={flex.flexBasis}
                    onChange={(e) => handleFlexChange('flexBasis', e.target.value)}
                  >
                    <option>auto</option>
                    <option>0</option>
                    <option>100px</option>
                    <option>200px</option>
                    <option>50%</option>
                  </select>
                </div>
                <div className={`controls__prop-row ${levelIndex < 3 ? 'controls__prop-row--locked' : ''}`}>
                  <span className="controls__prop-label">order</span>
                  {levelIndex < 3 && <Lock size={12} className="controls__prop-lock-icon" />}
                  <select className="controls__prop-select" value={flex.order}
                    onChange={(e) => handleFlexChange('order', e.target.value)}
                  >
                    <option>0</option>
                    <option>1</option>
                    <option>-1</option>
                    <option>2</option>
                  </select>
                </div>
              </>
            )}
          </div>
        )}

        <div className="controls__divider" />

        {/* ─── Live CSS Output ─────────────────────────── */}
        <div className="controls__code-panel">
          <div className="controls__code-header">
            <span className="controls__code-label">CSS Output</span>
            {!codeIsEditable ? (
              <span className="controls__code-badge">Read Only</span>
            ) : (
              <span className="controls__code-badge" style={{ background: 'rgba(34,197,94,0.12)', color: '#22C55E' }}>
                Editable
              </span>
            )}
          </div>

          <div className={`controls__code-body ${!codeIsEditable ? 'controls__code-body--readonly' : ''}`}>
            {!codeIsEditable ? (
              <div
                dangerouslySetInnerHTML={{ __html: highlightCSS(currentCSS) }}
                style={{ whiteSpace: 'pre' }}
              />
            ) : (
              <textarea
                className="controls__code-textarea"
                value={currentCSS}
                onChange={(e) => handleCodeChange(e.target.value)}
                spellCheck="false"
              />
            )}
          </div>
        </div>
      </div>

      {/* ═══ Victory Modal ═════════════════════════════════ */}
      {showVictory && (
        <div className="layout-arena__overlay">
          <div className="layout-arena__modal">
            <h2 className="modal__title">Mission Complete!</h2>
            <div className="modal__stats">
              <div className="modal__stat">
                <span>XP Earned</span>
                <strong className="modal__stat-accent">
                  +{challenge.baseXP - hintXPLost} XP
                </strong>
              </div>
              <div className="modal__stat">
                <span>Hints Used</span>
                <strong>{hintTier} / 3</strong>
              </div>
              <div className="modal__stat">
                <span>Stage</span>
                <strong>
                  {levelIndex + 1} / {totalLevels}
                </strong>
              </div>
            </div>
            <div className="modal__buttons">
              <button
                className="modal__btn modal__btn--ghost"
                onClick={() => navigate('/modules')}
              >
                Back to Modules
              </button>
              {levelIndex < totalLevels - 1 ? (
                <button
                  className="modal__btn modal__btn--primary"
                  onClick={() => {
                    setShowVictory(false)
                    onNextLevel?.()
                  }}
                >
                  Next Mission
                </button>
              ) : (
                <button
                  className="modal__btn modal__btn--primary"
                  onClick={() => navigate('/modules')}
                >
                  Finish Path
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
