/**
 * Layout Engineering Paths Metadata
 * Defines path definitions, unlock rules, and path-specific data
 */

import type { PathId, LayoutPath } from '@/types/layout-engineering.types'
import { LayoutGrid, Grid3x3, Zap } from 'lucide-react'

/**
 * Unlock rules for each path
 * Determines what conditions must be met to unlock a learning path
 */
export const pathUnlockRules: Record<
  PathId,
  {
    alwaysUnlocked?: boolean
    requiredPath?: PathId
    requiredLevel?: number
    description: string
  }
> = {
  flexbox: {
    alwaysUnlocked: true,
    description: 'Start your layout journey with Flexbox fundamentals',
  },
  grid: {
    alwaysUnlocked: true,
    description: 'Master two-dimensional layouts with CSS Grid',
  },
  'layout-pro': {
    alwaysUnlocked: true,
    description: 'Combine Flexbox and Grid for professional layouts',
  },
}

/**
 * Create an empty LayoutPath object with metadata
 * Actual challenges are populated by path-specific level data files
 */
export function createPathTemplate(
  id: PathId,
  name: string,
  description: string,
  color: string,
  unlocked: boolean = false
): Omit<LayoutPath, 'challenges'> {
  return {
    id,
    name,
    description,
    color,
    unlocked,
    icon:
      id === 'flexbox' ? (
        <LayoutGrid size={24} />
      ) : id === 'grid' ? (
        <Grid3x3 size={24} />
      ) : (
        <Zap size={24} />
      ),
  }
}

/**
 * Paths metadata - these are templates that get populated with challenges
 */
export const pathMetadata = {
  flexbox: createPathTemplate(
    'flexbox',
    'CSS Flexbox',
    'Master one-dimensional layouts with Flexbox. Learn main-axis and cross-axis alignment, wrapping, and spacing.',
    '#0EA5E9', // cyan
    true // Always unlocked
  ),
  grid: createPathTemplate(
    'grid',
    'CSS Grid',
    'Build two-dimensional layouts with CSS Grid. Control rows, columns, areas, and responsive sizing.',
    '#8B5CF6', // purple
    true
  ),
  'layout-pro': createPathTemplate(
    'layout-pro',
    'Layout Pro',
    'Combine Flexbox and Grid. Build professional, complex layouts used in production applications.',
    '#EC4899', // pink
    true
  ),
}
