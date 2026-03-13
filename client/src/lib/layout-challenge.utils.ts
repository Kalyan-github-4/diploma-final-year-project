/**
 * Layout Engineering - Challenge Validation & Scoring Utilities
 * Core logic for Build and Debug mode validation, accuracy calculation, and scoring
 */

import type {
  LayoutChallenge,
  BuildModeValidation,
  DebugModeValidation,
  ScoringResult,
  ChallengeResult,
} from '@/types/layout-engineering.types'

// ═══════════════════════════════════════════════════════════════════════════
// BUILD MODE VALIDATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Converts camelCase CSS property to kebab-case
 * @example "justifyContent" → "justify-content"
 */
function toKebabCase(str: string): string {
  return str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
}

/**
 * Parses CSS string into individual properties
 * @example "display: flex; justify-content: center;" → { display: "flex", "justify-content": "center" }
 */
function parseCSSString(css: string): Record<string, string> {
  const properties: Record<string, string> = {}

  css
    .split(';')
    .filter((prop) => prop.trim())
    .forEach((prop) => {
      const [key, value] = prop.split(':').map((s) => s.trim())
      if (key && value) {
        properties[key] = value
      }
    })

  return properties
}

/**
 * Creates a temporary DOM element with target HTML and user CSS
 * Used for computing actual styles to compare against target
 */
function createTestDOM(
  targetHtml: string,
  userCss: string,
  container: string = 'test-container'
): HTMLElement {
  const wrapper = document.createElement('div')
  wrapper.id = container
  wrapper.style.cssText =
    'position: absolute; left: -9999px; visibility: hidden;'

  // Add HTML content
  wrapper.innerHTML = targetHtml

  // Apply user CSS
  const styleElement = document.createElement('style')
  styleElement.textContent = userCss
  wrapper.appendChild(styleElement)

  document.body.appendChild(wrapper)

  return wrapper
}

/**
 * Cleans up test DOM after validation
 */
function cleanupTestDOM(containerId: string): void {
  const container = document.getElementById(containerId)
  if (container) {
    container.remove()
  }
}

/**
 * Validates user CSS against target CSS in Build mode
 * Returns accuracy percentage and which properties match
 */
export function validateBuildMode(
  userCss: string,
  challenge: LayoutChallenge
): BuildModeValidation {
  if (!challenge.targetCss) {
    return {
      accuracy: 0,
      matchedProperties: [],
      missingProperties: Object.keys(challenge.targetCss || {}),
      isComplete: false,
    }
  }

  const containerId = `build-test-${Date.now()}`

  try {
    // Create test DOM with user CSS
    const testDOM = createTestDOM(
      challenge.targetHtml,
      userCss,
      containerId
    )

    const matchedProperties: string[] = []
    const missingProperties: string[] = []

    // For each selector and target CSS property, check if user's CSS matches
    Object.entries(challenge.targetCss).forEach(([selector, targetCSS]) => {
      try {
        const element = testDOM.querySelector(selector)
        if (!element) {
          missingProperties.push(`${selector} (not found)`)
          return
        }

        const computedStyles = getComputedStyle(element as Element)
        const parsedTarget = parseCSSString(targetCSS)

        Object.entries(parsedTarget).forEach(([prop, targetValue]) => {
          const kebabProp = toKebabCase(prop)
          const userValue = computedStyles
            .getPropertyValue(kebabProp)
            .trim()

          // Normalize values for comparison (handle variations like "center" vs "space-around")
          const normalizedTarget = normalizeCSS(targetValue)
          const normalizedUser = normalizeCSS(userValue)

          if (normalizedUser === normalizedTarget) {
            matchedProperties.push(`${selector}::${prop}`)
          } else {
            missingProperties.push(`${selector}::${prop}`)
          }
        })
      } catch (error) {
        console.error(`Error validating selector ${selector}:`, error)
        missingProperties.push(`${selector} (error)`)
      }
    })

    // Calculate accuracy
    const total = matchedProperties.length + missingProperties.length || 1
    const accuracy = Math.round((matchedProperties.length / total) * 100)

    // Check if challenge is complete (meets threshold)
    const threshold = challenge.accuracy?.perfectMatch || 90
    const isComplete = accuracy >= threshold

    return {
      accuracy,
      matchedProperties,
      missingProperties,
      isComplete,
    }
  } finally {
    cleanupTestDOM(containerId)
  }
}

/**
 * Normalizes CSS values for comparison
 * Handles shorthand, spacing, color formats, etc.
 */
function normalizeCSS(value: string): string {
  const normalized = value.toLowerCase().trim()

  // Remove extra spaces
  return normalized.replace(/\s+/g, ' ').replace(/\s*\)\s*/g, ')')
}

// ═══════════════════════════════════════════════════════════════════════════
// DEBUG MODE VALIDATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Validates user CSS against target CSS in Debug mode
 * Returns efficiency based on number of edits vs ideal edits
 */
export function validateDebugMode(
  userCss: string,
  challenge: LayoutChallenge,
  editCount: number
): DebugModeValidation {
  if (!challenge.targetCss || !challenge.efficiency) {
    return {
      efficiency: 0,
      isFixed: false,
      remainingIssues: [],
      extraEdits: 0,
    }
  }

  const containerId = `debug-test-${Date.now()}`

  try {
    const testDOM = createTestDOM(
      challenge.targetHtml,
      userCss,
      containerId
    )

    const remainingIssues: string[] = []
    let issueCount = 0

    // Check each target CSS property
    Object.entries(challenge.targetCss).forEach(([selector, targetCSS]) => {
      try {
        const element = testDOM.querySelector(selector)
        if (!element) {
          remainingIssues.push(`${selector} (not found)`)
          issueCount++
          return
        }

        const computedStyles = getComputedStyle(element as Element)
        const parsedTarget = parseCSSString(targetCSS)

        Object.entries(parsedTarget).forEach(([prop, targetValue]) => {
          const kebabProp = toKebabCase(prop)
          const userValue = computedStyles
            .getPropertyValue(kebabProp)
            .trim()

          const normalizedTarget = normalizeCSS(targetValue)
          const normalizedUser = normalizeCSS(userValue)

          if (normalizedUser !== normalizedTarget) {
            remainingIssues.push(`${selector}::${prop}`)
            issueCount++
          }
        })
      } catch (error) {
        console.error(`Error validating selector ${selector}:`, error)
        remainingIssues.push(`${selector} (error)`)
        issueCount++
      }
    })

    // Calculate efficiency
    // Efficiency = (targetEdits / actualEdits) * 100
    const targetEdits = challenge.efficiency.targetEdits
    const efficiency = Math.round((targetEdits / Math.max(editCount, 1)) * 100)

    // Challenge is fixed when all issues resolved
    const isFixed = issueCount === 0

    // Extra edits beyond target
    const extraEdits = Math.max(0, editCount - targetEdits)

    return {
      efficiency: Math.min(100, efficiency), // Cap at 100%
      isFixed,
      remainingIssues,
      extraEdits,
    }
  } finally {
    cleanupTestDOM(containerId)
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// SCORING LOGIC
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Converts Build mode accuracy to star rating
 */
function accuracyToStars(accuracy: number, accuracyThreshold?: { perfectMatch: number }): number {
  const perfectMatch = accuracyThreshold?.perfectMatch || 95

  if (accuracy >= perfectMatch) return 3
  if (accuracy >= 80) return 2
  if (accuracy >= 60) return 1
  return 0
}

/**
 * Converts Debug mode efficiency to star rating
 */
function efficiencyToStars(efficiency: number): number {
  if (efficiency >= 90) return 3
  if (efficiency >= 70) return 2
  if (efficiency >= 50) return 1
  return 0
}

/**
 * Calculates XP earned based on performance
 */
function calculateXP(
  baseXP: number,
  stars: number,
  timeSpent: number,
  streakBonus: number = 0
): { xp: number; speedBonus: number; streakBonus: number } {
  // Base XP scaled by stars
  const starMultiplier = stars / 3 // 0-1
  const baseEarned = Math.round(baseXP * starMultiplier)

  // Speed bonus: complete in < 5 minutes
  const speedBonus = timeSpent < 300 ? Math.round(baseXP * 0.05) : 0

  // Streak bonus: 3+ challenges in a row (applied by context, not here)
  const streakBonusAmount = streakBonus > 0 ? Math.round(baseXP * 0.1) : 0

  return {
    xp: baseEarned + speedBonus + streakBonusAmount,
    speedBonus,
    streakBonus: streakBonusAmount,
  }
}

/**
 * Badges earned for achievement milestones
 */
function calculateBadges(
  stars: number,
  mode: 'build' | 'debug',
  accuracy?: number,
  efficiency?: number
): string[] {
  const badges: string[] = []

  if (stars === 3) {
    badges.push('perfect-score')
  }

  if (mode === 'build' && accuracy === 100) {
    badges.push('pixel-perfect')
  }

  if (mode === 'debug' && efficiency && efficiency >= 100) {
    badges.push('surgical-fix')
  }

  return badges
}

/**
 * Main scoring function - calculates final XP and stars for a completed challenge
 */
export function scoreBuildChallenge(
  accuracy: number,
  challenge: LayoutChallenge,
  timeSpent: number,
  streakCount: number = 0
): ScoringResult {
  const stars = accuracyToStars(accuracy, challenge.accuracy)
  const { xp, speedBonus, streakBonus } = calculateXP(
    challenge.baseXP,
    stars,
    timeSpent,
    streakCount
  )
  const badges = calculateBadges(stars, 'build', accuracy)

  return {
    xpEarned: xp - speedBonus - streakBonus, // Base only
    stars,
    badges,
    bonusXP: speedBonus + streakBonus,
    totalXP: xp,
  }
}

/**
 * Scoring for Debug mode challenges
 */
export function scoreDebugChallenge(
  efficiency: number,
  challenge: LayoutChallenge,
  timeSpent: number,
  streakCount: number = 0
): ScoringResult {
  const stars = efficiencyToStars(efficiency)
  const { xp, speedBonus, streakBonus } = calculateXP(
    challenge.baseXP,
    stars,
    timeSpent,
    streakCount
  )
  const badges = calculateBadges(stars, 'debug', undefined, efficiency)

  return {
    xpEarned: xp - speedBonus - streakBonus,
    stars,
    badges,
    bonusXP: speedBonus + streakBonus,
    totalXP: xp,
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// CHALLENGE COMPLETION FUNCTION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Complete a challenge - main function called when user finishes
 * Handles both Build and Debug modes
 */
export function completeChallengeChallenge(
  challenge: LayoutChallenge,
  userCss: string,
  timeSpent: number,
  editCount?: number,
  streakCount: number = 0
): {
  result: ChallengeResult
  isValid: boolean
  canAdvance: boolean
} {
  const now = new Date()

  if (challenge.mode === 'build') {
    const validation = validateBuildMode(userCss, challenge)

    if (!validation.isComplete) {
      return {
        result: {
          challengeId: challenge.id,
          pathId: challenge.path,
          level: challenge.level,
          completedAt: now,
          completed: false,
          accuracy: validation.accuracy,
          xpEarned: 0,
          stars: 0,
          timeSpent,
        },
        isValid: false,
        canAdvance: false,
      }
    }

    const scoring = scoreBuildChallenge(
      validation.accuracy,
      challenge,
      timeSpent,
      streakCount
    )

    return {
      result: {
        challengeId: challenge.id,
        pathId: challenge.path,
        level: challenge.level,
        completedAt: now,
        completed: true,
        accuracy: validation.accuracy,
        targetCssMatches: validation.matchedProperties.length,
        targetCssTotal:
          validation.matchedProperties.length +
          validation.missingProperties.length,
        xpEarned: scoring.totalXP,
        stars: scoring.stars,
        badges: scoring.badges,
        timeSpent,
      },
      isValid: true,
      canAdvance: true,
    }
  } else {
    // Debug mode
    const validation = validateDebugMode(userCss, challenge, editCount || 0)

    if (!validation.isFixed) {
      return {
        result: {
          challengeId: challenge.id,
          pathId: challenge.path,
          level: challenge.level,
          completedAt: now,
          completed: false,
          efficiency: validation.efficiency,
          editCount: editCount || 0,
          xpEarned: 0,
          stars: 0,
          timeSpent,
        },
        isValid: false,
        canAdvance: false,
      }
    }

    const scoring = scoreDebugChallenge(
      validation.efficiency,
      challenge,
      timeSpent,
      streakCount
    )

    return {
      result: {
        challengeId: challenge.id,
        pathId: challenge.path,
        level: challenge.level,
        completedAt: now,
        completed: true,
        efficiency: validation.efficiency,
        editCount: editCount || 0,
        xpEarned: scoring.totalXP,
        stars: scoring.stars,
        badges: scoring.badges,
        timeSpent,
      },
      isValid: true,
      canAdvance: true,
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Format time spent (seconds) to minutes:seconds display
 */
export function formatTimeSpent(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

/**
 * Calculate total XP from all completed challenges in a path
 */
export function calculateTotalXP(results: ChallengeResult[]): number {
  return results.reduce((sum, result) => sum + result.xpEarned, 0)
}
