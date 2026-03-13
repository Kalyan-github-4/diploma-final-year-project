/* ─────────────────────────────────
   Mission Data & Step Validation
   ───────────────────────────────── */

export interface MissionStep {
  id: string
  instruction: string
  completedBy: string
  alternates?: string[]
  hint: string
}

export interface MissionGraphState {
  commits: Record<string, { message: string; parent: string | null }>
  branches: Record<string, string>
  HEAD: { type: "branch" | "detached"; ref: string }
}

export interface Mission {
  id: string
  title: string
  topicId: string
  xp: number
  steps: MissionStep[]
  initialGraphState: MissionGraphState
}

/* Check if a command matches a step's completion criteria */
export function doesCommandCompleteStep(
  command: string,
  step: MissionStep
): boolean {
  const trimmed = command.trim()

  /* Direct match */
  if (trimmed.startsWith(step.completedBy)) return true

  /* Check alternates */
  if (step.alternates) {
    return step.alternates.some((alt) => trimmed.startsWith(alt))
  }

  return false
}

/* ═══════════════════════════════════════════
   Mission 1: Create your first branch
   Graph:  main ●──●
   ═══════════════════════════════════════════ */
export const firstBranchMission: Mission = {
  id: "create-first-branch",
  title: "Create your first branch",
  topicId: "branching-deep-dive",
  xp: 500,
  steps: [
    {
      id: "step-1",
      instruction: "Initialize your repository with `git init`.",
      completedBy: "git init",
      hint: "Type 'git init' in the terminal to initialize a new repository.",
    },
    {
      id: "step-2",
      instruction:
        "Create and switch to a new branch named `feature-alpha`.",
      completedBy: "git checkout -b feature-alpha",
      alternates: ["git switch -c feature-alpha"],
      hint: "The -b flag in 'git checkout -b [branch-name]' is a shortcut that creates a new branch and switches to it immediately.",
    },
    {
      id: "step-3",
      instruction: "Stage your changes using `git add`.",
      completedBy: "git add",
      alternates: ["git add .", "git add README.md"],
      hint: "Use 'git add .' to stage all changed files at once.",
    },
    {
      id: "step-4",
      instruction: "Commit the changes with a descriptive message.",
      completedBy: "git commit -m",
      hint: "Use git commit -m 'your message' to save staged changes.",
    },
  ],
  initialGraphState: {
    commits: {
      "4b2d0e1": { message: "initial", parent: null },
      "9f3a1c2": { message: "readme", parent: "4b2d0e1" },
    },
    branches: { main: "9f3a1c2" },
    HEAD: { type: "branch", ref: "main" },
  },
}

/* ═══════════════════════════════════════════
   Mission 2: Merge a feature branch
   Graph:  main ●──●
                    \
             feature ●
   Goal: switch back to main, then merge
   ═══════════════════════════════════════════ */
export const mergeFeatureMission: Mission = {
  id: "merge-feature-branch",
  title: "Merge a feature branch",
  topicId: "merging-basics",
  xp: 600,
  steps: [
    {
      id: "step-1",
      instruction: "You're on `feature-login`. Switch back to `main`.",
      completedBy: "git checkout main",
      alternates: ["git switch main"],
      hint: "Use 'git checkout main' or 'git switch main' to move to the main branch.",
    },
    {
      id: "step-2",
      instruction: "Merge `feature-login` into `main`.",
      completedBy: "git merge feature-login",
      hint: "Use 'git merge feature-login' to bring the feature branch changes into main.",
    },
    {
      id: "step-3",
      instruction: "Check the log to verify the merge.",
      completedBy: "git log",
      alternates: ["git log --oneline"],
      hint: "Use 'git log --oneline' for a compact view of your commit history.",
    },
  ],
  initialGraphState: {
    commits: {
      "a1b2c3d": { message: "initial commit", parent: null },
      "e4f5a6b": { message: "add homepage", parent: "a1b2c3d" },
      "c7d8e9f": { message: "add login page", parent: "e4f5a6b" },
    },
    branches: { main: "e4f5a6b", "feature-login": "c7d8e9f" },
    HEAD: { type: "branch", ref: "feature-login" },
  },
}

/* ═══════════════════════════════════════════
   Mission 3: Commit workflow basics
   Graph:  main ●  (just initial)
   Goal: full add → commit cycle from scratch
   ═══════════════════════════════════════════ */
export const commitWorkflowMission: Mission = {
  id: "commit-workflow",
  title: "The commit lifecycle",
  topicId: "committing-changes",
  xp: 400,
  steps: [
    {
      id: "step-1",
      instruction: "Initialize a new repository.",
      completedBy: "git init",
      hint: "Type 'git init' to set up a new Git repo.",
    },
    {
      id: "step-2",
      instruction: "Check the current status of your repo.",
      completedBy: "git status",
      hint: "Use 'git status' to see which files are modified, staged, or untracked.",
    },
    {
      id: "step-3",
      instruction: "Stage all your changes.",
      completedBy: "git add",
      alternates: ["git add .", "git add README.md"],
      hint: "Use 'git add .' to stage everything at once.",
    },
    {
      id: "step-4",
      instruction: "Commit with the message `initial setup`.",
      completedBy: "git commit -m",
      hint: "Use git commit -m 'initial setup' to save your work.",
    },
    {
      id: "step-5",
      instruction: "View your commit history.",
      completedBy: "git log",
      alternates: ["git log --oneline"],
      hint: "Use 'git log' to see the list of commits you've made.",
    },
  ],
  initialGraphState: {
    commits: {
      "f0e1d2c": { message: "project scaffold", parent: null },
    },
    branches: { main: "f0e1d2c" },
    HEAD: { type: "branch", ref: "main" },
  },
}

/* ═══════════════════════════════════════════
   Mission 4: Hotfix branch
   Graph:  main    ●──●──●
                   develop ●──●
   Goal: create hotfix from main, commit fix, merge back
   ═══════════════════════════════════════════ */
export const hotfixMission: Mission = {
  id: "hotfix-branch",
  title: "Emergency hotfix",
  topicId: "branching-strategies",
  xp: 700,
  steps: [
    {
      id: "step-1",
      instruction: "You're on `develop`. Switch to `main` first.",
      completedBy: "git checkout main",
      alternates: ["git switch main"],
      hint: "Hotfixes branch off from main. Switch there first with 'git checkout main'.",
    },
    {
      id: "step-2",
      instruction: "Create a `hotfix-typo` branch from `main`.",
      completedBy: "git checkout -b hotfix-typo",
      alternates: ["git switch -c hotfix-typo"],
      hint: "Use 'git checkout -b hotfix-typo' to create and switch to the hotfix branch.",
    },
    {
      id: "step-3",
      instruction: "Stage the fix.",
      completedBy: "git add",
      alternates: ["git add .", "git add README.md"],
      hint: "Stage your changes with 'git add .'.",
    },
    {
      id: "step-4",
      instruction: "Commit the hotfix with a message.",
      completedBy: "git commit -m",
      hint: "Use git commit -m 'fix typo in header' to commit your hotfix.",
    },
    {
      id: "step-5",
      instruction: "Switch back to `main`.",
      completedBy: "git checkout main",
      alternates: ["git switch main"],
      hint: "Go back to main with 'git checkout main' before merging.",
    },
    {
      id: "step-6",
      instruction: "Merge `hotfix-typo` into `main`.",
      completedBy: "git merge hotfix-typo",
      hint: "Use 'git merge hotfix-typo' to apply the fix to main.",
    },
  ],
  initialGraphState: {
    commits: {
      "1a2b3c4": { message: "v1.0 release", parent: null },
      "5d6e7f8": { message: "add navbar", parent: "1a2b3c4" },
      "9a0b1c2": { message: "add footer", parent: "1a2b3c4" },
      "d3e4f5a": { message: "style footer", parent: "9a0b1c2" },
    },
    branches: { main: "5d6e7f8", develop: "d3e4f5a" },
    HEAD: { type: "branch", ref: "develop" },
  },
}

/* ═══════════════════════════════════════════
   Mission 5: Inspect & navigate history
   Graph:  main ●──●──●──●
   Goal: use log, checkout a specific commit (detached HEAD)
   ═══════════════════════════════════════════ */
export const inspectHistoryMission: Mission = {
  id: "inspect-history",
  title: "Time travel with Git",
  topicId: "navigating-history",
  xp: 450,
  steps: [
    {
      id: "step-1",
      instruction: "View the commit history in compact form.",
      completedBy: "git log --oneline",
      alternates: ["git log"],
      hint: "Use 'git log --oneline' to see a compact list of all commits.",
    },
    {
      id: "step-2",
      instruction: "Check which branch you are on.",
      completedBy: "git status",
      hint: "Use 'git status' — the first line tells you which branch you're on.",
    },
    {
      id: "step-3",
      instruction: "Create a `feature-dark-mode` branch.",
      completedBy: "git checkout -b feature-dark-mode",
      alternates: ["git switch -c feature-dark-mode", "git branch feature-dark-mode"],
      hint: "Use 'git checkout -b feature-dark-mode' to create and switch to it.",
    },
    {
      id: "step-4",
      instruction: "Stage and commit a new change.",
      completedBy: "git add",
      alternates: ["git add .", "git add README.md"],
      hint: "Stage files with 'git add .' first, then commit.",
    },
    {
      id: "step-5",
      instruction: "Commit your dark mode changes.",
      completedBy: "git commit -m",
      hint: "Use git commit -m 'add dark mode toggle' to save.",
    },
  ],
  initialGraphState: {
    commits: {
      "aa11bb2": { message: "init project", parent: null },
      "cc33dd4": { message: "add auth", parent: "aa11bb2" },
      "ee55ff6": { message: "add dashboard", parent: "cc33dd4" },
      "0a1b2c3": { message: "add settings page", parent: "ee55ff6" },
    },
    branches: { main: "0a1b2c3" },
    HEAD: { type: "branch", ref: "main" },
  },
}

/* ═══════════════════════════════════════════
   Mission 6: Multi-branch workflow
   Graph:  main ●──●
   Goal: create two feature branches, commit on each, merge both
   ═══════════════════════════════════════════ */
export const multiBranchMission: Mission = {
  id: "multi-branch-workflow",
  title: "Juggling multiple branches",
  topicId: "advanced-branching",
  xp: 800,
  steps: [
    {
      id: "step-1",
      instruction: "Create and switch to `feature-header`.",
      completedBy: "git checkout -b feature-header",
      alternates: ["git switch -c feature-header"],
      hint: "Use 'git checkout -b feature-header' to create the branch.",
    },
    {
      id: "step-2",
      instruction: "Stage your header changes.",
      completedBy: "git add",
      alternates: ["git add .", "git add README.md"],
      hint: "Use 'git add .' to stage all files.",
    },
    {
      id: "step-3",
      instruction: "Commit the header work.",
      completedBy: "git commit -m",
      hint: "Use git commit -m 'build header component' to save.",
    },
    {
      id: "step-4",
      instruction: "Switch back to `main`.",
      completedBy: "git checkout main",
      alternates: ["git switch main"],
      hint: "Use 'git checkout main' to go back to the main branch.",
    },
    {
      id: "step-5",
      instruction: "Create and switch to `feature-sidebar`.",
      completedBy: "git checkout -b feature-sidebar",
      alternates: ["git switch -c feature-sidebar"],
      hint: "Use 'git checkout -b feature-sidebar' to create the second feature branch.",
    },
    {
      id: "step-6",
      instruction: "Stage your sidebar changes.",
      completedBy: "git add",
      alternates: ["git add .", "git add README.md"],
      hint: "Use 'git add .' to stage everything.",
    },
    {
      id: "step-7",
      instruction: "Commit the sidebar work.",
      completedBy: "git commit -m",
      hint: "Use git commit -m 'build sidebar component' to save.",
    },
    {
      id: "step-8",
      instruction: "Switch back to `main` to prepare for merging.",
      completedBy: "git checkout main",
      alternates: ["git switch main"],
      hint: "Go back to main with 'git checkout main'.",
    },
    {
      id: "step-9",
      instruction: "Merge `feature-header` into `main`.",
      completedBy: "git merge feature-header",
      hint: "Use 'git merge feature-header' to bring header changes into main.",
    },
    {
      id: "step-10",
      instruction: "Merge `feature-sidebar` into `main`.",
      completedBy: "git merge feature-sidebar",
      hint: "Use 'git merge feature-sidebar' to bring sidebar changes into main.",
    },
  ],
  initialGraphState: {
    commits: {
      "b1c2d3e": { message: "project init", parent: null },
      "f4a5b6c": { message: "base layout", parent: "b1c2d3e" },
    },
    branches: { main: "f4a5b6c" },
    HEAD: { type: "branch", ref: "main" },
  },
}

/* ═══════════════════════════════════════════
   All missions in order
   ═══════════════════════════════════════════ */
export const allMissions: Mission[] = [
  firstBranchMission,
  commitWorkflowMission,
  mergeFeatureMission,
  inspectHistoryMission,
  hotfixMission,
  multiBranchMission,
]
