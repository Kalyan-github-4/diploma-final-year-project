
/* ═══════════════════════════════════════════════════════════════
   LEVEL 7 — Feature Branch Start
   ═══════════════════════════════════════════════════════════════ */

const level7 = [
  {
    missionId: "git-l7-m1-branching-workflows-0",
    title: "Feature Branch Start - Step 1",
    topicId: "branching-workflows",
    level: 7,
    orderIndex: 0,
    difficulty: Math.floor(7/3) + 1,
    xp: 700,
    steps: [
      {
        id: "step-1",
        instruction: "Use `git branch` to proceed.",
        completedBy: "git branch",
        alternates: [],
        hint: "This step requires using git branch.",
      },
      {
        id: "step-2",
        instruction: "Use `git checkout` to proceed.",
        completedBy: "git checkout",
        alternates: [],
        hint: "This step requires using git checkout.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "cqlzu", message: "initial" }
    ]),
  },
  {
    missionId: "git-l7-m2-branching-workflows-1",
    title: "Feature Branch Start - Step 2",
    topicId: "branching-workflows",
    level: 7,
    orderIndex: 1,
    difficulty: Math.floor(7/3) + 1,
    xp: 720,
    steps: [
      {
        id: "step-1",
        instruction: "Use `git switch -c` to proceed.",
        completedBy: "git switch -c",
        alternates: [],
        hint: "This step requires using git switch -c.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "c648y", message: "initial" }
    ]),
  },
  {
    missionId: "git-l7-m3-branching-workflows-2",
    title: "Feature Branch Start - Step 3",
    topicId: "branching-workflows",
    level: 7,
    orderIndex: 2,
    difficulty: Math.floor(7/3) + 1,
    xp: 740,
    steps: [
      {
        id: "step-1",
        instruction: "Use `git branch -d` to proceed.",
        completedBy: "git branch -d",
        alternates: [],
        hint: "This step requires using git branch -d.",
      },
      {
        id: "step-2",
        instruction: "Use `git branch` to proceed.",
        completedBy: "git branch",
        alternates: [],
        hint: "This step requires using git branch.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "cww39", message: "initial" }
    ]),
  },
]

/* ═══════════════════════════════════════════════════════════════
   LEVEL 8 — Parallel Workstreams
   ═══════════════════════════════════════════════════════════════ */

const level8 = [
  {
    missionId: "git-l8-m1-branching-workflows-0",
    title: "Parallel Workstreams - Step 1",
    topicId: "branching-workflows",
    level: 8,
    orderIndex: 0,
    difficulty: Math.floor(8/3) + 1,
    xp: 800,
    steps: [
      {
        id: "step-1",
        instruction: "Use `git checkout` to proceed.",
        completedBy: "git checkout",
        alternates: [],
        hint: "This step requires using git checkout.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "c11i4", message: "initial" }
    ]),
  },
  {
    missionId: "git-l8-m2-branching-workflows-1",
    title: "Parallel Workstreams - Step 2",
    topicId: "branching-workflows",
    level: 8,
    orderIndex: 1,
    difficulty: Math.floor(8/3) + 1,
    xp: 820,
    steps: [
      {
        id: "step-1",
        instruction: "Use `git stash` to proceed.",
        completedBy: "git stash",
        alternates: [],
        hint: "This step requires using git stash.",
      },
      {
        id: "step-2",
        instruction: "Use `git checkout` to proceed.",
        completedBy: "git checkout",
        alternates: [],
        hint: "This step requires using git checkout.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "coi9h", message: "initial" }
    ]),
  },
  {
    missionId: "git-l8-m3-branching-workflows-2",
    title: "Parallel Workstreams - Step 3",
    topicId: "branching-workflows",
    level: 8,
    orderIndex: 2,
    difficulty: Math.floor(8/3) + 1,
    xp: 840,
    steps: [
      {
        id: "step-1",
        instruction: "Use `git stash pop` to proceed.",
        completedBy: "git stash pop",
        alternates: [],
        hint: "This step requires using git stash pop.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "ctd57", message: "initial" }
    ]),
  },
]

/* ═══════════════════════════════════════════════════════════════
   LEVEL 9 — Fast-Forward Merge
   ═══════════════════════════════════════════════════════════════ */

const level9 = [
  {
    missionId: "git-l9-m1-branching-workflows-0",
    title: "Fast-Forward Merge - Step 1",
    topicId: "branching-workflows",
    level: 9,
    orderIndex: 0,
    difficulty: Math.floor(9/3) + 1,
    xp: 900,
    steps: [
      {
        id: "step-1",
        instruction: "Use `git merge` to proceed.",
        completedBy: "git merge",
        alternates: [],
        hint: "This step requires using git merge.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "c8sqa", message: "initial" }
    ]),
  },
  {
    missionId: "git-l9-m2-branching-workflows-1",
    title: "Fast-Forward Merge - Step 2",
    topicId: "branching-workflows",
    level: 9,
    orderIndex: 1,
    difficulty: Math.floor(9/3) + 1,
    xp: 920,
    steps: [
      {
        id: "step-1",
        instruction: "Use `git merge --ff-only` to proceed.",
        completedBy: "git merge --ff-only",
        alternates: [],
        hint: "This step requires using git merge --ff-only.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "cvbis", message: "initial" }
    ]),
  },
  {
    missionId: "git-l9-m3-branching-workflows-2",
    title: "Fast-Forward Merge - Step 3",
    topicId: "branching-workflows",
    level: 9,
    orderIndex: 2,
    difficulty: Math.floor(9/3) + 1,
    xp: 940,
    steps: [
      {
        id: "step-1",
        instruction: "Use `git branch -d` to proceed.",
        completedBy: "git branch -d",
        alternates: [],
        hint: "This step requires using git branch -d.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "c75zo", message: "initial" }
    ]),
  },
]

/* ═══════════════════════════════════════════════════════════════
   LEVEL 10 — Release Branch Drill
   ═══════════════════════════════════════════════════════════════ */

const level10 = [
  {
    missionId: "git-l10-m1-branching-workflows-0",
    title: "Release Branch Drill - Step 1",
    topicId: "branching-workflows",
    level: 10,
    orderIndex: 0,
    difficulty: Math.floor(10/3) + 1,
    xp: 1000,
    steps: [
      {
        id: "step-1",
        instruction: "Use `git checkout -b` to proceed.",
        completedBy: "git checkout -b",
        alternates: [],
        hint: "This step requires using git checkout -b.",
      },
      {
        id: "step-2",
        instruction: "Use `git commit -m` to proceed.",
        completedBy: "git commit -m",
        alternates: [],
        hint: "This step requires using git commit -m.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "cklkl", message: "initial" }
    ]),
  },
  {
    missionId: "git-l10-m2-branching-workflows-1",
    title: "Release Branch Drill - Step 2",
    topicId: "branching-workflows",
    level: 10,
    orderIndex: 1,
    difficulty: Math.floor(10/3) + 1,
    xp: 1020,
    steps: [
      {
        id: "step-1",
        instruction: "Use `git merge` to proceed.",
        completedBy: "git merge",
        alternates: [],
        hint: "This step requires using git merge.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "cva1w", message: "initial" }
    ]),
  },
  {
    missionId: "git-l10-m3-branching-workflows-2",
    title: "Release Branch Drill - Step 3",
    topicId: "branching-workflows",
    level: 10,
    orderIndex: 2,
    difficulty: Math.floor(10/3) + 1,
    xp: 1040,
    steps: [
      {
        id: "step-1",
        instruction: "Use `git tag` to proceed.",
        completedBy: "git tag",
        alternates: [],
        hint: "This step requires using git tag.",
      },
      {
        id: "step-2",
        instruction: "Use `git push` to proceed.",
        completedBy: "git push",
        alternates: [],
        hint: "This step requires using git push.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "ceusj", message: "initial" }
    ]),
  },
]

/* ═══════════════════════════════════════════════════════════════
   LEVEL 11 — Branch Policy
   ═══════════════════════════════════════════════════════════════ */

const level11 = [
  {
    missionId: "git-l11-m1-branching-workflows-0",
    title: "Branch Policy - Step 1",
    topicId: "branching-workflows",
    level: 11,
    orderIndex: 0,
    difficulty: Math.floor(11/3) + 1,
    xp: 1100,
    steps: [
      {
        id: "step-1",
        instruction: "Use `git log --oneline --graph` to proceed.",
        completedBy: "git log --oneline --graph",
        alternates: [],
        hint: "This step requires using git log --oneline --graph.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "ca0v3", message: "initial" }
    ]),
  },
  {
    missionId: "git-l11-m2-branching-workflows-1",
    title: "Branch Policy - Step 2",
    topicId: "branching-workflows",
    level: 11,
    orderIndex: 1,
    difficulty: Math.floor(11/3) + 1,
    xp: 1120,
    steps: [
      {
        id: "step-1",
        instruction: "Use `git diff main...HEAD` to proceed.",
        completedBy: "git diff main...HEAD",
        alternates: [],
        hint: "This step requires using git diff main...HEAD.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "c86xh", message: "initial" }
    ]),
  },
  {
    missionId: "git-l11-m3-branching-workflows-2",
    title: "Branch Policy - Step 3",
    topicId: "branching-workflows",
    level: 11,
    orderIndex: 2,
    difficulty: Math.floor(11/3) + 1,
    xp: 1140,
    steps: [
      {
        id: "step-1",
        instruction: "Use `git rebase main` to proceed.",
        completedBy: "git rebase main",
        alternates: [],
        hint: "This step requires using git rebase main.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "chitl", message: "initial" }
    ]),
  },
]

/* ═══════════════════════════════════════════════════════════════
   LEVEL 12 — Integration Readiness
   ═══════════════════════════════════════════════════════════════ */

const level12 = [
  {
    missionId: "git-l12-m1-branching-workflows-0",
    title: "Integration Readiness - Step 1",
    topicId: "branching-workflows",
    level: 12,
    orderIndex: 0,
    difficulty: Math.floor(12/3) + 1,
    xp: 1200,
    steps: [
      {
        id: "step-1",
        instruction: "Use `git fetch` to proceed.",
        completedBy: "git fetch",
        alternates: [],
        hint: "This step requires using git fetch.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "czbch", message: "initial" }
    ]),
  },
  {
    missionId: "git-l12-m2-branching-workflows-1",
    title: "Integration Readiness - Step 2",
    topicId: "branching-workflows",
    level: 12,
    orderIndex: 1,
    difficulty: Math.floor(12/3) + 1,
    xp: 1220,
    steps: [
      {
        id: "step-1",
        instruction: "Use `git rebase origin/main` to proceed.",
        completedBy: "git rebase origin/main",
        alternates: [],
        hint: "This step requires using git rebase origin/main.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "cf2wx", message: "initial" }
    ]),
  },
  {
    missionId: "git-l12-m3-branching-workflows-2",
    title: "Integration Readiness - Step 3",
    topicId: "branching-workflows",
    level: 12,
    orderIndex: 2,
    difficulty: Math.floor(12/3) + 1,
    xp: 1240,
    steps: [
      {
        id: "step-1",
        instruction: "Use `git push -f` to proceed.",
        completedBy: "git push -f",
        alternates: [],
        hint: "This step requires using git push -f.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "cot1t", message: "initial" }
    ]),
  },
]

/* ═══════════════════════════════════════════════════════════════
   LEVEL 13 — Rebase Control
   ═══════════════════════════════════════════════════════════════ */

const level13 = [
  {
    missionId: "git-l13-m1-merge-and-history-0",
    title: "Rebase Control - Step 1",
    topicId: "merge-and-history",
    level: 13,
    orderIndex: 0,
    difficulty: Math.floor(13/3) + 1,
    xp: 1300,
    steps: [
      {
        id: "step-1",
        instruction: "Use `git rebase` to proceed.",
        completedBy: "git rebase",
        alternates: [],
        hint: "This step requires using git rebase.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "cwnxo", message: "initial" }
    ]),
  },
  {
    missionId: "git-l13-m2-merge-and-history-1",
    title: "Rebase Control - Step 2",
    topicId: "merge-and-history",
    level: 13,
    orderIndex: 1,
    difficulty: Math.floor(13/3) + 1,
    xp: 1320,
    steps: [
      {
        id: "step-1",
        instruction: "Use `git rebase -i` to proceed.",
        completedBy: "git rebase -i",
        alternates: [],
        hint: "This step requires using git rebase -i.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "cu4pa", message: "initial" }
    ]),
  },
  {
    missionId: "git-l13-m3-merge-and-history-2",
    title: "Rebase Control - Step 3",
    topicId: "merge-and-history",
    level: 13,
    orderIndex: 2,
    difficulty: Math.floor(13/3) + 1,
    xp: 1340,
    steps: [
      {
        id: "step-1",
        instruction: "Use `git rebase --continue` to proceed.",
        completedBy: "git rebase --continue",
        alternates: [],
        hint: "This step requires using git rebase --continue.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "cse37", message: "initial" }
    ]),
  },
]

/* ═══════════════════════════════════════════════════════════════
   LEVEL 14 — Conflict Surgery
   ═══════════════════════════════════════════════════════════════ */

const level14 = [
  {
    missionId: "git-l14-m1-merge-and-history-0",
    title: "Conflict Surgery - Step 1",
    topicId: "merge-and-history",
    level: 14,
    orderIndex: 0,
    difficulty: Math.floor(14/3) + 1,
    xp: 1400,
    steps: [
      {
        id: "step-1",
        instruction: "Use `git merge` to proceed.",
        completedBy: "git merge",
        alternates: [],
        hint: "This step requires using git merge.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "cibit", message: "initial" }
    ]),
  },
  {
    missionId: "git-l14-m2-merge-and-history-1",
    title: "Conflict Surgery - Step 2",
    topicId: "merge-and-history",
    level: 14,
    orderIndex: 1,
    difficulty: Math.floor(14/3) + 1,
    xp: 1420,
    steps: [
      {
        id: "step-1",
        instruction: "Use `git status` to proceed.",
        completedBy: "git status",
        alternates: [],
        hint: "This step requires using git status.",
      },
      {
        id: "step-2",
        instruction: "Use `git add .` to proceed.",
        completedBy: "git add .",
        alternates: [],
        hint: "This step requires using git add ..",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "c3vkq", message: "initial" }
    ]),
  },
  {
    missionId: "git-l14-m3-merge-and-history-2",
    title: "Conflict Surgery - Step 3",
    topicId: "merge-and-history",
    level: 14,
    orderIndex: 2,
    difficulty: Math.floor(14/3) + 1,
    xp: 1440,
    steps: [
      {
        id: "step-1",
        instruction: "Use `git commit -m` to proceed.",
        completedBy: "git commit -m",
        alternates: [],
        hint: "This step requires using git commit -m.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "c83cy", message: "initial" }
    ]),
  },
]

/* ═══════════════════════════════════════════════════════════════
   LEVEL 15 — Recovery Toolkit
   ═══════════════════════════════════════════════════════════════ */

const level15 = [
  {
    missionId: "git-l15-m1-merge-and-history-0",
    title: "Recovery Toolkit - Step 1",
    topicId: "merge-and-history",
    level: 15,
    orderIndex: 0,
    difficulty: Math.floor(15/3) + 1,
    xp: 1500,
    steps: [
      {
        id: "step-1",
        instruction: "Use `git revert` to proceed.",
        completedBy: "git revert",
        alternates: [],
        hint: "This step requires using git revert.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "cqsfr", message: "initial" }
    ]),
  },
  {
    missionId: "git-l15-m2-merge-and-history-1",
    title: "Recovery Toolkit - Step 2",
    topicId: "merge-and-history",
    level: 15,
    orderIndex: 1,
    difficulty: Math.floor(15/3) + 1,
    xp: 1520,
    steps: [
      {
        id: "step-1",
        instruction: "Use `git reflog` to proceed.",
        completedBy: "git reflog",
        alternates: [],
        hint: "This step requires using git reflog.",
      },
      {
        id: "step-2",
        instruction: "Use `git reset --hard` to proceed.",
        completedBy: "git reset --hard",
        alternates: [],
        hint: "This step requires using git reset --hard.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "c9lxp", message: "initial" }
    ]),
  },
  {
    missionId: "git-l15-m3-merge-and-history-2",
    title: "Recovery Toolkit - Step 3",
    topicId: "merge-and-history",
    level: 15,
    orderIndex: 2,
    difficulty: Math.floor(15/3) + 1,
    xp: 1540,
    steps: [
      {
        id: "step-1",
        instruction: "Use `git cherry-pick` to proceed.",
        completedBy: "git cherry-pick",
        alternates: [],
        hint: "This step requires using git cherry-pick.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "chuon", message: "initial" }
    ]),
  },
]

/* ═══════════════════════════════════════════════════════════════
   LEVEL 16 — Remote Sync Master
   ═══════════════════════════════════════════════════════════════ */

const level16 = [
  {
    missionId: "git-l16-m1-advanced-collaboration-0",
    title: "Remote Sync Master - Add remote and fetch",
    topicId: "advanced-collaboration",
    level: 16,
    orderIndex: 0,
    difficulty: Math.floor(16/3) + 1,
    xp: 1600,
    steps: [
      {
        id: "step-1",
        instruction: "Connect your repository to GitHub with `git remote add origin https://github.com/acme/team-app.git`.",
        completedBy: "git remote add origin",
        alternates: [],
        hint: "Use `origin` as the default remote name so your team commands stay standard.",
      },
      {
        id: "step-2",
        instruction: "Verify and sync remote refs with `git fetch origin`.",
        completedBy: "git fetch origin",
        alternates: ["git fetch"],
        hint: "Fetch updates remote-tracking refs without changing your local files.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "ca5us", message: "initial" }
    ]),
  },
  {
    missionId: "git-l16-m2-advanced-collaboration-1",
    title: "Remote Sync Master - Pull and rebase",
    topicId: "advanced-collaboration",
    level: 16,
    orderIndex: 1,
    difficulty: Math.floor(16/3) + 1,
    xp: 1620,
    steps: [
      {
        id: "step-1",
        instruction: "Bring in latest main from remote using `git pull origin main`.",
        completedBy: "git pull origin main",
        alternates: ["git pull"],
        hint: "Pull keeps your local branch in sync with the team's integration branch.",
      },
      {
        id: "step-2",
        instruction: "Rebase your branch on top of the latest remote main: `git rebase origin/main`.",
        completedBy: "git rebase origin/main",
        alternates: [],
        hint: "Rebase before push to keep history linear and reduce merge-noise in PRs.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "cgnee", message: "initial" }
    ]),
  },
  {
    missionId: "git-l16-m3-advanced-collaboration-2",
    title: "Remote Sync Master - Publish tracking branch",
    topicId: "advanced-collaboration",
    level: 16,
    orderIndex: 2,
    difficulty: Math.floor(16/3) + 1,
    xp: 1640,
    steps: [
      {
        id: "step-1",
        instruction: "Publish your feature branch and set upstream tracking with `git push -u origin feature/auth-hardening`.",
        completedBy: "git push -u origin",
        alternates: [],
        hint: "Use `-u` once so future pushes can be just `git push`.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "cg7zx", message: "initial" }
    ]),
  },
]

/* ═══════════════════════════════════════════════════════════════
   LEVEL 17 — PR Command Center
   ═══════════════════════════════════════════════════════════════ */

const level17 = [
  {
    missionId: "git-l17-m1-advanced-collaboration-0",
    title: "PR Command Center - Prepare review branch",
    topicId: "advanced-collaboration",
    level: 17,
    orderIndex: 0,
    difficulty: Math.floor(17/3) + 1,
    xp: 1700,
    steps: [
      {
        id: "step-1",
        instruction: "Create a focused review branch with `git checkout -b feature/pr-cleanup`.",
        completedBy: "git checkout -b feature/pr-cleanup",
        alternates: [],
        hint: "Small, focused PR branches get faster and higher-quality reviews.",
      },
      {
        id: "step-2",
        instruction: "Commit your review-ready changes: `git commit -m \"refactor: simplify auth guard\"`.",
        completedBy: "git commit -m",
        alternates: [],
        hint: "Keep PR commit messages clear so reviewers understand intent quickly.",
      },
      {
        id: "step-3",
        instruction: "Publish the branch for PR creation with `git push -u origin feature/pr-cleanup`.",
        completedBy: "git push -u origin",
        alternates: [],
        hint: "Once pushed, open the PR in GitHub and request reviewers.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "c5ccn", message: "initial" }
    ]),
  },
  {
    missionId: "git-l17-m2-advanced-collaboration-1",
    title: "PR Command Center - Keep PR up to date",
    topicId: "advanced-collaboration",
    level: 17,
    orderIndex: 1,
    difficulty: Math.floor(17/3) + 1,
    xp: 1720,
    steps: [
      {
        id: "step-1",
        instruction: "Sync latest remote changes with `git fetch origin`.",
        completedBy: "git fetch origin",
        alternates: ["git fetch"],
        hint: "Fetch first so you rebase on the most recent team state.",
      },
      {
        id: "step-2",
        instruction: "Rebase your PR branch on main using `git rebase origin/main`.",
        completedBy: "git rebase origin/main",
        alternates: [],
        hint: "Rebasing before final review minimizes merge conflicts.",
      },
      {
        id: "step-3",
        instruction: "Confirm the branch history is clean with `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: ["git log"],
        hint: "Review the final commit stack before asking for approval.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "cxs5h", message: "initial" }
    ]),
  },
  {
    missionId: "git-l17-m3-advanced-collaboration-2",
    title: "PR Command Center - Squash merge flow",
    topicId: "advanced-collaboration",
    level: 17,
    orderIndex: 2,
    difficulty: Math.floor(17/3) + 1,
    xp: 1740,
    steps: [
      {
        id: "step-1",
        instruction: "Switch to main before final integration: `git checkout main`.",
        completedBy: "git checkout main",
        alternates: ["git switch main"],
        hint: "Always merge into the target branch, not from it.",
      },
      {
        id: "step-2",
        instruction: "Apply the PR as a single commit with `git merge --squash feature/pr-cleanup`.",
        completedBy: "git merge --squash",
        alternates: [],
        hint: "Squash merges keep main history readable and production-friendly.",
      },
      {
        id: "step-3",
        instruction: "Create the final integration commit: `git commit -m \"feat: ship auth guard cleanup\"`.",
        completedBy: "git commit -m",
        alternates: [],
        hint: "Treat the squash commit message like a release note headline.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "ccple", message: "initial" }
    ]),
  },
]

/* ═══════════════════════════════════════════════════════════════
   LEVEL 18 — Git & GitHub King
   ═══════════════════════════════════════════════════════════════ */

const level18 = [
  {
    missionId: "git-l18-m1-advanced-collaboration-0",
    title: "Git & GitHub King - Incident root-cause triage",
    topicId: "advanced-collaboration",
    level: 18,
    orderIndex: 0,
    difficulty: Math.floor(18/3) + 1,
    xp: 1800,
    steps: [
      {
        id: "step-1",
        instruction: "Start binary search for the regression commit with `git bisect start`.",
        completedBy: "git bisect start",
        alternates: [],
        hint: "Bisect narrows bad commits quickly when production is failing.",
      },
      {
        id: "step-2",
        instruction: "Mark the currently checked commit as bad with `git bisect bad`.",
        completedBy: "git bisect bad",
        alternates: [],
        hint: "Tell Git which side of history is broken to narrow the search.",
      },
      {
        id: "step-3",
        instruction: "Mark a known healthy point with `git bisect good`.",
        completedBy: "git bisect good",
        alternates: [],
        hint: "With good and bad anchors, bisect converges to the culprit.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "cezsw", message: "initial" }
    ]),
  },
  {
    missionId: "git-l18-m2-advanced-collaboration-1",
    title: "Git & GitHub King - Ownership and context",
    topicId: "advanced-collaboration",
    level: 18,
    orderIndex: 1,
    difficulty: Math.floor(18/3) + 1,
    xp: 1820,
    steps: [
      {
        id: "step-1",
        instruction: "Find line ownership and context with `git blame README.md`.",
        completedBy: "git blame README.md",
        alternates: [],
        hint: "Blame is useful for incident handoffs and fast root-cause context.",
      },
      {
        id: "step-2",
        instruction: "Summarize timeline impact using `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: ["git log"],
        hint: "Timeline summaries help teams coordinate rollback vs. forward-fix decisions.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "cq0rr", message: "initial" }
    ]),
  },
  {
    missionId: "git-l18-m3-advanced-collaboration-2",
    title: "Git & GitHub King - Recovery and safe ship",
    topicId: "advanced-collaboration",
    level: 18,
    orderIndex: 2,
    difficulty: Math.floor(18/3) + 1,
    xp: 1840,
    steps: [
      {
        id: "step-1",
        instruction: "Inspect recent HEAD moves before recovery with `git reflog`.",
        completedBy: "git reflog",
        alternates: [],
        hint: "Reflog is your safety net when history editing under pressure.",
      },
      {
        id: "step-2",
        instruction: "Roll back the last mistaken commit while keeping changes with `git reset --soft HEAD~1`.",
        completedBy: "git reset --soft HEAD~1",
        alternates: ["git reset --soft"],
        hint: "Soft reset preserves work so you can recommit a clean hotfix.",
      },
      {
        id: "step-3",
        instruction: "Ship the corrected hotfix commit: `git commit -m \"fix: recover production auth flow\"`.",
        completedBy: "git commit -m",
        alternates: [],
        hint: "A clear hotfix message improves post-incident auditability.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "cuk84", message: "initial" }
    ]),
  },
]

Object.assign(gitMissionsByLevel, {
  7: level7,
  8: level8,
  9: level9,
  10: level10,
  11: level11,
  12: level12,
  13: level13,
  14: level14,
  15: level15,
  16: level16,
  17: level17,
  18: level18,
});
