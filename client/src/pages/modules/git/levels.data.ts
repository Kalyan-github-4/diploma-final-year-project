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
  // ── Beginner (Foundation) ─────────────────────────────
  {
    id: 1,
    title: "Repo Kickoff",
    subtitle: "init · add · commit",
    topic: "git-basics",
    xp: 180,
    difficulty: "beginner",
    questionsCount: 3,
    icon: "repo-kickoff",
  },
  {
    id: 2,
    title: "Commit Hygiene",
    subtitle: "status · log · atomic commits",
    topic: "git-basics",
    xp: 220,
    difficulty: "beginner",
    questionsCount: 3,
    icon: "commit-hygiene",
  },
  {
    id: 3,
    title: "Staging Mastery",
    subtitle: "add · reset · restore",
    topic: "git-basics",
    xp: 260,
    difficulty: "beginner",
    questionsCount: 4,
    icon: "staging-mastery",
  },
  {
    id: 4,
    title: "Debug with Log",
    subtitle: "log --oneline · diff",
    topic: "git-basics",
    xp: 300,
    difficulty: "beginner",
    questionsCount: 4,
    icon: "debug-log",
  },
  {
    id: 5,
    title: "Safe Undo",
    subtitle: "restore · reset --soft",
    topic: "git-basics",
    xp: 340,
    difficulty: "beginner",
    questionsCount: 4,
    icon: "safe-undo",
  },
  {
    id: 6,
    title: "Team-Ready Basics",
    subtitle: "messages · clean history",
    topic: "git-basics",
    xp: 380,
    difficulty: "beginner",
    questionsCount: 4,
    icon: "team-ready",
  },
  // ── Intermediate (Branching) ──────────────────────────
  {
    id: 7,
    title: "Feature Branch Start",
    subtitle: "branch · checkout · switch",
    topic: "branching-workflows",
    xp: 430,
    difficulty: "intermediate",
    questionsCount: 4,
    icon: "feature-branch",
  },
  {
    id: 8,
    title: "Parallel Workstreams",
    subtitle: "multiple branches · context switch",
    topic: "branching-workflows",
    xp: 480,
    difficulty: "intermediate",
    questionsCount: 4,
    icon: "parallel-workstreams",
  },
  {
    id: 9,
    title: "Fast-Forward Merge",
    subtitle: "merge · clean branch flow",
    topic: "branching-workflows",
    xp: 540,
    difficulty: "intermediate",
    questionsCount: 5,
    icon: "fast-forward-merge",
  },
  {
    id: 10,
    title: "Release Branch Drill",
    subtitle: "hotfix · release merge",
    topic: "branching-workflows",
    xp: 600,
    difficulty: "intermediate",
    questionsCount: 5,
    icon: "release-drill",
  },
  {
    id: 11,
    title: "Branch Policy",
    subtitle: "naming · review flow",
    topic: "branching-workflows",
    xp: 660,
    difficulty: "intermediate",
    questionsCount: 5,
    icon: "branch-policy",
  },
  {
    id: 12,
    title: "Integration Readiness",
    subtitle: "sync before merge",
    topic: "branching-workflows",
    xp: 720,
    difficulty: "intermediate",
    questionsCount: 5,
    icon: "integration-readiness",
  },
  // ── Advanced (History + Collaboration) ────────────────
  {
    id: 13,
    title: "Rebase Control",
    subtitle: "rebase · linear history",
    topic: "merge-and-history",
    xp: 800,
    difficulty: "advanced",
    questionsCount: 5,
    icon: "rebase-control",
  },
  {
    id: 14,
    title: "Conflict Surgery",
    subtitle: "resolve conflicts safely",
    topic: "merge-and-history",
    xp: 900,
    difficulty: "advanced",
    questionsCount: 5,
    icon: "conflict-surgery",
  },
  {
    id: 15,
    title: "Recovery Toolkit",
    subtitle: "revert · reflog · reset",
    topic: "merge-and-history",
    xp: 1000,
    difficulty: "advanced",
    questionsCount: 6,
    icon: "recovery-toolkit",
  },
  {
    id: 16,
    title: "Remote Sync Master",
    subtitle: "fetch · pull · push · upstream",
    topic: "advanced-collaboration",
    xp: 1100,
    difficulty: "advanced",
    questionsCount: 6,
    icon: "remote-sync",
  },
  {
    id: 17,
    title: "PR Command Center",
    subtitle: "PRs · checks · review · merge",
    topic: "advanced-collaboration",
    xp: 1250,
    difficulty: "advanced",
    questionsCount: 6,
    icon: "pr-command-center",
  },
  {
    id: 18,
    title: "Git & GitHub King",
    subtitle: "real incident response · full workflow",
    topic: "advanced-collaboration",
    xp: 1500,
    difficulty: "advanced",
    questionsCount: 7,
    icon: "king",
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
    icon: "badge-foundation",
    description: "Complete foundation levels",
    minLevels: 6,
  },
  {
    id: "git-branch",
    label: "Branching Out",
    icon: "badge-branching",
    description: "Master core branch workflows",
    minLevels: 12,
  },
  {
    id: "git-historian",
    label: "History Master",
    icon: "badge-history",
    description: "Complete advanced history recovery",
    minLevels: 15,
  },
  {
    id: "git-master",
    label: "Git & GitHub King",
    icon: "badge-king",
    description: "Complete all 18 levels",
    minLevels: 18,
  },
]

export const dsaLevels: LevelData[] = [
  {
    id: 1,
    title: "Binary Search Fundamentals",
    subtitle: "indices · mid · divide-and-conquer",
    topic: "binary-search",
    xp: 280,
    difficulty: "beginner",
    questionsCount: 1,
    icon: "🔎",
  },
  {
    id: 2,
    title: "Bubble Sort Visual Run",
    subtitle: "passes · swaps · optimization",
    topic: "bubble-sort",
    xp: 320,
    difficulty: "beginner",
    questionsCount: 1,
    icon: "🫧",
  },
]

export const cssLayoutLevels: LevelData[] = [
  // ── Flexbox ───────────────────────────────────────────────
  {
    id: 1,
    title: "Center the Box",
    subtitle: "display: flex · justify-content · align-items",
    topic: "flexbox",
    xp: 50,
    difficulty: "beginner",
    questionsCount: 1,
    icon: "flexbox",
  },
  {
    id: 2,
    title: "Spread the Navbar",
    subtitle: "justify-content: space-between",
    topic: "flexbox",
    xp: 60,
    difficulty: "beginner",
    questionsCount: 1,
    icon: "flexbox",
  },
  {
    id: 3,
    title: "Stack the Cards",
    subtitle: "flex-direction: column · gap",
    topic: "flexbox",
    xp: 70,
    difficulty: "beginner",
    questionsCount: 1,
    icon: "flexbox",
  },
  {
    id: 4,
    title: "Wrap the Tags",
    subtitle: "flex-wrap: wrap",
    topic: "flexbox",
    xp: 100,
    difficulty: "intermediate",
    questionsCount: 1,
    icon: "flexbox",
  },
  {
    id: 5,
    title: "Sidebar + Content",
    subtitle: "flex: 1 · flex-shrink: 0",
    topic: "flexbox",
    xp: 120,
    difficulty: "intermediate",
    questionsCount: 1,
    icon: "flexbox",
  },
  {
    id: 6,
    title: "App Shell Layout",
    subtitle: "flex-direction: column · nested flex",
    topic: "flexbox",
    xp: 160,
    difficulty: "advanced",
    questionsCount: 1,
    icon: "flexbox",
  },
  // ── Grid ─────────────────────────────────────────────────
  {
    id: 7,
    title: "Three Equal Columns",
    subtitle: "display: grid · repeat(3, 1fr)",
    topic: "grid",
    xp: 60,
    difficulty: "beginner",
    questionsCount: 1,
    icon: "css-grid",
  },
  {
    id: 8,
    title: "Responsive Auto-Fit",
    subtitle: "auto-fit · minmax()",
    topic: "grid",
    xp: 80,
    difficulty: "beginner",
    questionsCount: 1,
    icon: "css-grid",
  },
  {
    id: 9,
    title: "Featured Card Span",
    subtitle: "grid-column: span 2",
    topic: "grid",
    xp: 100,
    difficulty: "intermediate",
    questionsCount: 1,
    icon: "css-grid",
  },
  {
    id: 10,
    title: "Named Grid Areas",
    subtitle: "grid-template-areas · grid-area",
    topic: "grid",
    xp: 130,
    difficulty: "intermediate",
    questionsCount: 1,
    icon: "css-grid",
  },
  {
    id: 11,
    title: "Stats Dashboard",
    subtitle: "grid-column + grid-row span",
    topic: "grid",
    xp: 140,
    difficulty: "advanced",
    questionsCount: 1,
    icon: "css-grid",
  },
  {
    id: 12,
    title: "Full Page Dashboard",
    subtitle: "grid-template-areas · named regions",
    topic: "grid",
    xp: 200,
    difficulty: "advanced",
    questionsCount: 1,
    icon: "css-grid",
  },
]

/* ── Module level registry ───────────────────────────────── */
export const moduleLevelsMap: Record<string, LevelData[]> = {
  "git-github": gitLevels,
  dsa: dsaLevels,
  "css-layout": cssLayoutLevels,
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
