import type { Mission } from "@/lib/mission.utils"

export function buildGitBasicsScenarioSet(level: number, topic: string): Mission[] {
  return [
    {
      id: `basics-hotfix-rollback-${level}`,
      title: "Incident: Ship a Hotfix Without Losing Work",
      topicId: topic,
      xp: 420,
      steps: [
        {
          id: "step-1",
          instruction: "Check your workspace with `git status`.",
          completedBy: "git status",
          hint: "Identify staged and unstaged changes before touching history.",
        },
        {
          id: "step-2",
          instruction: "Stage all required files with `git add .`.",
          completedBy: "git add .",
          alternates: ["git add"],
          hint: "Use a complete stage before committing incident fixes.",
        },
        {
          id: "step-3",
          instruction: "Create a hotfix commit using `git commit -m`.",
          completedBy: "git commit -m",
          hint: "Describe the production issue and fix in the message.",
        },
        {
          id: "step-4",
          instruction: "Verify short history with `git log --oneline`.",
          completedBy: "git log --oneline",
          alternates: ["git log"],
          hint: "The latest commit should be your hotfix.",
        },
      ],
      initialGraphState: {
        commits: {
          a11b22c: { message: "initial setup", parent: null },
          b22c33d: { message: "release prep", parent: "a11b22c" },
        },
        branches: {
          main: "b22c33d",
        },
        HEAD: { type: "branch", ref: "main" },
      },
    },
    {
      id: `basics-audit-trail-${level}`,
      title: "Audit Trail: Prepare Reviewable Commit History",
      topicId: topic,
      xp: 460,
      steps: [
        {
          id: "step-1",
          instruction: "Inspect changed files with `git status`.",
          completedBy: "git status",
          hint: "Confirm your current state before staging.",
        },
        {
          id: "step-2",
          instruction: "Stage all updates via `git add .`.",
          completedBy: "git add .",
          alternates: ["git add"],
          hint: "Staging should reflect the full review unit.",
        },
        {
          id: "step-3",
          instruction: "Commit with `git commit -m`.",
          completedBy: "git commit -m",
          hint: "Use a concise and traceable message.",
        },
        {
          id: "step-4",
          instruction: "Compare with previous commit using `git diff HEAD~1 HEAD`.",
          completedBy: "git diff HEAD~1 HEAD",
          alternates: ["git diff"],
          hint: "Validate only intended changes landed.",
        },
      ],
      initialGraphState: {
        commits: {
          a44b55c: { message: "initial commit", parent: null },
          b55c66d: { message: "baseline ui", parent: "a44b55c" },
        },
        branches: {
          main: "b55c66d",
        },
        HEAD: { type: "branch", ref: "main" },
      },
    },
  ]
}

export function buildBranchingScenarioSet(level: number, topic: string): Mission[] {
  return [
    {
      id: `branching-feature-pipeline-${level}`,
      title: "Sprint Flow: Build Feature Branch and Integrate",
      topicId: topic,
      xp: 700,
      steps: [
        {
          id: "step-1",
          instruction: "Create a feature branch using `git checkout -b feature/payment-retry`.",
          completedBy: "git checkout -b feature/payment-retry",
          alternates: ["git switch -c feature/payment-retry"],
          hint: "Isolate feature work from main.",
        },
        {
          id: "step-2",
          instruction: "Stage changes with `git add .`.",
          completedBy: "git add .",
          alternates: ["git add"],
          hint: "Prepare branch commit for merge.",
        },
        {
          id: "step-3",
          instruction: "Commit branch work via `git commit -m`.",
          completedBy: "git commit -m",
          hint: "Create a meaningful feature commit.",
        },
        {
          id: "step-4",
          instruction: "Switch back with `git checkout main`.",
          completedBy: "git checkout main",
          alternates: ["git switch main"],
          hint: "Integration happens on main.",
        },
        {
          id: "step-5",
          instruction: "Integrate branch using `git merge feature/payment-retry`.",
          completedBy: "git merge feature/payment-retry",
          hint: "Merge feature branch into main.",
        },
      ],
      initialGraphState: {
        commits: {
          c11d22e: { message: "init", parent: null },
          d22e33f: { message: "checkout baseline", parent: "c11d22e" },
        },
        branches: {
          main: "d22e33f",
        },
        HEAD: { type: "branch", ref: "main" },
      },
    },
    {
      id: `branching-release-hotfix-${level}`,
      title: "Release Pressure: Merge Hotfix Then Continue Feature",
      topicId: topic,
      xp: 760,
      steps: [
        {
          id: "step-1",
          instruction: "Switch to hotfix branch with `git checkout hotfix/login-500`.",
          completedBy: "git checkout hotfix/login-500",
          alternates: ["git switch hotfix/login-500"],
          hint: "Production bug must be fixed first.",
        },
        {
          id: "step-2",
          instruction: "Review branch history using `git log --oneline`.",
          completedBy: "git log --oneline",
          alternates: ["git log"],
          hint: "Confirm hotfix commit is present.",
        },
        {
          id: "step-3",
          instruction: "Switch to `main` using `git checkout main`.",
          completedBy: "git checkout main",
          alternates: ["git switch main"],
          hint: "Apply the hotfix on main.",
        },
        {
          id: "step-4",
          instruction: "Merge the hotfix with `git merge hotfix/login-500`.",
          completedBy: "git merge hotfix/login-500",
          hint: "Keep release branch production-safe.",
        },
      ],
      initialGraphState: {
        commits: {
          e11f22a: { message: "init", parent: null },
          f22a33b: { message: "release baseline", parent: "e11f22a" },
          a33b44c: { message: "fix login 500", parent: "f22a33b" },
        },
        branches: {
          main: "f22a33b",
          "hotfix/login-500": "a33b44c",
        },
        HEAD: { type: "branch", ref: "main" },
      },
    },
  ]
}

export function buildHistoryScenarioSet(level: number, topic: string): Mission[] {
  return [
    {
      id: `history-conflict-response-${level}`,
      title: "Conflict Room: Resolve Diverged History",
      topicId: topic,
      xp: 980,
      steps: [
        {
          id: "step-1",
          instruction: "Attempt merge using `git merge teammate/feature-login`.",
          completedBy: "git merge teammate/feature-login",
          hint: "This scenario intentionally creates a conflict.",
        },
        {
          id: "step-2",
          instruction: "Inspect conflict state with `git status`.",
          completedBy: "git status",
          hint: "Look for unmerged paths.",
        },
        {
          id: "step-3",
          instruction: "Abort unsafe merge using `git merge --abort`.",
          completedBy: "git merge --abort",
          hint: "Rollback to clean state first.",
        },
        {
          id: "step-4",
          instruction: "Inspect recovery history with `git reflog`.",
          completedBy: "git reflog",
          hint: "Reflog confirms your rollback path.",
        },
      ],
      initialGraphState: {
        commits: {
          a9b8c7d: { message: "initial", parent: null },
          b8c7d6e: { message: "header refactor", parent: "a9b8c7d" },
          c7d6e5f: { message: "teammate login header", parent: "b8c7d6e" },
        },
        branches: {
          main: "b8c7d6e",
          "teammate/feature-login": "c7d6e5f",
        },
        HEAD: { type: "branch", ref: "main" },
        conflictRules: [
          {
            sourceBranch: "teammate/feature-login",
            targetBranch: "main",
            files: ["src/components/Header.tsx"],
            message: "Automatic merge failed; fix conflicts and then commit the result.",
          },
        ],
      },
    },
    {
      id: `history-safe-rollback-${level}`,
      title: "Production Safety: Revert a Broken Release Commit",
      topicId: topic,
      xp: 1040,
      steps: [
        {
          id: "step-1",
          instruction: "Check history using `git log --oneline`.",
          completedBy: "git log --oneline",
          alternates: ["git log"],
          hint: "Identify the bad commit before rollback.",
        },
        {
          id: "step-2",
          instruction: "Safely undo shared commit with `git revert <commit>`.",
          completedBy: "git revert",
          hint: "Use revert on published history.",
        },
        {
          id: "step-3",
          instruction: "Verify updated timeline using `git log --oneline`.",
          completedBy: "git log --oneline",
          alternates: ["git log"],
          hint: "A new revert commit should appear at top.",
        },
      ],
      initialGraphState: {
        commits: {
          d9e8f7a: { message: "initial", parent: null },
          e8f7a6b: { message: "release candidate", parent: "d9e8f7a" },
          f7a6b5c: { message: "broken feature flag", parent: "e8f7a6b" },
        },
        branches: {
          main: "f7a6b5c",
        },
        HEAD: { type: "branch", ref: "main" },
      },
    },
  ]
}

export function buildRemoteSyncTeamMission(level: number, topic: string): Mission {
  return {
    id: `team-remote-sync-${level}`,
    title: "Team Sync: Remote Collaboration",
    topicId: topic,
    xp: 900,
    steps: [
      {
        id: "step-1",
        instruction: "Inspect remote configuration with `git remote -v`.",
        completedBy: "git remote -v",
        hint: "Check which remote repository your local repo is connected to.",
      },
      {
        id: "step-2",
        instruction: "Fetch teammate updates from origin using `git fetch origin`.",
        completedBy: "git fetch origin",
        hint: "Fetching updates remote-tracking branches without changing your working branch.",
      },
      {
        id: "step-3",
        instruction: "Switch to `main` before syncing.",
        completedBy: "git checkout main",
        alternates: ["git switch main"],
        hint: "Always sync your integration branch first.",
      },
      {
        id: "step-4",
        instruction: "Sync with teammate changes using `git pull origin main`.",
        completedBy: "git pull origin main",
        hint: "Pull brings remote updates to your local branch.",
      },
      {
        id: "step-5",
        instruction: "Create and switch to branch `feature-team-sync`.",
        completedBy: "git checkout -b feature-team-sync",
        alternates: ["git switch -c feature-team-sync"],
        hint: "Start your feature work on an isolated branch.",
      },
      {
        id: "step-6",
        instruction: "Stage your work with `git add .`.",
        completedBy: "git add .",
        alternates: ["git add"],
        hint: "Stage all intended files before committing.",
      },
      {
        id: "step-7",
        instruction: "Commit your change using `git commit -m`.",
        completedBy: "git commit -m",
        hint: "Use a descriptive commit message for reviewers.",
      },
      {
        id: "step-8",
        instruction: "Push and set upstream with `git push --set-upstream origin feature-team-sync`.",
        completedBy: "git push --set-upstream origin feature-team-sync",
        alternates: ["git push -u origin feature-team-sync", "git push origin feature-team-sync"],
        hint: "Set upstream so future pushes can use plain `git push`.",
      },
    ],
    initialGraphState: {
      commits: {
        a1b2c3d: { message: "initial commit", parent: null },
        b2c3d4e: { message: "setup app shell", parent: "a1b2c3d" },
        c3d4e5f: { message: "teammate hotfix on main", parent: "b2c3d4e" },
      },
      branches: {
        main: "b2c3d4e",
        "origin/main": "c3d4e5f",
      },
      HEAD: { type: "branch", ref: "main" },
      remotes: {
        origin: "https://github.com/codeking/awesome-app.git",
      },
    },
  }
}

export function buildPrWorkflowTeamMission(level: number, topic: string): Mission {
  return {
    id: `team-pr-workflow-${level}`,
    title: "Team PR: Review and Merge",
    topicId: topic,
    xp: 1000,
    steps: [
      {
        id: "step-1",
        instruction: "Open a pull request with `git pr create --title \"Auth flow\"`.",
        completedBy: "git pr create",
        hint: "PRs start team review and CI checks.",
      },
      {
        id: "step-2",
        instruction: "Check PR status using `git pr status`.",
        completedBy: "git pr status",
        hint: "Confirm checks and review requirements before merge.",
      },
      {
        id: "step-3",
        instruction: "Run and pass checks using `git pr checks`.",
        completedBy: "git pr checks",
        hint: "Branch protection usually requires passing checks.",
      },
      {
        id: "step-4",
        instruction: "Approve the PR with `git pr review approve`.",
        completedBy: "git pr review approve",
        hint: "At least one approval is required by policy.",
      },
      {
        id: "step-5",
        instruction: "Merge with squash strategy using `git pr merge --squash`.",
        completedBy: "git pr merge --squash",
        alternates: ["git pr merge"],
        hint: "Squash keeps main history concise.",
      },
    ],
    initialGraphState: {
      commits: {
        d1e2f3a: { message: "init", parent: null },
        e2f3a4b: { message: "core auth setup", parent: "d1e2f3a" },
        f3a4b5c: { message: "feature auth screens", parent: "e2f3a4b" },
      },
      branches: {
        main: "e2f3a4b",
        "feature-team-sync": "f3a4b5c",
        "origin/main": "e2f3a4b",
        "origin/feature-team-sync": "f3a4b5c",
      },
      HEAD: { type: "branch", ref: "feature-team-sync" },
      remotes: {
        origin: "https://github.com/codeking/awesome-app.git",
      },
      upstreams: {
        "feature-team-sync": "origin/feature-team-sync",
      },
      nextPullRequestId: 1,
    },
  }
}

export function buildConflictRecoveryMission(level: number, topic: string): Mission {
  return {
    id: `team-conflict-recovery-${level}`,
    title: "Conflict Drill: Recover Safely",
    topicId: topic,
    xp: 1050,
    steps: [
      {
        id: "step-1",
        instruction: "Try merging teammate branch with `git merge teammate/feature-login`.",
        completedBy: "git merge teammate/feature-login",
        hint: "This scenario intentionally causes a conflict.",
      },
      {
        id: "step-2",
        instruction: "Inspect the conflict using `git status`.",
        completedBy: "git status",
        hint: "Look for unmerged paths.",
      },
      {
        id: "step-3",
        instruction: "Abort unsafe merge using `git merge --abort`.",
        completedBy: "git merge --abort",
        hint: "Abort if you need a clean rollback point.",
      },
      {
        id: "step-4",
        instruction: "Safely roll back last commit with `git revert <commit>`.",
        completedBy: "git revert",
        hint: "Use revert on shared history, not hard reset.",
      },
      {
        id: "step-5",
        instruction: "Inspect history movement with `git reflog`.",
        completedBy: "git reflog",
        hint: "Reflog helps recover from mistakes.",
      },
    ],
    initialGraphState: {
      commits: {
        a9b8c7d: { message: "initial", parent: null },
        b8c7d6e: { message: "header refactor", parent: "a9b8c7d" },
        c7d6e5f: { message: "teammate login header", parent: "b8c7d6e" },
      },
      branches: {
        main: "b8c7d6e",
        "teammate/feature-login": "c7d6e5f",
        "origin/main": "b8c7d6e",
      },
      HEAD: { type: "branch", ref: "main" },
      remotes: {
        origin: "https://github.com/codeking/awesome-app.git",
      },
      conflictRules: [
        {
          sourceBranch: "teammate/feature-login",
          targetBranch: "main",
          files: ["src/components/Header.tsx"],
          message: "Automatic merge failed; fix conflicts and then commit the result.",
        },
      ],
    },
  }
}

export function buildAdvancedFeatureMission(level: number, topic: string): Mission {
  return {
    id: `team-advanced-features-${level}`,
    title: "Advanced Team Git Toolkit",
    topicId: topic,
    xp: 1150,
    steps: [
      {
        id: "step-1",
        instruction: "Temporarily shelve work using `git stash`.",
        completedBy: "git stash",
        hint: "Use stash when you must switch context quickly.",
      },
      {
        id: "step-2",
        instruction: "Restore shelved changes with `git stash pop`.",
        completedBy: "git stash pop",
        hint: "Pop reapplies latest stash entry.",
      },
      {
        id: "step-3",
        instruction: "Tag this state using `git tag v1.0.0`.",
        completedBy: "git tag v1.0.0",
        alternates: ["git tag"],
        hint: "Tags mark release points.",
      },
      {
        id: "step-4",
        instruction: "Cherry-pick teammate fix with `git cherry-pick <commit>`.",
        completedBy: "git cherry-pick",
        hint: "Cherry-pick copies one commit to your branch.",
      },
      {
        id: "step-5",
        instruction: "Verify lightweight history with `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: ["git log"],
        hint: "Compact history helps release reviews.",
      },
    ],
    initialGraphState: {
      commits: {
        f1e2d3c: { message: "init", parent: null },
        e2d3c4b: { message: "shipping setup", parent: "f1e2d3c" },
        d3c4b5a: { message: "teammate fix: validation", parent: "e2d3c4b" },
      },
      branches: {
        main: "e2d3c4b",
        "teammate/hotfix-validation": "d3c4b5a",
        "origin/main": "e2d3c4b",
      },
      HEAD: { type: "branch", ref: "main" },
      remotes: {
        origin: "https://github.com/codeking/awesome-app.git",
      },
    },
  }
}

export function buildTeamMissionSet(level: number, topic: string): Mission[] {
  return [
    buildRemoteSyncTeamMission(level, topic),
    buildPrWorkflowTeamMission(level, topic),
    buildConflictRecoveryMission(level, topic),
    buildAdvancedFeatureMission(level, topic),
  ]
}

export function buildScenarioMissionSet(level: number, topic: string): Mission[] {
  if (topic === "git-basics") {
    return buildGitBasicsScenarioSet(level, topic)
  }

  if (topic === "branching-workflows") {
    return buildBranchingScenarioSet(level, topic)
  }

  if (topic === "merge-and-history") {
    return buildHistoryScenarioSet(level, topic)
  }

  return buildTeamMissionSet(level, topic)
}
