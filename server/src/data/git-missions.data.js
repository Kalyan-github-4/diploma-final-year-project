/* ─────────────────────────────────────────────────────────────
   Static Git missions — hand-authored, 3 missions per level.
   Replaces AI mission generation for the Git & GitHub module.

   Each mission shape matches what the client's Mission type expects.
   Commands used here are restricted to what gitSimulator.ts supports:
   init, status, add, commit, branch, checkout, switch, log,
   merge, reset (--soft|--mixed|--hard HEAD~1), revert <hash>.

   Batches: Levels 1-6 (Beginner) done. 7-18 pending.
   ───────────────────────────────────────────────────────────── */

/* ── Shared graph fragments ─────────────────────────────────── */

const emptyGraph = {
  commits: {},
  branches: {},
  HEAD: { type: "branch", ref: "main" },
}

function mainWithCommits(list) {
  // list: [{ id, message }] oldest-first
  const commits = {}
  let parent = null
  for (const c of list) {
    commits[c.id] = { message: c.message, parent }
    parent = c.id
  }
  return {
    commits,
    branches: { main: parent },
    HEAD: { type: "branch", ref: "main" },
  }
}

/* ═══════════════════════════════════════════════════════════════
   LEVEL 1 — Repo Kickoff  (init · add · commit)
   ═══════════════════════════════════════════════════════════════ */

const level1 = [
  {
    missionId: "git-l1-m1-first-repo",
    title: "Start your first repository",
    topicId: "git-basics",
    level: 1,
    orderIndex: 0,
    difficulty: 1,
    xp: 180,
    steps: [
      {
        id: "step-1",
        instruction:
          "You just created a new project folder. Turn it into a Git repository with `git init`.",
        completedBy: "git init",
        alternates: [],
        hint: "Every Git project starts with `git init` — it creates the hidden `.git` directory.",
      },
      {
        id: "step-2",
        instruction:
          "Run `git status` to see what files Git noticed in your working directory.",
        completedBy: "git status",
        alternates: [],
        hint: "`git status` is your radar — use it constantly to see staged, modified, and untracked files.",
      },
      {
        id: "step-3",
        instruction: "Stage every file at once with `git add .`.",
        completedBy: "git add .",
        alternates: ["git add"],
        hint: "The `.` tells Git to stage everything in the current directory.",
      },
      {
        id: "step-4",
        instruction:
          "Create the very first commit. Try `git commit -m \"initial commit\"`.",
        completedBy: "git commit -m",
        alternates: [],
        hint: "`-m` lets you pass the message inline so Git doesn't open an editor.",
      },
    ],
    initialGraphState: emptyGraph,
  },

  {
    missionId: "git-l1-m2-save-readme",
    title: "Save your README",
    topicId: "git-basics",
    level: 1,
    orderIndex: 1,
    difficulty: 1,
    xp: 200,
    steps: [
      {
        id: "step-1",
        instruction:
          "You just wrote a new `README.md`. See what Git thinks with `git status`.",
        completedBy: "git status",
        alternates: [],
        hint: "A new file shows up under 'Untracked files' until you stage it.",
      },
      {
        id: "step-2",
        instruction: "Stage the README with `git add README.md` (or `git add .`).",
        completedBy: "git add",
        alternates: ["git add README.md", "git add ."],
        hint: "You can stage specific files by name or everything at once.",
      },
      {
        id: "step-3",
        instruction:
          "Commit with a clear message like `git commit -m \"add README\"`.",
        completedBy: "git commit -m",
        alternates: [],
        hint: "Good messages describe *what* the change does, not *how*.",
      },
      {
        id: "step-4",
        instruction: "Verify the commit landed with `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: ["git log"],
        hint: "`--oneline` gives you one compact line per commit — perfect for quick checks.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "a1b2c3d", message: "project scaffold" },
    ]),
  },

  {
    missionId: "git-l1-m3-capture-scaffold",
    title: "Capture the whole scaffold",
    topicId: "git-basics",
    level: 1,
    orderIndex: 2,
    difficulty: 2,
    xp: 220,
    steps: [
      {
        id: "step-1",
        instruction:
          "You've scaffolded several files. Check `git status` to see everything untracked.",
        completedBy: "git status",
        alternates: [],
        hint: "Always check status before a large stage to know what you're about to commit.",
      },
      {
        id: "step-2",
        instruction: "Stage every file with `git add .`.",
        completedBy: "git add .",
        alternates: ["git add"],
        hint: "Use `.` when you're confident everything in the tree belongs in this commit.",
      },
      {
        id: "step-3",
        instruction: "Run `git status` again to confirm the files moved to staged.",
        completedBy: "git status",
        alternates: [],
        hint: "Staged files show up in green under 'Changes to be committed'.",
      },
      {
        id: "step-4",
        instruction:
          "Commit everything: `git commit -m \"scaffold project structure\"`.",
        completedBy: "git commit -m",
        alternates: [],
        hint: "One commit per logical unit of work — a scaffold counts as one.",
      },
      {
        id: "step-5",
        instruction: "Check history with `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: ["git log"],
        hint: "You should see both the initial commit and your scaffold commit.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "f0e1d2c", message: "initial commit" },
    ]),
  },
]

/* ═══════════════════════════════════════════════════════════════
   LEVEL 2 — Commit Hygiene  (status · log · atomic commits)
   ═══════════════════════════════════════════════════════════════ */

const level2 = [
  {
    missionId: "git-l2-m1-inspect-before-commit",
    title: "Inspect before you commit",
    topicId: "git-basics",
    level: 2,
    orderIndex: 0,
    difficulty: 1,
    xp: 220,
    steps: [
      {
        id: "step-1",
        instruction:
          "You've been editing files. Never commit blind — run `git status` first.",
        completedBy: "git status",
        alternates: [],
        hint: "Status is cheap. Run it before every `add` and every `commit`.",
      },
      {
        id: "step-2",
        instruction: "Stage your changes with `git add .`.",
        completedBy: "git add .",
        alternates: ["git add"],
        hint: "Stage after you've reviewed what's changed.",
      },
      {
        id: "step-3",
        instruction:
          "Commit with a message that explains *why*: `git commit -m \"fix header spacing\"`.",
        completedBy: "git commit -m",
        alternates: [],
        hint: "Think 'what would my future self want to know?' when writing messages.",
      },
      {
        id: "step-4",
        instruction: "Confirm the commit landed with `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: ["git log"],
        hint: "A quick log check is your sanity net after every commit.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "aa11bb2", message: "init project" },
      { id: "cc33dd4", message: "add base layout" },
    ]),
  },

  {
    missionId: "git-l2-m2-two-atomic-commits",
    title: "Two atomic commits",
    topicId: "git-basics",
    level: 2,
    orderIndex: 1,
    difficulty: 2,
    xp: 260,
    steps: [
      {
        id: "step-1",
        instruction:
          "You changed two unrelated things. Stage the first change: `git add .`.",
        completedBy: "git add .",
        alternates: ["git add"],
        hint: "In real life you'd stage specific files — here we simulate staging per-step.",
      },
      {
        id: "step-2",
        instruction:
          "Commit it alone: `git commit -m \"fix nav link color\"`.",
        completedBy: "git commit -m",
        alternates: [],
        hint: "Atomic = one logical change per commit. Easier to revert, easier to review.",
      },
      {
        id: "step-3",
        instruction: "Now stage the second change: `git add .`.",
        completedBy: "git add .",
        alternates: ["git add"],
        hint: "Keep unrelated changes in separate commits — even if they're small.",
      },
      {
        id: "step-4",
        instruction:
          "Commit the second change: `git commit -m \"update footer copyright year\"`.",
        completedBy: "git commit -m",
        alternates: [],
        hint: "Each commit should stand on its own and be reviewable in isolation.",
      },
      {
        id: "step-5",
        instruction: "See both new commits with `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: ["git log"],
        hint: "You should now see your two atomic commits stacked at the top.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "b1c2d3e", message: "initial commit" },
      { id: "e4f5a6b", message: "add homepage" },
    ]),
  },

  {
    missionId: "git-l2-m3-review-before-push",
    title: "Review history before you push",
    topicId: "git-basics",
    level: 2,
    orderIndex: 2,
    difficulty: 2,
    xp: 280,
    steps: [
      {
        id: "step-1",
        instruction:
          "Before pushing to the team, scan recent commits with `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: [],
        hint: "Compact log shows every commit on one line — fast to scan.",
      },
      {
        id: "step-2",
        instruction:
          "Pull up the full log with `git log` to read commit messages in detail.",
        completedBy: "git log",
        alternates: [],
        hint: "Full log shows author, date, and full message body.",
      },
      {
        id: "step-3",
        instruction:
          "Make sure your working tree is clean: `git status`.",
        completedBy: "git status",
        alternates: [],
        hint: "You don't want accidental uncommitted changes when you push.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "1a2b3c4", message: "initial commit" },
      { id: "5d6e7f8", message: "add homepage" },
      { id: "9a0b1c2", message: "add navbar" },
      { id: "d3e4f5a", message: "add footer" },
    ]),
  },
]

/* ═══════════════════════════════════════════════════════════════
   LEVEL 3 — Staging Mastery  (add · reset · re-stage)
   ═══════════════════════════════════════════════════════════════ */

const level3 = [
  {
    missionId: "git-l3-m1-stage-the-right-files",
    title: "Stage the right files",
    topicId: "git-basics",
    level: 3,
    orderIndex: 0,
    difficulty: 2,
    xp: 240,
    steps: [
      {
        id: "step-1",
        instruction:
          "Check what's modified: `git status`.",
        completedBy: "git status",
        alternates: [],
        hint: "Red = modified but not staged. Green = staged and ready to commit.",
      },
      {
        id: "step-2",
        instruction: "Stage everything with `git add .`.",
        completedBy: "git add .",
        alternates: ["git add"],
        hint: "`git add .` is the fastest way to stage all tracked and untracked changes.",
      },
      {
        id: "step-3",
        instruction:
          "Run `git status` again — the files should now be green (staged).",
        completedBy: "git status",
        alternates: [],
        hint: "Always verify after staging. 'Trust but verify' applies to Git too.",
      },
      {
        id: "step-4",
        instruction:
          "Commit the staged work: `git commit -m \"polish landing page\"`.",
        completedBy: "git commit -m",
        alternates: [],
        hint: "Commits freeze staged changes into history.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "c1d2e3f", message: "initial commit" },
      { id: "a4b5c6d", message: "draft landing page" },
    ]),
  },

  {
    missionId: "git-l3-m2-rollback-bad-commit",
    title: "Roll back a premature commit",
    topicId: "git-basics",
    level: 3,
    orderIndex: 1,
    difficulty: 3,
    xp: 280,
    steps: [
      {
        id: "step-1",
        instruction:
          "You committed too early. See the bad commit: `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: ["git log"],
        hint: "Identify the commit you need to undo before you undo it.",
      },
      {
        id: "step-2",
        instruction:
          "Undo the commit but keep the changes in your working tree: `git reset --mixed HEAD~1`.",
        completedBy: "git reset --mixed HEAD~1",
        alternates: ["git reset HEAD~1"],
        hint: "`--mixed` unstages *and* uncommits, but your file edits stay safe.",
      },
      {
        id: "step-3",
        instruction:
          "Check status — you should see the changes back as unstaged.",
        completedBy: "git status",
        alternates: [],
        hint: "Mixed reset moves the changes from 'committed' → 'unstaged'.",
      },
      {
        id: "step-4",
        instruction: "Re-stage properly with `git add .`.",
        completedBy: "git add .",
        alternates: ["git add"],
        hint: "Now you get a second chance to craft a clean commit.",
      },
      {
        id: "step-5",
        instruction:
          "Commit again with a proper message: `git commit -m \"add user profile page\"`.",
        completedBy: "git commit -m",
        alternates: [],
        hint: "Take your time on the message — this is the final version.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "111aaa2", message: "initial commit" },
      { id: "222bbb3", message: "add routes" },
      { id: "333ccc4", message: "wip profile (bad)" },
    ]),
  },

  {
    missionId: "git-l3-m3-hard-reset-clean-slate",
    title: "Hard reset to a clean slate",
    topicId: "git-basics",
    level: 3,
    orderIndex: 2,
    difficulty: 3,
    xp: 320,
    steps: [
      {
        id: "step-1",
        instruction:
          "You want to completely discard the latest commit. Check history first: `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: ["git log"],
        hint: "Hard reset is destructive — always look at history before running it.",
      },
      {
        id: "step-2",
        instruction:
          "Nuke the last commit *and* its changes: `git reset --hard HEAD~1`.",
        completedBy: "git reset --hard HEAD~1",
        alternates: [],
        hint: "`--hard` wipes the commit and resets your working tree. There's no coming back without reflog.",
      },
      {
        id: "step-3",
        instruction:
          "Confirm the working tree is clean: `git status`.",
        completedBy: "git status",
        alternates: [],
        hint: "Hard reset leaves you with nothing to commit — that's the point.",
      },
      {
        id: "step-4",
        instruction:
          "Verify the commit is gone from history: `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: ["git log"],
        hint: "The bad commit should no longer appear — only clean history remains.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "aaa111b", message: "initial commit" },
      { id: "bbb222c", message: "add auth" },
      { id: "ccc333d", message: "broken experiment" },
    ]),
  },
]

/* ═══════════════════════════════════════════════════════════════
   LEVEL 4 — Debug with Log  (log --oneline · history investigation)
   ═══════════════════════════════════════════════════════════════ */

const level4 = [
  {
    missionId: "git-l4-m1-compact-history-scan",
    title: "Compact history scan",
    topicId: "git-basics",
    level: 4,
    orderIndex: 0,
    difficulty: 2,
    xp: 280,
    steps: [
      {
        id: "step-1",
        instruction:
          "Start with the full log to see every commit in detail: `git log`.",
        completedBy: "git log",
        alternates: [],
        hint: "Full log shows commit hashes, authors, dates, and messages.",
      },
      {
        id: "step-2",
        instruction:
          "Now switch to compact mode: `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: [],
        hint: "Compare the two views — compact is faster for scanning many commits.",
      },
      {
        id: "step-3",
        instruction: "Check current working state: `git status`.",
        completedBy: "git status",
        alternates: [],
        hint: "Combining `log` + `status` gives you both history and present state.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "aaabbb1", message: "initial commit" },
      { id: "bbbccc2", message: "add routes" },
      { id: "cccddd3", message: "add header" },
      { id: "dddeee4", message: "add footer" },
      { id: "eeefff5", message: "fix nav bug" },
    ]),
  },

  {
    missionId: "git-l4-m2-trace-the-change",
    title: "Trace a suspicious change",
    topicId: "git-basics",
    level: 4,
    orderIndex: 1,
    difficulty: 2,
    xp: 300,
    steps: [
      {
        id: "step-1",
        instruction:
          "A feature broke. Scan commits with `git log --oneline` to spot suspects.",
        completedBy: "git log --oneline",
        alternates: [],
        hint: "Start from the top — the most recent commit is usually the culprit.",
      },
      {
        id: "step-2",
        instruction:
          "Read full commit messages with `git log` to see which touched the broken area.",
        completedBy: "git log",
        alternates: [],
        hint: "Good commit messages make this step 10x faster.",
      },
      {
        id: "step-3",
        instruction:
          "Check current state before making changes: `git status`.",
        completedBy: "git status",
        alternates: [],
        hint: "Make sure you don't have pending work that could confuse your investigation.",
      },
      {
        id: "step-4",
        instruction: "Stage your fix: `git add .`.",
        completedBy: "git add .",
        alternates: ["git add"],
        hint: "Once you've diagnosed the bug, stage the fix.",
      },
      {
        id: "step-5",
        instruction:
          "Commit the fix with a traceable message: `git commit -m \"fix broken cart count\"`.",
        completedBy: "git commit -m",
        alternates: [],
        hint: "Reference the bug in your message so future devs can find it via log.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "111abc2", message: "initial commit" },
      { id: "222def3", message: "add cart" },
      { id: "333ghi4", message: "refactor cart state" },
      { id: "444jkl5", message: "tweak cart styling" },
    ]),
  },

  {
    missionId: "git-l4-m3-document-the-release",
    title: "Document the release",
    topicId: "git-basics",
    level: 4,
    orderIndex: 2,
    difficulty: 3,
    xp: 340,
    steps: [
      {
        id: "step-1",
        instruction:
          "Review what's shipping: `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: [],
        hint: "A release starts with knowing exactly which commits are going out.",
      },
      {
        id: "step-2",
        instruction:
          "Read full details with `git log` to prepare release notes.",
        completedBy: "git log",
        alternates: [],
        hint: "Full log messages = ready-made release note material.",
      },
      {
        id: "step-3",
        instruction:
          "Check for pending changes: `git status`.",
        completedBy: "git status",
        alternates: [],
        hint: "You don't want stray edits leaking into a release commit.",
      },
      {
        id: "step-4",
        instruction:
          "Stage your release notes: `git add .`.",
        completedBy: "git add .",
        alternates: ["git add"],
        hint: "Release notes are just another file change — stage them normally.",
      },
      {
        id: "step-5",
        instruction:
          "Commit: `git commit -m \"docs: release v1.2.0 notes\"`.",
        completedBy: "git commit -m",
        alternates: [],
        hint: "Prefix with `docs:` to signal this is a documentation commit.",
      },
      {
        id: "step-6",
        instruction: "Final check: `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: [],
        hint: "Your release notes commit should sit at the top of history.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "rel1111", message: "initial commit" },
      { id: "rel2222", message: "add feature A" },
      { id: "rel3333", message: "add feature B" },
      { id: "rel4444", message: "fix edge case in A" },
    ]),
  },
]

/* ═══════════════════════════════════════════════════════════════
   LEVEL 5 — Safe Undo  (soft reset · revert · hard reset)
   ═══════════════════════════════════════════════════════════════ */

const level5 = [
  {
    missionId: "git-l5-m1-soft-reset-keep-work",
    title: "Soft reset: undo commit, keep the work",
    topicId: "git-basics",
    level: 5,
    orderIndex: 0,
    difficulty: 2,
    xp: 320,
    steps: [
      {
        id: "step-1",
        instruction:
          "You committed with a bad message. See it: `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: ["git log"],
        hint: "Bad messages are a common reason to undo — soft reset is the tool.",
      },
      {
        id: "step-2",
        instruction:
          "Soft reset — undo the commit but keep everything staged: `git reset --soft HEAD~1`.",
        completedBy: "git reset --soft HEAD~1",
        alternates: [],
        hint: "`--soft` is the safest reset: it only moves HEAD, your files stay staged.",
      },
      {
        id: "step-3",
        instruction:
          "Confirm the changes are still staged: `git status`.",
        completedBy: "git status",
        alternates: [],
        hint: "You should see everything in 'Changes to be committed'.",
      },
      {
        id: "step-4",
        instruction:
          "Re-commit with a proper message: `git commit -m \"add user avatar upload\"`.",
        completedBy: "git commit -m",
        alternates: [],
        hint: "Second chance — make this message one you'd be proud to ship.",
      },
      {
        id: "step-5",
        instruction: "Verify the new commit: `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: ["git log"],
        hint: "Old bad commit is gone, new clean commit is on top.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "soft111", message: "initial commit" },
      { id: "soft222", message: "add upload feature" },
      { id: "soft333", message: "wip wip dont merge" },
    ]),
  },

  {
    missionId: "git-l5-m2-revert-published-commit",
    title: "Revert a published commit",
    topicId: "git-basics",
    level: 5,
    orderIndex: 1,
    difficulty: 3,
    xp: 360,
    steps: [
      {
        id: "step-1",
        instruction:
          "A published commit is broken in production. Find its hash: `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: ["git log"],
        hint: "You can't reset published commits — use `revert` instead.",
      },
      {
        id: "step-2",
        instruction:
          "Revert the bad commit with `git revert bad3333` (the broken login commit).",
        completedBy: "git revert bad3333",
        alternates: [],
        hint: "`revert` creates a NEW commit that undoes the target — safe for shared branches.",
      },
      {
        id: "step-3",
        instruction:
          "Confirm the revert commit was added: `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: ["git log"],
        hint: "You should see a new 'Revert \"...\"' commit at the top.",
      },
      {
        id: "step-4",
        instruction:
          "Check clean working state: `git status`.",
        completedBy: "git status",
        alternates: [],
        hint: "Revert auto-commits, so your tree should be clean.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "abc1111", message: "initial commit" },
      { id: "def2222", message: "add home page" },
      { id: "bad3333", message: "broken login flow" },
      { id: "ghi4444", message: "add profile page" },
    ]),
  },

  {
    missionId: "git-l5-m3-hard-reset-local-experiment",
    title: "Hard reset a local experiment",
    topicId: "git-basics",
    level: 5,
    orderIndex: 2,
    difficulty: 3,
    xp: 380,
    steps: [
      {
        id: "step-1",
        instruction:
          "Your local experiment isn't working. See it: `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: ["git log"],
        hint: "Only hard-reset LOCAL commits — never anything you've pushed.",
      },
      {
        id: "step-2",
        instruction:
          "Blow it away: `git reset --hard HEAD~1`.",
        completedBy: "git reset --hard HEAD~1",
        alternates: [],
        hint: "`--hard` is destructive but fine for unpushed local experiments.",
      },
      {
        id: "step-3",
        instruction:
          "Verify the tree is clean: `git status`.",
        completedBy: "git status",
        alternates: [],
        hint: "No staged changes, no modified files — like the experiment never happened.",
      },
      {
        id: "step-4",
        instruction: "Confirm the commit is gone: `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: ["git log"],
        hint: "Clean slate — you're back to the last good commit.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "exp1111", message: "initial commit" },
      { id: "exp2222", message: "stable feature" },
      { id: "exp3333", message: "risky experiment" },
    ]),
  },
]

/* ═══════════════════════════════════════════════════════════════
   LEVEL 6 — Team-Ready Basics  (messages · clean history)
   ═══════════════════════════════════════════════════════════════ */

const level6 = [
  {
    missionId: "git-l6-m1-proper-commit-message",
    title: "Write a proper commit message",
    topicId: "git-basics",
    level: 6,
    orderIndex: 0,
    difficulty: 2,
    xp: 360,
    steps: [
      {
        id: "step-1",
        instruction:
          "See what you're about to commit: `git status`.",
        completedBy: "git status",
        alternates: [],
        hint: "Know exactly what's in the commit before you write the message.",
      },
      {
        id: "step-2",
        instruction: "Stage the changes: `git add .`.",
        completedBy: "git add .",
        alternates: ["git add"],
        hint: "Stage first — message second.",
      },
      {
        id: "step-3",
        instruction:
          "Write a conventional commit: `git commit -m \"feat: add password reset flow\"`.",
        completedBy: "git commit -m",
        alternates: [],
        hint: "Conventional prefixes (feat, fix, docs, refactor) make history scannable for teams.",
      },
      {
        id: "step-4",
        instruction: "Verify: `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: ["git log"],
        hint: "Your conventional commit should stand out cleanly in the log.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "team111", message: "initial commit" },
      { id: "team222", message: "feat: add login" },
      { id: "team333", message: "feat: add signup" },
    ]),
  },

  {
    missionId: "git-l6-m2-fix-last-commit-message",
    title: "Fix the last commit message",
    topicId: "git-basics",
    level: 6,
    orderIndex: 1,
    difficulty: 3,
    xp: 400,
    steps: [
      {
        id: "step-1",
        instruction:
          "You just committed with `\"asdf\"`. See it: `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: ["git log"],
        hint: "Everyone does this eventually. Soft reset is the cleanest fix.",
      },
      {
        id: "step-2",
        instruction:
          "Soft-reset the bad commit: `git reset --soft HEAD~1`.",
        completedBy: "git reset --soft HEAD~1",
        alternates: [],
        hint: "Soft reset keeps your files staged — you just redo the commit.",
      },
      {
        id: "step-3",
        instruction:
          "Check that the changes are still staged: `git status`.",
        completedBy: "git status",
        alternates: [],
        hint: "Everything should still be in 'Changes to be committed'.",
      },
      {
        id: "step-4",
        instruction:
          "Re-commit properly: `git commit -m \"fix: handle empty cart edge case\"`.",
        completedBy: "git commit -m",
        alternates: [],
        hint: "Now write the message you *should* have written the first time.",
      },
      {
        id: "step-5",
        instruction: "Confirm the history is clean: `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: ["git log"],
        hint: "`asdf` is gone forever — your team will thank you.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "fix1111", message: "initial commit" },
      { id: "fix2222", message: "add cart logic" },
      { id: "fix3333", message: "asdf" },
    ]),
  },

  {
    missionId: "git-l6-m3-ship-clean-series",
    title: "Ship a clean series of commits",
    topicId: "git-basics",
    level: 6,
    orderIndex: 2,
    difficulty: 4,
    xp: 440,
    steps: [
      {
        id: "step-1",
        instruction:
          "Check what's changed: `git status`.",
        completedBy: "git status",
        alternates: [],
        hint: "A clean series starts with knowing all the moving parts.",
      },
      {
        id: "step-2",
        instruction:
          "Stage the first logical change: `git add .`.",
        completedBy: "git add .",
        alternates: ["git add"],
        hint: "Pretend this is just the navbar fix.",
      },
      {
        id: "step-3",
        instruction:
          "Commit it: `git commit -m \"fix: navbar alignment on mobile\"`.",
        completedBy: "git commit -m",
        alternates: [],
        hint: "One concern per commit — that's what makes it reviewable.",
      },
      {
        id: "step-4",
        instruction:
          "Stage the second change: `git add .`.",
        completedBy: "git add .",
        alternates: ["git add"],
        hint: "Now the second concern.",
      },
      {
        id: "step-5",
        instruction:
          "Commit it: `git commit -m \"feat: add dark mode toggle\"`.",
        completedBy: "git commit -m",
        alternates: [],
        hint: "Feature and fix stay separate — easier to revert one without the other.",
      },
      {
        id: "step-6",
        instruction:
          "Review the final series: `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: ["git log"],
        hint: "Two clean commits, one per concern — ready to push.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "shp1111", message: "initial commit" },
      { id: "shp2222", message: "feat: build layout shell" },
    ]),
  },
]

/* ── Registry ───────────────────────────────────────────────── */

const gitMissionsByLevel = {
  1: level1,
  2: level2,
  3: level3,
  4: level4,
  5: level5,
  6: level6,
  // 7-18 pending — will be authored in the next batch.
}

function getStaticGitMissions(level) {
  return gitMissionsByLevel[level] || null
}

module.exports = {
  gitMissionsByLevel,
  getStaticGitMissions,
}
