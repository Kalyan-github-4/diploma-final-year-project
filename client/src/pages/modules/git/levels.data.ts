/* ──────────────────────────────────────────────────────────
   Git & GitHub Module – Level Definitions & Progress Utils
   ────────────────────────────────────────────────────────── */

export type LevelDifficulty = "beginner" | "intermediate" | "advanced"

export interface LevelData {
  id: number
  title: string
  subtitle: string
  /** matches backend baseTopicFromLevel() */
  topic: string
  xp: number
  difficulty: LevelDifficulty
  questionsCount: number
  icon: string
}

export const gitLevels: LevelData[] = [
  // ── Beginner ──────────────────────────────────────────
  {
    id: 1,
    title: "Git Basics",
    subtitle: "init · add · commit",
    topic: "git-basics",
    xp: 200,
    difficulty: "beginner",
    questionsCount: 3,
    icon: "🌱",
  },
  {
    id: 2,
    title: "Status & Logs",
    subtitle: "status · log · diff",
    topic: "git-basics",
    xp: 250,
    difficulty: "beginner",
    questionsCount: 3,
    icon: "📋",
  },
  {
    id: 3,
    title: "Staging Area",
    subtitle: "add · reset · restore",
    topic: "git-basics",
    xp: 300,
    difficulty: "beginner",
    questionsCount: 3,
    icon: "📦",
  },
  // ── Intermediate ──────────────────────────────────────
  {
    id: 4,
    title: "Branching",
    subtitle: "branch · checkout · switch",
    topic: "branching-workflows",
    xp: 400,
    difficulty: "intermediate",
    questionsCount: 3,
    icon: "🌿",
  },
  {
    id: 5,
    title: "Merging",
    subtitle: "merge · fast-forward",
    topic: "branching-workflows",
    xp: 450,
    difficulty: "intermediate",
    questionsCount: 3,
    icon: "🔀",
  },
  {
    id: 6,
    title: "Branch Workflows",
    subtitle: "gitflow · feature branches",
    topic: "branching-workflows",
    xp: 500,
    difficulty: "intermediate",
    questionsCount: 4,
    icon: "⚡",
  },
  // ── Advanced ──────────────────────────────────────────
  {
    id: 7,
    title: "Rebase & History",
    subtitle: "rebase · cherry-pick",
    topic: "merge-and-history",
    xp: 600,
    difficulty: "advanced",
    questionsCount: 4,
    icon: "🔁",
  },
  {
    id: 8,
    title: "Undoing Changes",
    subtitle: "reset · revert · restore",
    topic: "merge-and-history",
    xp: 700,
    difficulty: "advanced",
    questionsCount: 4,
    icon: "↩️",
  },
  {
    id: 9,
    title: "Conflict Resolution",
    subtitle: "merge conflicts · strategies",
    topic: "merge-and-history",
    xp: 750,
    difficulty: "advanced",
    questionsCount: 4,
    icon: "⚔️",
  },
  {
    id: 10,
    title: "Remote Basics",
    subtitle: "remote · fetch · pull · push",
    topic: "advanced-collaboration",
    xp: 800,
    difficulty: "advanced",
    questionsCount: 5,
    icon: "🌐",
  },
  {
    id: 11,
    title: "GitHub Workflows",
    subtitle: "PRs · forks · code review",
    topic: "advanced-collaboration",
    xp: 1000,
    difficulty: "advanced",
    questionsCount: 5,
    icon: "🐙",
  },
  {
    id: 12,
    title: "Git Mastery",
    subtitle: "hooks · aliases · advanced",
    topic: "advanced-collaboration",
    xp: 1200,
    difficulty: "advanced",
    questionsCount: 6,
    icon: "🏆",
  },
]

/* ── Badges ──────────────────────────────────────────────── */
export interface BadgeData {
  id: string
  label: string
  icon: string
  description: string
  minLevels: number
}

export const gitBadges: BadgeData[] = [
  {
    id: "git-init",
    label: "First Commit",
    icon: "🌱",
    description: "Complete all beginner levels",
    minLevels: 3,
  },
  {
    id: "git-branch",
    label: "Branching Out",
    icon: "🌿",
    description: "Master branching & merging",
    minLevels: 6,
  },
  {
    id: "git-historian",
    label: "History Master",
    icon: "📜",
    description: "Complete advanced history topics",
    minLevels: 9,
  },
  {
    id: "git-master",
    label: "Git Master",
    icon: "🏆",
    description: "Complete all 12 levels",
    minLevels: 12,
  },
]

/* ── Module level registry ───────────────────────────────── */
export const moduleLevelsMap: Record<string, LevelData[]> = {
  "git-github": gitLevels,
}

export function getModuleLevels(slug: string): LevelData[] {
  return moduleLevelsMap[slug] ?? []
}

/* ── Progress persistence ────────────────────────────────── */
export interface ModuleProgress {
  completedLevels: number[]
  totalXpEarned: number
}

function progressKey(slug: string) {
  return `codeking_module_progress_${slug}`
}

export function loadModuleProgress(slug: string): ModuleProgress {
  try {
    const raw = localStorage.getItem(progressKey(slug))
    if (raw) return JSON.parse(raw) as ModuleProgress
  } catch {
    /* ignore parse errors */
  }
  return { completedLevels: [], totalXpEarned: 0 }
}

export function saveModuleProgress(slug: string, progress: ModuleProgress): void {
  localStorage.setItem(progressKey(slug), JSON.stringify(progress))
}

/** Marks a level as completed and persists. Returns updated progress. */
export function completeLevel(
  slug: string,
  levelId: number,
  xpEarned: number
): ModuleProgress {
  const prog = loadModuleProgress(slug)
  if (!prog.completedLevels.includes(levelId)) {
    prog.completedLevels.push(levelId)
    prog.totalXpEarned += xpEarned
    saveModuleProgress(slug, prog)
  }
  return prog
}

/** Returns status for a level given current progress (sequential model). */
export function getLevelStatus(
  levelId: number,
  progress: ModuleProgress
): "completed" | "current" | "locked" {
  if (progress.completedLevels.includes(levelId)) return "completed"
  return "current"
}
