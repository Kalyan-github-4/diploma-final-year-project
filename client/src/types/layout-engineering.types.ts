/**
 * Layout Engineering Module - TypeScript Types
 * Defines all interfaces and types for the real-world CSS learning system
 */

// ═══════════════════════════════════════════════════════════════════════════
// ENUMS & LITERAL TYPES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Challenge mode type - determines how user interacts with the challenge
 * - build: User writes CSS from scratch to match a target layout
 * - debug: User fixes broken CSS to match the target layout
 */
export type MissionMode = 'build' | 'debug'

/**
 * Real-world context identifier - shapes the challenge's practical relevance
 */
export type RealWorldContext =
  | 'navbar'
  | 'dashboard'
  | 'card-grid'
  | 'form'
  | 'sidebar'

/**
 * Path identifier - three learning paths users can take
 */
export type PathId = 'flexbox' | 'grid' | 'layout-pro'

/**
 * Validation state during challenge completion
 */
export type ValidationState = 'incomplete' | 'partial' | 'complete'

// ═══════════════════════════════════════════════════════════════════════════
// CORE CHALLENGE INTERFACE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Represents a single layout challenge (replaces PokemonLevel)
 * Each challenge teaches CSS concepts through a real-world context
 */
export interface LayoutChallenge {
  // Identification
  id: string // e.g., "flexbox-1", "grid-boss", "layout-pro-3"
  path: PathId
  level: number // 1-6 per path
  isBossMission: boolean // true for level 6

  // Content
  title: string // e.g., "Center the Navigation"
  description: string // Challenge brief
  mode: MissionMode // Build or Debug

  // Context
  realWorldContext: RealWorldContext // Shapes the HTML structure and use case

  // Target Layout Definition
  targetHtml: string // HTML structure user will style
  targetCss: Record<string, string> // Selectors → CSS strings
  // Example: { ".navbar": "display: flex; justify-content: center;" }

  // Debug Mode: Pre-broken CSS
  brokenCss?: Record<string, string> // CSS with intentional issues

  // Learning Resources
  learningFocus: string[] // CSS concepts covered: ["display: flex", "justify-content"]
  hints: {
    conceptual: string // Explain the CSS concept
    specific: string // How it applies to this challenge
    codeTip: string // Code example or suggestion
  }

  // Scoring Configuration
  baseXP: number // Base experience points (50-200)

  // Build Mode: Accuracy-based completion
  accuracy?: {
    perfectMatch: number // % required for 3★ (typically 95)
    partialMatch: number // % required for 1★ (typically 60)
  }

  // Debug Mode: Efficiency-based completion
  efficiency?: {
    targetEdits: number // Ideal number of CSS edits
    maxEdits: number // Threshold before penalty
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// PATH DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Path definition - a learning track containing 6 challenges
 */
export interface LayoutPath {
  id: PathId
  name: string // "CSS Flexbox", "CSS Grid", "Layout Pro"
  description: string
  icon: React.ReactNode // Lucide icon
  color: string // Hex color for branding

  challenges: LayoutChallenge[] // 6 challenges (5 + boss)

  // Unlock Configuration
  unlocked: boolean // Current user's unlock status
  unlockedBy?: {
    minLevel: number // Level required on another path (e.g., 3)
    minPath?: PathId | null // Which path (null = always unlocked)
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// PROGRESS TRACKING
// ═══════════════════════════════════════════════════════════════════════════

/**
 * User progress within a single path
 * Persisted to localStorage and (future) backend
 */
export interface PathProgress {
  pathId: PathId
  completedLevels: Set<number> // 1-6
  xpEarned: number // Total XP from this path
  streakCount: number // Consecutive completions (for bonuses)
  badgesEarned: string[] // Badge IDs earned in this path
  lastCompletedAt: Date | null // Timestamp of last completion
}

/**
 * Result of completing a single challenge
 * Stores performance metrics and scoring data
 */
export interface ChallengeResult {
  // Identification
  challengeId: string
  pathId: PathId
  level: number
  completedAt: Date

  // Completion Status
  completed: boolean
  xpEarned: number

  // Performance Metrics - Build Mode
  accuracy?: number // 0-100
  targetCssMatches?: number // How many CSS properties matched
  targetCssTotal?: number // Total CSS properties to match

  // Performance Metrics - Debug Mode
  editCount?: number // Actual edits user made
  efficiency?: number // (targetEdits / editCount) * 100

  // Scoring
  stars: number // 1-3 stars based on performance
  badges?: string[] // Badges earned for this challenge
  timeSpent: number // Seconds to complete
}

// ═══════════════════════════════════════════════════════════════════════════
// STATE MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Complete state of the Layout Engineering module
 * Managed by React Context
 */
export interface LayoutEngineeringState {
  // Current Session
  currentPathId: PathId
  currentLevelIndex: number // 0-5 (0 = level 1)
  currentChallenge: LayoutChallenge | null

  // User Input
  cssInput: string // Current CSS in editor
  debugEditHistory: Array<{
    timestamp: Date
    oldCss: string
    newCss: string
  }>

  // Progress (persisted to localStorage)
  pathProgress: Record<PathId, PathProgress>
  unlockedPaths: Set<PathId>
  userResults: Record<string, ChallengeResult> // Keyed by challengeId

  // Current Session Validation
  validationState: ValidationState
  liveMetrics: {
    accuracy?: number
    efficiency?: number
    cssMatchCount: number // Build mode: matching properties
    cssTargetCount: number // Build mode: total properties
    remainingIssues?: string[] // Debug mode: unresolved issues
  }

  // UI State
  showHint: boolean
  currentResult: ChallengeResult | null
  isLoading: boolean
  error: string | null
}

/**
 * Actions dispatched to update state
 */
export interface LayoutEngineeringActions {
  updateCssInput: (css: string) => void
  completeChallenge: (result: ChallengeResult) => void
  updateValidationState: (state: ValidationState) => void
  setCurrentChallenge: (challenge: LayoutChallenge) => void
  moveToNextLevel: () => void
  moveToPreviousLevel: () => void
  selectPath: (pathId: PathId) => void
  selectLevel: (levelIndex: number) => void
  unlockPath: (pathId: PathId) => void
  toggleHint: () => void
  resetChallenge: () => void
  loadProgress: () => void
  saveProgress: () => void
}

/**
 * Context type with state and actions
 */
export type LayoutEngineeringContextType = LayoutEngineeringState &
  LayoutEngineeringActions

// ═══════════════════════════════════════════════════════════════════════════
// VALIDATION & SCORING
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Build mode validation result
 */
export interface BuildModeValidation {
  accuracy: number // 0-100
  matchedProperties: string[] // CSS properties that match
  missingProperties: string[] // CSS properties that don't match
  isComplete: boolean // Accuracy ≥ threshold
}

/**
 * Debug mode validation result
 */
export interface DebugModeValidation {
  efficiency: number // 0-100 (based on edit count)
  isFixed: boolean // All issues resolved
  remainingIssues: string[] // Still-broken CSS properties
  extraEdits: number // Edits over target
}

/**
 * Scoring result after challenge completion
 */
export interface ScoringResult {
  xpEarned: number
  stars: number // 1-3
  badges?: string[] // Badges earned (accuracy streak, perfect efficiency, etc.)
  bonusXP?: number // Speed bonus, streak bonus, etc.
  totalXP: number // baseXP + bonuses
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT PROPS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Props for Build mode sandbox component
 */
export interface BuildSandboxProps {
  challenge: LayoutChallenge
  userCss: string
  validation: BuildModeValidation
  onCssChange: (css: string) => void
}

/**
 * Props for Debug mode sandbox component
 */
export interface DebugSandboxProps {
  challenge: LayoutChallenge
  userCss: string
  validation: DebugModeValidation
  editHistory: DebugModeValidation[]
  onCssChange: (css: string) => void
}

/**
 * Props for challenge brief component
 */
export interface ChallengeBriefProps {
  challenge: LayoutChallenge
  hint: string
  showHint: boolean
  onToggleHint: () => void
}

/**
 * Props for path selector component
 */
export interface PathSelectorProps {
  paths: LayoutPath[]
  currentPathId: PathId
  onSelectPath: (pathId: PathId) => void
}

// ═══════════════════════════════════════════════════════════════════════════
// REAL-WORLD CONTEXTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Defines a real-world context template
 */
export interface RealWorldContextTemplate {
  name: string // "Navigation Bar"
  description: string // User-facing explanation
  htmlTemplate: string // HTML structure for challenges
  realWorldUse: string // Why this layout matters in production
  commonCSSSelectors: string[] // Typical selectors users will target
}

/**
 * Map of all available contexts
 */
export type RealWorldContextMap = Record<
  RealWorldContext,
  RealWorldContextTemplate
>
