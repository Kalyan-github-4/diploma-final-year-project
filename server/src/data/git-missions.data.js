 /* ─────────────────────────────────────────────────────────────
   Static Git missions — hand-authored, 3 missions per level.
   Replaces AI mission generation for the Git & GitHub module.

   Each mission shape matches what the client's Mission type expects.
   Commands used here are restricted to what gitSimulator.ts supports:
   init, status, add, commit, branch, checkout, switch, log,
   merge, reset (--soft|--mixed|--hard HEAD~1), revert <hash>.

  Covers Levels 1-18 with progressive individual and team workflows.
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

/**
 * Build a graph with a main trunk and one or more feature branches.
 *
 * @param {Array<{id, message}>} mainList  — trunk commits, oldest-first
 * @param {Array<{name, from?, commits: Array<{id, message}>}>} branches
 *   Each branch starts from the last trunk commit unless `from` overrides
 *   it with a specific trunk commit id.
 * @param {string} [head="main"]  — which branch HEAD is on
 */
function branchGraph(mainList, branches = [], head = "main") {
  const commits = {}
  let lastMainId = null
  for (const c of mainList) {
    commits[c.id] = { message: c.message, parent: lastMainId }
    lastMainId = c.id
  }

  const branchTips = { main: lastMainId }
  for (const branch of branches) {
    const fromId = branch.from || lastMainId
    let lastId = fromId
    for (const c of branch.commits) {
      commits[c.id] = { message: c.message, parent: lastId }
      lastId = c.id
    }
    branchTips[branch.name] = lastId
  }

  return {
    commits,
    branches: branchTips,
    HEAD: { type: "branch", ref: head },
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


/* ═══════════════════════════════════════════════════════════════
   LEVEL 7 — Feature Branch Start  (branch · switch · checkout)
   ═══════════════════════════════════════════════════════════════ */

const level7 = [
  {
    missionId: "git-l7-m1-first-feature-branch",
    title: "Create your first feature branch",
    topicId: "branching-workflows",
    level: 7,
    orderIndex: 0,
    difficulty: 2,
    xp: 430,
    steps: [
      {
        id: "step-1",
        instruction: "See which branches exist and which you're on: `git branch`.",
        completedBy: "git branch",
        alternates: [],
        hint: "The * marks your current branch. Right now you're on main — never build features here.",
      },
      {
        id: "step-2",
        instruction: "Create a branch AND switch to it in one command: `git switch -c feature/login-page`.",
        completedBy: "git switch -c feature/login-page",
        alternates: ["git checkout -b feature/login-page"],
        hint: "`switch -c` is the modern shorthand. `checkout -b` does the same — you'll see both in real codebases.",
      },
      {
        id: "step-3",
        instruction: "Confirm you're now on the new branch: `git branch`.",
        completedBy: "git branch",
        alternates: [],
        hint: "The * should now be on feature/login-page — main is untouched.",
      },
      {
        id: "step-4",
        instruction: "Commit your first piece of feature work: `git commit -m \"feat: add login page skeleton\"`.",
        completedBy: "git commit -m",
        alternates: [],
        hint: "This commit lands on feature/login-page only. main has no idea it exists yet.",
      },
      {
        id: "step-5",
        instruction: "Check the log to confirm the commit is on this branch: `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: ["git log"],
        hint: "Your new commit sits on top of main's history — but only on this branch.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "l7a1", message: "chore: init project" },
      { id: "l7a2", message: "feat: add homepage" },
    ]),
  },

  {
    missionId: "git-l7-m2-branch-then-switch",
    title: "The two-step way: branch, then switch",
    topicId: "branching-workflows",
    level: 7,
    orderIndex: 1,
    difficulty: 2,
    xp: 450,
    steps: [
      {
        id: "step-1",
        instruction: "First, make sure you're on main before branching: `git branch`.",
        completedBy: "git branch",
        alternates: [],
        hint: "Always branch from main (or the agreed base). Branching from a random feature branch causes confusion.",
      },
      {
        id: "step-2",
        instruction: "Create the branch without switching yet: `git branch feature/user-profile`.",
        completedBy: "git branch feature/user-profile",
        alternates: [],
        hint: "`git branch <name>` creates the branch but keeps you where you are. Compare with `switch -c`.",
      },
      {
        id: "step-3",
        instruction: "Now list branches — notice you're still on main: `git branch`.",
        completedBy: "git branch",
        alternates: [],
        hint: "feature/user-profile exists but * is still on main. That's the difference from `switch -c`.",
      },
      {
        id: "step-4",
        instruction: "Now jump over to it: `git switch feature/user-profile`.",
        completedBy: "git switch feature/user-profile",
        alternates: ["git checkout feature/user-profile"],
        hint: "`git switch <existing-branch>` moves HEAD to it. No -c flag needed — the branch already exists.",
      },
      {
        id: "step-5",
        instruction: "Commit your first work here: `git commit -m \"feat: scaffold user profile page\"`.",
        completedBy: "git commit -m",
        alternates: [],
        hint: "main stays clean. All your work is isolated here until you decide to merge.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "l7b1", message: "chore: init project" },
      { id: "l7b2", message: "feat: add navbar" },
      { id: "l7b3", message: "feat: add footer" },
    ]),
  },

  {
    missionId: "git-l7-m3-branch-and-verify",
    title: "Branch, commit, and verify isolation",
    topicId: "branching-workflows",
    level: 7,
    orderIndex: 2,
    difficulty: 3,
    xp: 480,
    steps: [
      {
        id: "step-1",
        instruction: "Create and switch to a branch for the dark mode feature: `git switch -c feature/dark-mode`.",
        completedBy: "git switch -c feature/dark-mode",
        alternates: ["git checkout -b feature/dark-mode"],
        hint: "Pick a name that describes what you're building — teammates read branch names.",
      },
      {
        id: "step-2",
        instruction: "Commit work on this branch: `git commit -m \"feat: add dark mode CSS variables\"`.",
        completedBy: "git commit -m",
        alternates: [],
        hint: "Each commit here only exists on feature/dark-mode — not on main.",
      },
      {
        id: "step-3",
        instruction: "Add another commit: `git commit -m \"feat: wire dark mode toggle to theme context\"`.",
        completedBy: "git commit -m",
        alternates: [],
        hint: "Multiple commits on a branch is normal. You'll squash or clean them up before merging.",
      },
      {
        id: "step-4",
        instruction: "Switch back to main to verify it's unchanged: `git switch main`.",
        completedBy: "git switch main",
        alternates: ["git checkout main"],
        hint: "main should only have the original two commits — your dark-mode work isn't here yet.",
      },
      {
        id: "step-5",
        instruction: "Check main's log — see that your feature commits are NOT here: `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: ["git log"],
        hint: "This is the whole point of branches — main stays stable while features develop in parallel.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "l7c1", message: "chore: init project" },
      { id: "l7c2", message: "feat: add base layout" },
    ]),
  },
]

/* ═══════════════════════════════════════════════════════════════
   LEVEL 8 — Parallel Workstreams  (multiple branches · context switch)
   ═══════════════════════════════════════════════════════════════ */

const level8 = [
  {
    missionId: "git-l8-m1-two-features-in-flight",
    title: "Two features in flight at the same time",
    topicId: "branching-workflows",
    level: 8,
    orderIndex: 0,
    difficulty: 3,
    xp: 480,
    steps: [
      {
        id: "step-1",
        instruction: "List all branches — see both features already exist: `git branch`.",
        completedBy: "git branch",
        alternates: [],
        hint: "Your team started both features. You need to switch between them as priorities shift.",
      },
      {
        id: "step-2",
        instruction: "Jump to the search feature to work on it: `git switch feature/search`.",
        completedBy: "git switch feature/search",
        alternates: ["git checkout feature/search"],
        hint: "You can switch between branches instantly. Each branch remembers its own state.",
      },
      {
        id: "step-3",
        instruction: "Commit progress on search: `git commit -m \"feat: add search results pagination\"`.",
        completedBy: "git commit -m",
        alternates: [],
        hint: "This commit only exists on feature/search — feature/notifications is untouched.",
      },
      {
        id: "step-4",
        instruction: "Now switch context to the notifications feature: `git switch feature/notifications`.",
        completedBy: "git switch feature/notifications",
        alternates: ["git checkout feature/notifications"],
        hint: "Instant context switch. Your search work stays safe on its branch.",
      },
      {
        id: "step-5",
        instruction: "Commit progress on notifications: `git commit -m \"feat: add notification bell icon\"`.",
        completedBy: "git commit -m",
        alternates: [],
        hint: "Two parallel workstreams, zero interference. This is how teams scale.",
      },
      {
        id: "step-6",
        instruction: "List all branches to see the full picture: `git branch`.",
        completedBy: "git branch",
        alternates: [],
        hint: "You can see main, feature/search, and feature/notifications all coexisting.",
      },
    ],
    initialGraphState: branchGraph(
      [
        { id: "l8a1", message: "chore: init project" },
        { id: "l8a2", message: "feat: add homepage" },
      ],
      [
        {
          name: "feature/search",
          commits: [{ id: "l8a3", message: "feat: add search input" }],
        },
        {
          name: "feature/notifications",
          commits: [{ id: "l8a4", message: "feat: add notifications model" }],
        },
      ],
      "main"
    ),
  },

  {
    missionId: "git-l8-m2-safe-context-switch",
    title: "Context-switch safely — always commit first",
    topicId: "branching-workflows",
    level: 8,
    orderIndex: 1,
    difficulty: 3,
    xp: 510,
    steps: [
      {
        id: "step-1",
        instruction: "You have in-progress work. Check current state: `git status`.",
        completedBy: "git status",
        alternates: [],
        hint: "Git will warn or refuse to switch branches if you have uncommitted changes that conflict.",
      },
      {
        id: "step-2",
        instruction: "Commit what you have so you can switch freely: `git add .`.",
        completedBy: "git add .",
        alternates: ["git add"],
        hint: "A quick WIP commit is fine — you can clean it up with rebase -i before the PR.",
      },
      {
        id: "step-3",
        instruction: "Commit with a WIP message: `git commit -m \"WIP: search autocomplete draft\"`.",
        completedBy: "git commit -m",
        alternates: [],
        hint: "WIP commits are normal. The important thing is having a clean state before switching.",
      },
      {
        id: "step-4",
        instruction: "Now safely switch to main to check something: `git switch main`.",
        completedBy: "git switch main",
        alternates: ["git checkout main"],
        hint: "With a clean working tree, switching is instant and safe — no work is lost.",
      },
      {
        id: "step-5",
        instruction: "Check what's on main: `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: ["git log"],
        hint: "Your WIP commit is not here — it only lives on feature/search.",
      },
      {
        id: "step-6",
        instruction: "Switch back to your feature branch: `git switch feature/search`.",
        completedBy: "git switch feature/search",
        alternates: ["git checkout feature/search"],
        hint: "Your WIP commit is exactly where you left it. Context fully restored.",
      },
    ],
    initialGraphState: branchGraph(
      [
        { id: "l8b1", message: "chore: init project" },
        { id: "l8b2", message: "feat: add product listing" },
      ],
      [
        {
          name: "feature/search",
          commits: [{ id: "l8b3", message: "feat: add search bar component" }],
        },
      ],
      "feature/search"
    ),
  },

  {
    missionId: "git-l8-m3-explore-team-branches",
    title: "Explore all branches in the repo",
    topicId: "branching-workflows",
    level: 8,
    orderIndex: 2,
    difficulty: 3,
    xp: 540,
    steps: [
      {
        id: "step-1",
        instruction: "List all local branches to see the team's work: `git branch`.",
        completedBy: "git branch",
        alternates: [],
        hint: "Every branch here is an isolated stream of work. The * is where you are.",
      },
      {
        id: "step-2",
        instruction: "See the full branch topology as a graph: `git log --oneline --graph`.",
        completedBy: "git log --oneline --graph",
        alternates: ["git log --graph"],
        hint: "--graph draws the branch and merge structure visually. Essential for understanding parallel work.",
      },
      {
        id: "step-3",
        instruction: "Jump to the checkout feature to inspect it: `git switch feature/checkout-flow`.",
        completedBy: "git switch feature/checkout-flow",
        alternates: ["git checkout feature/checkout-flow"],
        hint: "Reading a teammate's branch locally is how you review or understand their work.",
      },
      {
        id: "step-4",
        instruction: "Read its commit history: `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: ["git log"],
        hint: "You can see exactly what commits are on this branch, and what base commit it started from.",
      },
      {
        id: "step-5",
        instruction: "Go back to main: `git switch main`.",
        completedBy: "git switch main",
        alternates: ["git checkout main"],
        hint: "Always return to main when you're done exploring. Never commit to a teammate's branch without agreement.",
      },
    ],
    initialGraphState: branchGraph(
      [
        { id: "l8c1", message: "chore: init project" },
        { id: "l8c2", message: "feat: add cart model" },
        { id: "l8c3", message: "feat: add product detail page" },
      ],
      [
        {
          name: "feature/checkout-flow",
          commits: [
            { id: "l8c4", message: "feat: add checkout step 1 — address" },
            { id: "l8c5", message: "feat: add checkout step 2 — payment" },
          ],
        },
        {
          name: "bugfix/cart-quantity",
          commits: [{ id: "l8c6", message: "fix: prevent negative cart quantity" }],
        },
      ],
      "main"
    ),
  },
]

/* ═══════════════════════════════════════════════════════════════
   LEVEL 9 — Fast-Forward Merge  (merge · branch cleanup · graph)
   ═══════════════════════════════════════════════════════════════ */

const level9 = [
  {
    missionId: "git-l9-m1-merge-completed-feature",
    title: "Merge a completed feature into main",
    topicId: "branching-workflows",
    level: 9,
    orderIndex: 0,
    difficulty: 3,
    xp: 540,
    steps: [
      {
        id: "step-1",
        instruction: "You're on main — verify before merging: `git branch`.",
        completedBy: "git branch",
        alternates: [],
        hint: "Always confirm you're on the target branch (main) before running git merge.",
      },
      {
        id: "step-2",
        instruction: "Merge the approved feature branch: `git merge feature/login-page`.",
        completedBy: "git merge feature/login-page",
        alternates: ["git merge"],
        hint: "Since main hasn't moved since branching, Git can fast-forward — no merge commit needed.",
      },
      {
        id: "step-3",
        instruction: "See the result — linear history, no merge commit: `git log --oneline --graph`.",
        completedBy: "git log --oneline --graph",
        alternates: ["git log --oneline", "git log --graph"],
        hint: "Fast-forward means the branch commits are simply replayed on top of main. History stays linear.",
      },
      {
        id: "step-4",
        instruction: "The branch is merged and no longer needed — delete it: `git branch -d feature/login-page`.",
        completedBy: "git branch -d feature/login-page",
        alternates: [],
        hint: "-d is safe delete: Git will refuse if the branch isn't fully merged. Use -D to force.",
      },
      {
        id: "step-5",
        instruction: "Confirm the branch is gone: `git branch`.",
        completedBy: "git branch",
        alternates: [],
        hint: "Clean branch list = clean project state. Merged branches are clutter.",
      },
    ],
    initialGraphState: branchGraph(
      [
        { id: "l9a1", message: "chore: init project" },
        { id: "l9a2", message: "feat: add homepage" },
      ],
      [
        {
          name: "feature/login-page",
          commits: [
            { id: "l9a3", message: "feat: add login form layout" },
            { id: "l9a4", message: "feat: add login form validation" },
          ],
        },
      ],
      "main"
    ),
  },

  {
    missionId: "git-l9-m2-verify-after-merge",
    title: "Verify the merge and read the graph",
    topicId: "branching-workflows",
    level: 9,
    orderIndex: 1,
    difficulty: 3,
    xp: 570,
    steps: [
      {
        id: "step-1",
        instruction: "Inspect the current branch topology before merging: `git log --oneline --graph`.",
        completedBy: "git log --oneline --graph",
        alternates: ["git log --graph"],
        hint: "The graph shows feature/settings branching off main. After merge it will be a straight line.",
      },
      {
        id: "step-2",
        instruction: "Merge feature/settings into main: `git merge feature/settings`.",
        completedBy: "git merge feature/settings",
        alternates: ["git merge"],
        hint: "main has no new commits since the branch point — fast-forward is possible.",
      },
      {
        id: "step-3",
        instruction: "Verify the history is now linear: `git log --oneline --graph`.",
        completedBy: "git log --oneline --graph",
        alternates: ["git log --oneline"],
        hint: "No merge commit in the graph means it was a clean fast-forward. Linear history.",
      },
      {
        id: "step-4",
        instruction: "Confirm clean state after merge: `git status`.",
        completedBy: "git status",
        alternates: [],
        hint: "After a successful merge, you should see 'nothing to commit, working tree clean'.",
      },
      {
        id: "step-5",
        instruction: "Clean up the merged branch: `git branch -d feature/settings`.",
        completedBy: "git branch -d feature/settings",
        alternates: [],
        hint: "Deleting a merged branch is safe — the commits still live in main's history.",
      },
    ],
    initialGraphState: branchGraph(
      [
        { id: "l9b1", message: "chore: init project" },
        { id: "l9b2", message: "feat: add dashboard skeleton" },
      ],
      [
        {
          name: "feature/settings",
          commits: [
            { id: "l9b3", message: "feat: add settings page" },
            { id: "l9b4", message: "feat: add theme selector" },
            { id: "l9b5", message: "fix: persist theme preference" },
          ],
        },
      ],
      "main"
    ),
  },

  {
    missionId: "git-l9-m3-full-feature-ship-cycle",
    title: "Full feature ship cycle: branch → build → merge → clean",
    topicId: "branching-workflows",
    level: 9,
    orderIndex: 2,
    difficulty: 4,
    xp: 600,
    steps: [
      {
        id: "step-1",
        instruction: "Start from main and create a new feature branch: `git switch -c feature/contact-form`.",
        completedBy: "git switch -c feature/contact-form",
        alternates: ["git checkout -b feature/contact-form"],
        hint: "This is the complete cycle you'll run for every feature.",
      },
      {
        id: "step-2",
        instruction: "Commit the first increment: `git commit -m \"feat: add contact form layout\"`.",
        completedBy: "git commit -m",
        alternates: [],
        hint: "Build incrementally — small commits are easier to review and revert.",
      },
      {
        id: "step-3",
        instruction: "Commit the second increment: `git commit -m \"feat: add form validation and submission\"`.",
        completedBy: "git commit -m",
        alternates: [],
        hint: "Another commit on the feature branch — still completely isolated from main.",
      },
      {
        id: "step-4",
        instruction: "Switch back to main to merge: `git switch main`.",
        completedBy: "git switch main",
        alternates: ["git checkout main"],
        hint: "You always merge INTO the target branch. Switch to it first.",
      },
      {
        id: "step-5",
        instruction: "Merge the feature: `git merge feature/contact-form`.",
        completedBy: "git merge feature/contact-form",
        alternates: ["git merge"],
        hint: "Clean fast-forward — both feature commits land on main in order.",
      },
      {
        id: "step-6",
        instruction: "Verify the full history: `git log --oneline --graph`.",
        completedBy: "git log --oneline --graph",
        alternates: ["git log --oneline"],
        hint: "You should see all commits in a straight line — no divergence, no merge commit.",
      },
      {
        id: "step-7",
        instruction: "Delete the merged branch: `git branch -d feature/contact-form`.",
        completedBy: "git branch -d feature/contact-form",
        alternates: [],
        hint: "Cycle complete. Branch created, feature built, merged, cleaned up. Repeat for every ticket.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "l9c1", message: "chore: init project" },
      { id: "l9c2", message: "feat: add about page" },
    ]),
  },
]

/* ═══════════════════════════════════════════════════════════════
   LEVEL 10 — Release Branch Drill  (hotfix · release merge)
   ═══════════════════════════════════════════════════════════════ */

const level10 = [
  {
    missionId: "git-l10-m1-hotfix-while-feature-in-flight",
    title: "Emergency hotfix while a feature is in flight",
    topicId: "branching-workflows",
    level: 10,
    orderIndex: 0,
    difficulty: 3,
    xp: 600,
    steps: [
      {
        id: "step-1",
        instruction: "See what's in flight — a feature branch is active: `git branch`.",
        completedBy: "git branch",
        alternates: [],
        hint: "You have feature/redesign in progress. A production bug just came in. Branches let you handle both.",
      },
      {
        id: "step-2",
        instruction: "Hotfixes ALWAYS branch from main, not from a feature branch: `git switch main`.",
        completedBy: "git switch main",
        alternates: ["git checkout main"],
        hint: "If you branch from feature/redesign, your hotfix will include unreviewed feature code. Never do this.",
      },
      {
        id: "step-3",
        instruction: "Create a hotfix branch: `git switch -c hotfix/null-check-cart`.",
        completedBy: "git switch -c hotfix/null-check-cart",
        alternates: ["git checkout -b hotfix/null-check-cart"],
        hint: "Name hotfix branches clearly: hotfix/<what-you-fixed>. Teams need to know at a glance.",
      },
      {
        id: "step-4",
        instruction: "Commit the fix: `git commit -m \"fix: add null check in cart total calculation\"`.",
        completedBy: "git commit -m",
        alternates: [],
        hint: "Keep hotfixes surgical. One focused fix, one commit. Don't bundle unrelated changes.",
      },
      {
        id: "step-5",
        instruction: "Merge the hotfix back to main: `git switch main`.",
        completedBy: "git switch main",
        alternates: ["git checkout main"],
        hint: "Hotfix is done — now merge it to main so the fix goes to production.",
      },
      {
        id: "step-6",
        instruction: "Merge it: `git merge hotfix/null-check-cart`.",
        completedBy: "git merge hotfix/null-check-cart",
        alternates: ["git merge"],
        hint: "Fast-forward merge — the hotfix lands on main cleanly.",
      },
      {
        id: "step-7",
        instruction: "Clean up the hotfix branch: `git branch -d hotfix/null-check-cart`.",
        completedBy: "git branch -d hotfix/null-check-cart",
        alternates: [],
        hint: "Feature/redesign is still safe and untouched. Crisis resolved, feature work continues.",
      },
    ],
    initialGraphState: branchGraph(
      [
        { id: "l10a1", message: "feat: launch v1.0 — auth + checkout" },
        { id: "l10a2", message: "fix: resolve payment timeout issue" },
      ],
      [
        {
          name: "feature/redesign",
          commits: [
            { id: "l10a3", message: "feat: new homepage layout WIP" },
          ],
        },
      ],
      "main"
    ),
  },

  {
    missionId: "git-l10-m2-release-branch-stabilize",
    title: "Release branch: stabilize before shipping",
    topicId: "branching-workflows",
    level: 10,
    orderIndex: 1,
    difficulty: 4,
    xp: 630,
    steps: [
      {
        id: "step-1",
        instruction: "Sprint is done — cut a release branch from main: `git switch -c release/v2.0.0`.",
        completedBy: "git switch -c release/v2.0.0",
        alternates: ["git checkout -b release/v2.0.0"],
        hint: "Release branches freeze the code for QA while new features keep going on main/develop.",
      },
      {
        id: "step-2",
        instruction: "QA found an issue — fix it on the release branch: `git commit -m \"fix: edge case in checkout flow found in QA\"`.",
        completedBy: "git commit -m",
        alternates: [],
        hint: "Only bug fixes go on the release branch. No new features.",
      },
      {
        id: "step-3",
        instruction: "Bump the version: `git commit -m \"chore: bump version to 2.0.0\"`.",
        completedBy: "git commit -m",
        alternates: [],
        hint: "Version bump commits belong on the release branch, not on main or feature branches.",
      },
      {
        id: "step-4",
        instruction: "Merge the stabilized release back to main: `git switch main`.",
        completedBy: "git switch main",
        alternates: ["git checkout main"],
        hint: "The QA fixes must also land on main — otherwise they'll be lost in the next cycle.",
      },
      {
        id: "step-5",
        instruction: "Merge it: `git merge release/v2.0.0`.",
        completedBy: "git merge release/v2.0.0",
        alternates: ["git merge"],
        hint: "Now main has both the new features and the QA fixes from the release branch.",
      },
      {
        id: "step-6",
        instruction: "Review the final history: `git log --oneline --graph`.",
        completedBy: "git log --oneline --graph",
        alternates: ["git log --oneline"],
        hint: "You can see both the trunk commits and the release branch commits now merged in.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "l10b1", message: "feat: complete sprint 4 features" },
      { id: "l10b2", message: "feat: add export to PDF feature" },
    ]),
  },

  {
    missionId: "git-l10-m3-hotfix-backport-to-release",
    title: "Back-port a hotfix to an active release branch",
    topicId: "branching-workflows",
    level: 10,
    orderIndex: 2,
    difficulty: 4,
    xp: 660,
    steps: [
      {
        id: "step-1",
        instruction: "See the current branches — main and an active release branch: `git branch`.",
        completedBy: "git branch",
        alternates: [],
        hint: "release/v1.5.x is your stable production branch. main has newer work.",
      },
      {
        id: "step-2",
        instruction: "Create a hotfix that must go to BOTH branches: `git switch -c hotfix/cors-policy`.",
        completedBy: "git switch -c hotfix/cors-policy",
        alternates: ["git checkout -b hotfix/cors-policy"],
        hint: "Branch from main (or the release branch) — wherever the bug exists.",
      },
      {
        id: "step-3",
        instruction: "Commit the security fix: `git commit -m \"fix(security): restrict CORS to allowed origins\"`.",
        completedBy: "git commit -m",
        alternates: [],
        hint: "One focused security fix.",
      },
      {
        id: "step-4",
        instruction: "Merge to main first: `git switch main`.",
        completedBy: "git switch main",
        alternates: ["git checkout main"],
        hint: "Main always gets the fix first.",
      },
      {
        id: "step-5",
        instruction: "Merge: `git merge hotfix/cors-policy`.",
        completedBy: "git merge hotfix/cors-policy",
        alternates: ["git merge"],
        hint: "Fix is now on main.",
      },
      {
        id: "step-6",
        instruction: "Now back-port to the release branch: `git switch release/v1.5.x`.",
        completedBy: "git switch release/v1.5.x",
        alternates: ["git checkout release/v1.5.x"],
        hint: "The release branch also needs this fix — users on v1.5.x are still vulnerable.",
      },
      {
        id: "step-7",
        instruction: "Merge the hotfix into the release branch too: `git merge hotfix/cors-policy`.",
        completedBy: "git merge hotfix/cors-policy",
        alternates: ["git merge"],
        hint: "Both branches are now patched. Delete the hotfix branch and you're done.",
      },
      {
        id: "step-8",
        instruction: "Clean up: `git branch -d hotfix/cors-policy`.",
        completedBy: "git branch -d hotfix/cors-policy",
        alternates: [],
        hint: "Both main and release/v1.5.x are patched. Hotfix branch deleted. Incident closed.",
      },
    ],
    initialGraphState: branchGraph(
      [
        { id: "l10c1", message: "feat: v1.5 release" },
        { id: "l10c2", message: "feat: v2 new API design" },
      ],
      [
        {
          name: "release/v1.5.x",
          commits: [{ id: "l10c3", message: "chore: v1.5.2 patch prep" }],
        },
      ],
      "main"
    ),
  },
]

/* ═══════════════════════════════════════════════════════════════
   LEVEL 11 — Branch Policy  (naming · inspect · clean up)
   ═══════════════════════════════════════════════════════════════ */

const level11 = [
  {
    missionId: "git-l11-m1-branch-naming-conventions",
    title: "Professional branch naming conventions",
    topicId: "branching-workflows",
    level: 11,
    orderIndex: 0,
    difficulty: 3,
    xp: 660,
    steps: [
      {
        id: "step-1",
        instruction: "See the existing branches and their names: `git branch`.",
        completedBy: "git branch",
        alternates: [],
        hint: "Good branch names encode type, ticket ID, and a short description: type/PROJ-123-what-it-does.",
      },
      {
        id: "step-2",
        instruction: "Create a properly named feature branch with a ticket reference: `git switch -c feature/PROJ-88-search-filters`.",
        completedBy: "git switch -c feature/PROJ-88-search-filters",
        alternates: ["git checkout -b feature/PROJ-88-search-filters"],
        hint: "type/TICKET-description. Types: feature, bugfix, hotfix, release, chore, refactor.",
      },
      {
        id: "step-3",
        instruction: "Commit work on it: `git commit -m \"feat(search): add price range and category filters\"`.",
        completedBy: "git commit -m",
        alternates: [],
        hint: "Branch name and commit message should both reflect the same ticket.",
      },
      {
        id: "step-4",
        instruction: "Now create a bugfix branch: `git switch -c bugfix/PROJ-91-empty-cart-state`.",
        completedBy: "git switch -c bugfix/PROJ-91-empty-cart-state",
        alternates: ["git checkout -b bugfix/PROJ-91-empty-cart-state"],
        hint: "bugfix/ prefix signals this is correcting existing behavior, not adding something new.",
      },
      {
        id: "step-5",
        instruction: "Verify all your named branches: `git branch`.",
        completedBy: "git branch",
        alternates: [],
        hint: "A well-named branch list tells the whole team what work is in progress.",
      },
    ],
    initialGraphState: branchGraph(
      [
        { id: "l11a1", message: "feat: complete sprint 7 features" },
        { id: "l11a2", message: "chore: update CI configuration" },
      ],
      [
        {
          name: "feature/PROJ-85-user-notifications",
          commits: [{ id: "l11a3", message: "feat: add in-app notification model" }],
        },
      ],
      "main"
    ),
  },

  {
    missionId: "git-l11-m2-list-and-clean-up-branches",
    title: "Identify and delete stale merged branches",
    topicId: "branching-workflows",
    level: 11,
    orderIndex: 1,
    difficulty: 3,
    xp: 690,
    steps: [
      {
        id: "step-1",
        instruction: "See all branches including their last commit: `git branch -v`.",
        completedBy: "git branch -v",
        alternates: ["git branch"],
        hint: "-v shows the tip commit of each branch — helps you spot stale branches at a glance.",
      },
      {
        id: "step-2",
        instruction: "Merge the pending feature branch: `git merge feature/auth`.",
        completedBy: "git merge feature/auth",
        alternates: ["git merge"],
        hint: "Merge it first, then delete. -d refuses to delete unmerged branches.",
      },
      {
        id: "step-3",
        instruction: "Delete the merged feature branch: `git branch -d feature/auth`.",
        completedBy: "git branch -d feature/auth",
        alternates: [],
        hint: "Merged branches are safe to delete — commits still live in main's history.",
      },
      {
        id: "step-4",
        instruction: "Also clean up the merged bugfix branch: `git branch -d bugfix/login-redirect`.",
        completedBy: "git branch -d bugfix/login-redirect",
        alternates: [],
        hint: "Sprint clean-up: delete every merged branch. A tidy branch list = a tidy team.",
      },
      {
        id: "step-5",
        instruction: "Confirm only active branches remain: `git branch`.",
        completedBy: "git branch",
        alternates: [],
        hint: "Only main (and any active in-progress branches) should remain.",
      },
    ],
    initialGraphState: branchGraph(
      [
        { id: "l11b1", message: "chore: init project" },
        { id: "l11b2", message: "feat: add product catalog" },
      ],
      [
        {
          name: "feature/auth",
          commits: [
            { id: "l11b3", message: "feat: add OAuth login" },
            { id: "l11b4", message: "feat: add session management" },
          ],
        },
        {
          name: "bugfix/login-redirect",
          commits: [{ id: "l11b5", message: "fix: correct post-login redirect URL" }],
        },
      ],
      "main"
    ),
  },

  {
    missionId: "git-l11-m3-review-ready-branch",
    title: "Prepare a branch for code review",
    topicId: "branching-workflows",
    level: 11,
    orderIndex: 2,
    difficulty: 4,
    xp: 720,
    steps: [
      {
        id: "step-1",
        instruction: "Confirm which branch you're on: `git branch`.",
        completedBy: "git branch",
        alternates: [],
        hint: "Before prepping for review, make sure you're on the right branch.",
      },
      {
        id: "step-2",
        instruction: "Inspect your full branch topology: `git log --oneline --graph`.",
        completedBy: "git log --oneline --graph",
        alternates: ["git log --graph"],
        hint: "The graph shows you exactly where your branch diverges from main.",
      },
      {
        id: "step-3",
        instruction: "Jump to your feature branch: `git switch feature/PROJ-95-export-csv`.",
        completedBy: "git switch feature/PROJ-95-export-csv",
        alternates: ["git checkout feature/PROJ-95-export-csv"],
        hint: "Review the commits on your branch before asking for review.",
      },
      {
        id: "step-4",
        instruction: "Read your own commits — see what the reviewer will see: `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: ["git log"],
        hint: "Are the messages clear? Are there WIP commits to clean up? Reviewers will judge this.",
      },
      {
        id: "step-5",
        instruction: "Check for uncommitted work before flagging as ready: `git status`.",
        completedBy: "git status",
        alternates: [],
        hint: "Always status-check before opening a PR — stray edits shouldn't sneak in.",
      },
      {
        id: "step-6",
        instruction: "View main's tip to understand the diff scope: `git switch main`.",
        completedBy: "git switch main",
        alternates: ["git checkout main"],
        hint: "Knowing how many commits behind main you are tells you if a rebase is needed before review.",
      },
    ],
    initialGraphState: branchGraph(
      [
        { id: "l11c1", message: "feat: add reporting dashboard" },
        { id: "l11c2", message: "fix: correct date range selector" },
      ],
      [
        {
          name: "feature/PROJ-95-export-csv",
          commits: [
            { id: "l11c3", message: "feat: add CSV export button" },
            { id: "l11c4", message: "feat: generate CSV with correct headers" },
            { id: "l11c5", message: "fix: handle empty dataset edge case" },
          ],
        },
      ],
      "main"
    ),
  },
]

/* ═══════════════════════════════════════════════════════════════
   LEVEL 12 — Integration Readiness  (sync · team branches · push)
   ═══════════════════════════════════════════════════════════════ */

const level12 = [
  {
    missionId: "git-l12-m1-see-teammate-branches",
    title: "Connect to origin and see your team's branches",
    topicId: "branching-workflows",
    level: 12,
    orderIndex: 0,
    difficulty: 4,
    xp: 720,
    steps: [
      {
        id: "step-1",
        instruction: "Connect your local repo to GitHub: `git remote add origin https://github.com/team/project.git`.",
        completedBy: "git remote add origin",
        alternates: ["git remote add"],
        hint: "origin is your team's shared remote. This is how you sync with and see everyone's branches.",
      },
      {
        id: "step-2",
        instruction: "Download all remote branches without changing your local code: `git fetch origin`.",
        completedBy: "git fetch origin",
        alternates: ["git fetch"],
        hint: "fetch downloads the remote's branch list and commits — but doesn't merge anything. Safe to run anytime.",
      },
      {
        id: "step-3",
        instruction: "See ALL branches — local and remote tracking refs: `git branch -a`.",
        completedBy: "git branch -a",
        alternates: ["git branch"],
        hint: "-a shows both local branches and remotes/origin/* entries. Now you can see what teammates are working on.",
      },
      {
        id: "step-4",
        instruction: "Check if remote main has anything you don't: `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: ["git log"],
        hint: "After fetching, your local main may be behind origin/main if teammates pushed while you were working.",
      },
      {
        id: "step-5",
        instruction: "Bring local main up to date with remote main: `git merge origin/main`.",
        completedBy: "git merge origin/main",
        alternates: ["git merge"],
        hint: "fetch + merge = pull. Doing them separately gives you a chance to inspect before integrating.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "l12a1", message: "feat: initial project setup" },
      { id: "l12a2", message: "feat: add user model" },
    ]),
  },

  {
    missionId: "git-l12-m2-sync-feature-with-teammates",
    title: "Sync your feature with teammates' merged work",
    topicId: "branching-workflows",
    level: 12,
    orderIndex: 1,
    difficulty: 4,
    xp: 750,
    steps: [
      {
        id: "step-1",
        instruction: "Fetch the latest from origin to see what teammates pushed: `git fetch origin`.",
        completedBy: "git fetch origin",
        alternates: ["git fetch"],
        hint: "Your teammate merged a feature to main while you were working on yours. Fetch to see it.",
      },
      {
        id: "step-2",
        instruction: "See local and remote branches together: `git branch -a`.",
        completedBy: "git branch -a",
        alternates: ["git branch"],
        hint: "You'll see remotes/origin/main is now ahead of your local main.",
      },
      {
        id: "step-3",
        instruction: "Update local main with the remote changes: `git switch main`.",
        completedBy: "git switch main",
        alternates: ["git checkout main"],
        hint: "Step onto main so you can pull in what's there.",
      },
      {
        id: "step-4",
        instruction: "Merge the remote main into local main: `git merge origin/main`.",
        completedBy: "git merge origin/main",
        alternates: ["git merge"],
        hint: "Now your local main matches what's on GitHub.",
      },
      {
        id: "step-5",
        instruction: "Switch to your feature branch: `git switch feature/analytics`.",
        completedBy: "git switch feature/analytics",
        alternates: ["git checkout feature/analytics"],
        hint: "Now you'll update your feature branch to include what your teammates merged.",
      },
      {
        id: "step-6",
        instruction: "Bring main's new commits into your feature branch: `git merge main`.",
        completedBy: "git merge main",
        alternates: ["git merge"],
        hint: "This keeps your feature up-to-date and reduces conflicts when it's time for your PR.",
      },
      {
        id: "step-7",
        instruction: "Verify the integrated history: `git log --oneline --graph`.",
        completedBy: "git log --oneline --graph",
        alternates: ["git log --oneline"],
        hint: "The graph shows a merge commit where your feature absorbed main's new work.",
      },
    ],
    initialGraphState: branchGraph(
      [
        { id: "l12b1", message: "feat: add auth module" },
        { id: "l12b2", message: "feat: teammate merged — add payment module" },
      ],
      [
        {
          name: "feature/analytics",
          commits: [
            { id: "l12b3", message: "feat: add page view tracking" },
            { id: "l12b4", message: "feat: add session duration metric" },
          ],
        },
      ],
      "feature/analytics"
    ),
  },

  {
    missionId: "git-l12-m3-push-feature-for-review",
    title: "Push your branch and get it ready for PR",
    topicId: "branching-workflows",
    level: 12,
    orderIndex: 2,
    difficulty: 4,
    xp: 780,
    steps: [
      {
        id: "step-1",
        instruction: "Connect to origin: `git remote add origin https://github.com/team/project.git`.",
        completedBy: "git remote add origin",
        alternates: ["git remote add"],
        hint: "You need a remote configured before you can push your branch.",
      },
      {
        id: "step-2",
        instruction: "Fetch to check what's on origin before pushing: `git fetch origin`.",
        completedBy: "git fetch origin",
        alternates: ["git fetch"],
        hint: "Always fetch before push — you want to know if you're behind before sending your work up.",
      },
      {
        id: "step-3",
        instruction: "Inspect your branch's commits one more time: `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: ["git log"],
        hint: "Final review before the team sees your work. Are all commit messages clear and intentional?",
      },
      {
        id: "step-4",
        instruction: "Confirm working tree is clean: `git status`.",
        completedBy: "git status",
        alternates: [],
        hint: "No uncommitted changes should exist. Clean tree = PR is complete and intentional.",
      },
      {
        id: "step-5",
        instruction: "Push your branch and set it to track origin: `git push -u origin feature/notifications`.",
        completedBy: "git push -u origin feature/notifications",
        alternates: ["git push -u"],
        hint: "-u sets upstream tracking. Future `git push` and `git pull` on this branch will use origin automatically.",
      },
      {
        id: "step-6",
        instruction: "Verify all branches — local and remote: `git branch -a`.",
        completedBy: "git branch -a",
        alternates: ["git branch"],
        hint: "You should now see remotes/origin/feature/notifications — your branch is on GitHub and ready for review.",
      },
    ],
    initialGraphState: branchGraph(
      [
        { id: "l12c1", message: "feat: add user dashboard" },
        { id: "l12c2", message: "feat: teammate pushed — add search" },
      ],
      [
        {
          name: "feature/notifications",
          commits: [
            { id: "l12c3", message: "feat: add notification model" },
            { id: "l12c4", message: "feat: add real-time notification badge" },
            { id: "l12c5", message: "fix: debounce notification polling" },
          ],
        },
      ],
      "feature/notifications"
    ),
  },
]

/* ═══════════════════════════════════════════════════════════════
   LEVEL 13 — Rebase Control  (rebase · linear history · rebase vs merge)
   ═══════════════════════════════════════════════════════════════ */

const level13 = [
  {
    missionId: "git-l13-m1-rebase-onto-main",
    title: "Rebase your feature onto the latest main",
    topicId: "merge-and-history",
    level: 13,
    orderIndex: 0,
    difficulty: 4,
    xp: 800,
    steps: [
      {
        id: "step-1",
        instruction: "See the current branch topology: `git log --oneline --graph`.",
        completedBy: "git log --oneline --graph",
        alternates: ["git log --graph"],
        hint: "Your feature branch diverged from main 3 commits ago. Rebase will replay your commits on top of main's tip.",
      },
      {
        id: "step-2",
        instruction: "Make sure you're on the feature branch: `git switch feature/search`.",
        completedBy: "git switch feature/search",
        alternates: ["git checkout feature/search"],
        hint: "You rebase the current branch ONTO another. So be on the branch you want to move.",
      },
      {
        id: "step-3",
        instruction: "Rebase your feature onto main: `git rebase main`.",
        completedBy: "git rebase main",
        alternates: ["git rebase"],
        hint: "Git replays your feature commits one-by-one on top of main's latest commit. New SHAs are created.",
      },
      {
        id: "step-4",
        instruction: "Inspect the linear result: `git log --oneline --graph`.",
        completedBy: "git log --oneline --graph",
        alternates: ["git log --oneline"],
        hint: "No divergence, no merge commit — your feature history looks like it was always built on the latest main.",
      },
      {
        id: "step-5",
        instruction: "Verify the working tree is clean after rebase: `git status`.",
        completedBy: "git status",
        alternates: [],
        hint: "A clean status after rebase means no conflicts occurred. The rebase was smooth.",
      },
    ],
    initialGraphState: branchGraph(
      [
        { id: "l13a1", message: "chore: init project" },
        { id: "l13a2", message: "feat: add auth module" },
        { id: "l13a3", message: "feat: teammate merged — add dashboard" },
      ],
      [
        {
          name: "feature/search",
          from: "l13a2",
          commits: [
            { id: "l13a4", message: "feat: add search input component" },
            { id: "l13a5", message: "feat: connect search to API" },
          ],
        },
      ],
      "main"
    ),
  },

  {
    missionId: "git-l13-m2-rebase-vs-merge",
    title: "Rebase vs merge — know when to use each",
    topicId: "merge-and-history",
    level: 13,
    orderIndex: 1,
    difficulty: 4,
    xp: 850,
    steps: [
      {
        id: "step-1",
        instruction: "Check the topology — your branch is behind main: `git log --oneline --graph`.",
        completedBy: "git log --oneline --graph",
        alternates: ["git log --graph"],
        hint: "Before deciding to rebase or merge, always visualize the graph first.",
      },
      {
        id: "step-2",
        instruction: "Switch to your feature branch: `git switch feature/user-settings`.",
        completedBy: "git switch feature/user-settings",
        alternates: ["git checkout feature/user-settings"],
        hint: "Rule: rebase for private feature branches before PR. Never rebase shared/public branches.",
      },
      {
        id: "step-3",
        instruction: "Rebase onto main to get a clean linear history: `git rebase main`.",
        completedBy: "git rebase main",
        alternates: ["git rebase"],
        hint: "Rebase rewrites your commits with new SHAs. Only safe on branches you haven't shared yet.",
      },
      {
        id: "step-4",
        instruction: "Now switch to main to see how the merge will look: `git switch main`.",
        completedBy: "git switch main",
        alternates: ["git checkout main"],
        hint: "After rebasing, the merge will be a clean fast-forward — no merge commit in history.",
      },
      {
        id: "step-5",
        instruction: "Fast-forward merge the rebased branch: `git merge feature/user-settings`.",
        completedBy: "git merge feature/user-settings",
        alternates: ["git merge"],
        hint: "Rebase + fast-forward merge = the cleanest possible history. Professional teams use this pattern.",
      },
      {
        id: "step-6",
        instruction: "See the final clean history: `git log --oneline --graph`.",
        completedBy: "git log --oneline --graph",
        alternates: ["git log --oneline"],
        hint: "Perfectly linear. No merge commits. Every commit tells a clear story.",
      },
    ],
    initialGraphState: branchGraph(
      [
        { id: "l13b1", message: "feat: add product catalog" },
        { id: "l13b2", message: "feat: teammate — add cart module" },
      ],
      [
        {
          name: "feature/user-settings",
          from: "l13b1",
          commits: [
            { id: "l13b3", message: "feat: add settings page layout" },
            { id: "l13b4", message: "feat: add notification preferences" },
          ],
        },
      ],
      "main"
    ),
  },

  {
    missionId: "git-l13-m3-rebase-continue",
    title: "Handle a conflict during rebase",
    topicId: "merge-and-history",
    level: 13,
    orderIndex: 2,
    difficulty: 5,
    xp: 900,
    steps: [
      {
        id: "step-1",
        instruction: "Start by checking the current branch state: `git status`.",
        completedBy: "git status",
        alternates: [],
        hint: "Before rebasing, confirm your working tree is clean. Uncommitted changes cause messy rebases.",
      },
      {
        id: "step-2",
        instruction: "Start the rebase: `git rebase main`.",
        completedBy: "git rebase main",
        alternates: ["git rebase"],
        hint: "If two branches modified the same lines, Git will pause and ask you to resolve the conflict.",
      },
      {
        id: "step-3",
        instruction: "After resolving conflicts, stage the fixed files: `git add .`.",
        completedBy: "git add .",
        alternates: ["git add"],
        hint: "Never commit during rebase. Stage the resolved files, then run --continue.",
      },
      {
        id: "step-4",
        instruction: "Tell Git to continue the rebase: `git rebase --continue`.",
        completedBy: "git rebase --continue",
        alternates: [],
        hint: "--continue replays the next commit. If there are more conflicts, Git pauses again.",
      },
      {
        id: "step-5",
        instruction: "Verify the clean result: `git log --oneline --graph`.",
        completedBy: "git log --oneline --graph",
        alternates: ["git log --oneline"],
        hint: "Your commits are replayed on top of main with all conflicts resolved.",
      },
    ],
    initialGraphState: branchGraph(
      [
        { id: "l13c1", message: "feat: complete onboarding flow" },
        { id: "l13c2", message: "fix: teammate updated shared config" },
      ],
      [
        {
          name: "feature/analytics",
          from: "l13c1",
          commits: [
            { id: "l13c3", message: "feat: add analytics event tracker" },
          ],
        },
      ],
      "feature/analytics"
    ),
  },
]

/* ═══════════════════════════════════════════════════════════════
   LEVEL 14 — Conflict Surgery  (merge conflicts · resolve · abort)
   ═══════════════════════════════════════════════════════════════ */

const level14 = [
  {
    missionId: "git-l14-m1-understand-a-conflict",
    title: "Read and resolve your first merge conflict",
    topicId: "merge-and-history",
    level: 14,
    orderIndex: 0,
    difficulty: 4,
    xp: 900,
    steps: [
      {
        id: "step-1",
        instruction: "You're on main. Attempt to merge the feature branch: `git merge feature/config-update`.",
        completedBy: "git merge feature/config-update",
        alternates: ["git merge"],
        hint: "Two branches edited the same lines. Git will mark the file and pause — your job is to decide which version wins.",
      },
      {
        id: "step-2",
        instruction: "Git paused — see which files are conflicted: `git status`.",
        completedBy: "git status",
        alternates: [],
        hint: "Conflicted files show as 'both modified'. Open them and you'll see <<<<<<, =======, >>>>>>> markers.",
      },
      {
        id: "step-3",
        instruction: "After manually resolving the conflict markers, stage the fixed file: `git add .`.",
        completedBy: "git add .",
        alternates: ["git add"],
        hint: "Staging a conflicted file tells Git: 'I've resolved this one, it's ready.'",
      },
      {
        id: "step-4",
        instruction: "Complete the merge with a commit: `git commit -m \"merge: feature/config-update with conflict resolved\"`.",
        completedBy: "git commit -m",
        alternates: [],
        hint: "This creates the merge commit that formalizes both branches coming together.",
      },
      {
        id: "step-5",
        instruction: "Verify the merged history: `git log --oneline --graph`.",
        completedBy: "git log --oneline --graph",
        alternates: ["git log --oneline"],
        hint: "The graph shows a diamond — two branches diverged and then merged. That's a 3-way merge.",
      },
    ],
    initialGraphState: branchGraph(
      [
        { id: "l14a1", message: "chore: initial project setup" },
        { id: "l14a2", message: "feat: add base config file" },
      ],
      [
        {
          name: "feature/config-update",
          commits: [
            { id: "l14a3", message: "feat: add production config values" },
          ],
        },
      ],
      "main"
    ),
  },

  {
    missionId: "git-l14-m2-abort-and-retry",
    title: "Abort a bad merge and try a cleaner approach",
    topicId: "merge-and-history",
    level: 14,
    orderIndex: 1,
    difficulty: 4,
    xp: 950,
    steps: [
      {
        id: "step-1",
        instruction: "Attempt the merge: `git merge feature/api-refactor`.",
        completedBy: "git merge feature/api-refactor",
        alternates: ["git merge"],
        hint: "You'll hit a conflict. Sometimes the right call is to abort and rebase first.",
      },
      {
        id: "step-2",
        instruction: "See the conflict state: `git status`.",
        completedBy: "git status",
        alternates: [],
        hint: "Multiple conflicted files — this is going to be complex. Abort and take a cleaner path.",
      },
      {
        id: "step-3",
        instruction: "Abort the merge and return to the clean pre-merge state: `git merge --abort`.",
        completedBy: "git merge --abort",
        alternates: [],
        hint: "--abort is your escape hatch. It fully cancels the merge and restores your working tree.",
      },
      {
        id: "step-4",
        instruction: "Confirm you're back to a clean state: `git status`.",
        completedBy: "git status",
        alternates: [],
        hint: "After abort, working tree should be clean. Nothing lost. Start the proper approach.",
      },
      {
        id: "step-5",
        instruction: "Switch to the feature branch to rebase it first: `git switch feature/api-refactor`.",
        completedBy: "git switch feature/api-refactor",
        alternates: ["git checkout feature/api-refactor"],
        hint: "Rebase the feature onto main first — this often makes conflicts simpler or eliminates them.",
      },
      {
        id: "step-6",
        instruction: "Rebase onto main to reduce conflict surface: `git rebase main`.",
        completedBy: "git rebase main",
        alternates: ["git rebase"],
        hint: "After rebasing, the merge from main will be far simpler — often conflict-free.",
      },
    ],
    initialGraphState: branchGraph(
      [
        { id: "l14b1", message: "feat: add API v1 routes" },
        { id: "l14b2", message: "feat: teammate refactored shared middleware" },
      ],
      [
        {
          name: "feature/api-refactor",
          from: "l14b1",
          commits: [
            { id: "l14b3", message: "refactor: migrate API routes to v2 pattern" },
            { id: "l14b4", message: "fix: update test fixtures for v2" },
          ],
        },
      ],
      "main"
    ),
  },

  {
    missionId: "git-l14-m3-three-way-merge",
    title: "Intentional 3-way merge — preserve the history",
    topicId: "merge-and-history",
    level: 14,
    orderIndex: 2,
    difficulty: 5,
    xp: 1000,
    steps: [
      {
        id: "step-1",
        instruction: "See the full topology — both branches have diverged: `git log --oneline --graph`.",
        completedBy: "git log --oneline --graph",
        alternates: ["git log --graph"],
        hint: "When main and a feature have both advanced, a merge creates a 3-way merge commit preserving both histories.",
      },
      {
        id: "step-2",
        instruction: "Make sure you're on main before merging: `git switch main`.",
        completedBy: "git switch main",
        alternates: ["git checkout main"],
        hint: "You always merge INTO the target. Switch to main, then pull the feature in.",
      },
      {
        id: "step-3",
        instruction: "Merge the feature branch: `git merge feature/payments`.",
        completedBy: "git merge feature/payments",
        alternates: ["git merge"],
        hint: "This creates a merge commit because both branches have new work. That's intentional here.",
      },
      {
        id: "step-4",
        instruction: "If conflict — stage the resolved file: `git add .`.",
        completedBy: "git add .",
        alternates: ["git add"],
        hint: "Edit the conflict markers, keep the right code, then stage to mark as resolved.",
      },
      {
        id: "step-5",
        instruction: "Complete the merge: `git commit -m \"merge: integrate payment feature\"`.",
        completedBy: "git commit -m",
        alternates: [],
        hint: "The merge commit is the permanent record that both streams of work came together here.",
      },
      {
        id: "step-6",
        instruction: "Review the final diamond-shaped merge graph: `git log --oneline --graph`.",
        completedBy: "git log --oneline --graph",
        alternates: ["git log --oneline"],
        hint: "The diamond shape in the graph is the signature of a 3-way merge. It preserves full branch history.",
      },
    ],
    initialGraphState: branchGraph(
      [
        { id: "l14c1", message: "feat: add checkout page" },
        { id: "l14c2", message: "feat: main — add order confirmation" },
      ],
      [
        {
          name: "feature/payments",
          from: "l14c1",
          commits: [
            { id: "l14c3", message: "feat: integrate Stripe payment SDK" },
            { id: "l14c4", message: "feat: add payment status polling" },
          ],
        },
      ],
      "main"
    ),
  },
]

/* ═══════════════════════════════════════════════════════════════
   LEVEL 15 — Recovery Toolkit  (revert · reflog · reset)
   ═══════════════════════════════════════════════════════════════ */

const level15 = [
  {
    missionId: "git-l15-m1-safe-revert-published",
    title: "Safely undo a published commit with revert",
    topicId: "merge-and-history",
    level: 15,
    orderIndex: 0,
    difficulty: 4,
    xp: 1000,
    steps: [
      {
        id: "step-1",
        instruction: "Find the bad commit that broke production: `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: ["git log"],
        hint: "Scan from the top — the bad commit is usually the most recent one.",
      },
      {
        id: "step-2",
        instruction: "Revert the broken commit safely: `git revert l15bad1`.",
        completedBy: "git revert l15bad1",
        alternates: ["git revert"],
        hint: "revert creates a NEW commit that undoes the target. History is preserved — safe for shared branches.",
      },
      {
        id: "step-3",
        instruction: "Confirm the revert commit was created: `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: ["git log"],
        hint: "You'll see a 'Revert ...' commit at the top. The bad commit is still in history — just undone.",
      },
      {
        id: "step-4",
        instruction: "Verify the working tree is clean: `git status`.",
        completedBy: "git status",
        alternates: [],
        hint: "revert auto-commits, so the tree should be clean. Production is now fixed.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "l15g001", message: "feat: add product listing" },
      { id: "l15g002", message: "feat: add cart functionality" },
      { id: "l15bad1", message: "feat: broken DB migration — NEVER SHIP" },
    ]),
  },

  {
    missionId: "git-l15-m2-reflog-rescue",
    title: "Rescue lost commits with reflog",
    topicId: "merge-and-history",
    level: 15,
    orderIndex: 1,
    difficulty: 5,
    xp: 1050,
    steps: [
      {
        id: "step-1",
        instruction: "You accidentally hard-reset and think work is lost. Check reflog: `git reflog`.",
        completedBy: "git reflog",
        alternates: [],
        hint: "reflog records every HEAD movement. Even after reset --hard, your commits are findable here.",
      },
      {
        id: "step-2",
        instruction: "Now soft-reset to the commit BEFORE the accident: `git reset --soft HEAD~1`.",
        completedBy: "git reset --soft HEAD~1",
        alternates: ["git reset --soft"],
        hint: "Soft reset moves HEAD back but keeps your changes staged. Nothing is lost.",
      },
      {
        id: "step-3",
        instruction: "Confirm the staged work is still there: `git status`.",
        completedBy: "git status",
        alternates: [],
        hint: "Your work should appear under 'Changes to be committed' — exactly as staged before.",
      },
      {
        id: "step-4",
        instruction: "Recommit cleanly: `git commit -m \"feat: recover and complete payment webhook\"`.",
        completedBy: "git commit -m",
        alternates: [],
        hint: "You rescued the work, cleaned the message, and kept history intact. Well done.",
      },
      {
        id: "step-5",
        instruction: "Verify the final clean state: `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: ["git log"],
        hint: "Your rescued commit sits cleanly on top. reflog saved you.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "l15r001", message: "feat: add webhook model" },
      { id: "l15r002", message: "feat: implement webhook handler" },
    ]),
  },

  {
    missionId: "git-l15-m3-revert-vs-reset",
    title: "Know when to revert vs reset",
    topicId: "merge-and-history",
    level: 15,
    orderIndex: 2,
    difficulty: 5,
    xp: 1100,
    steps: [
      {
        id: "step-1",
        instruction: "Scan recent history to understand the situation: `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: ["git log"],
        hint: "Rule: revert for shared/published commits. reset for LOCAL-only commits. Know which yours is.",
      },
      {
        id: "step-2",
        instruction: "The last commit hasn't been pushed — undo it cleanly with reset: `git reset --soft HEAD~1`.",
        completedBy: "git reset --soft HEAD~1",
        alternates: ["git reset --soft"],
        hint: "--soft keeps your work staged. You can re-commit with a corrected message.",
      },
      {
        id: "step-3",
        instruction: "Re-commit with the corrected message: `git commit -m \"feat: add user avatar upload with size validation\"`.",
        completedBy: "git commit -m",
        alternates: [],
        hint: "Perfect. The bad commit is gone (never shared), replaced by a clean one.",
      },
      {
        id: "step-4",
        instruction: "Now there's a PUBLISHED bad commit that others depend on. Revert it safely: `git revert l15p002`.",
        completedBy: "git revert l15p002",
        alternates: ["git revert"],
        hint: "Published = already pushed. You cannot reset — teammates would have diverged history. Revert is the only safe path.",
      },
      {
        id: "step-5",
        instruction: "Confirm the safe revert is in history: `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: ["git log"],
        hint: "Two approaches, two scenarios. This distinction is critical in team environments.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "l15p001", message: "feat: stable user auth module" },
      { id: "l15p002", message: "feat: broken data migration — was pushed to shared main" },
      { id: "l15p003", message: "WIP dont commit" },
    ]),
  },
]

/* ═══════════════════════════════════════════════════════════════
   LEVEL 16 — Remote Sync Master  (fetch · pull · push · upstream)
   ═══════════════════════════════════════════════════════════════ */

const level16 = [
  {
    missionId: "git-l16-m1-fetch-inspect-merge",
    title: "Fetch, inspect, then integrate — never pull blind",
    topicId: "advanced-collaboration",
    level: 16,
    orderIndex: 0,
    difficulty: 4,
    xp: 1100,
    steps: [
      {
        id: "step-1",
        instruction: "Connect to your team's remote: `git remote add origin https://github.com/team/app.git`.",
        completedBy: "git remote add origin",
        alternates: ["git remote add"],
        hint: "Every team project has a remote — this is the shared source of truth on GitHub.",
      },
      {
        id: "step-2",
        instruction: "Download remote branches WITHOUT changing your files: `git fetch origin`.",
        completedBy: "git fetch origin",
        alternates: ["git fetch"],
        hint: "fetch is read-only. It updates remote-tracking refs like origin/main but touches nothing local.",
      },
      {
        id: "step-3",
        instruction: "See local and remote branches side by side: `git branch -a`.",
        completedBy: "git branch -a",
        alternates: ["git branch"],
        hint: "remotes/origin/* entries are your window into what teammates have pushed.",
      },
      {
        id: "step-4",
        instruction: "Inspect what's new on origin/main: `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: ["git log"],
        hint: "Know what you're merging before you merge it. This is the professional discipline.",
      },
      {
        id: "step-5",
        instruction: "Now intentionally integrate the remote changes: `git merge origin/main`.",
        completedBy: "git merge origin/main",
        alternates: ["git merge"],
        hint: "fetch + inspect + merge is strictly better than git pull. You stay in control.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "l16a1", message: "chore: initial setup" },
      { id: "l16a2", message: "feat: add product API" },
    ]),
  },

  {
    missionId: "git-l16-m2-pull-then-rebase",
    title: "Pull and rebase your feature before pushing",
    topicId: "advanced-collaboration",
    level: 16,
    orderIndex: 1,
    difficulty: 4,
    xp: 1150,
    steps: [
      {
        id: "step-1",
        instruction: "Your teammate pushed to main while you were working. Fetch first: `git fetch origin`.",
        completedBy: "git fetch origin",
        alternates: ["git fetch"],
        hint: "Fetching shows you the gap before you decide how to close it.",
      },
      {
        id: "step-2",
        instruction: "Update local main with their changes: `git pull origin main`.",
        completedBy: "git pull origin main",
        alternates: ["git pull"],
        hint: "pull = fetch + merge. Now your local main matches the team's.",
      },
      {
        id: "step-3",
        instruction: "Switch to your feature branch: `git switch feature/orders`.",
        completedBy: "git switch feature/orders",
        alternates: ["git checkout feature/orders"],
        hint: "Your feature was built on the old main. Rebase it onto the new tip.",
      },
      {
        id: "step-4",
        instruction: "Rebase your feature on the updated main: `git rebase main`.",
        completedBy: "git rebase main",
        alternates: ["git rebase"],
        hint: "After rebase, your feature commits sit on top of the latest main — no divergence.",
      },
      {
        id: "step-5",
        instruction: "Push your now-rebased branch: `git push -u origin feature/orders`.",
        completedBy: "git push -u origin feature/orders",
        alternates: ["git push -u"],
        hint: "After rebase the commit SHAs changed, so first push uses -u to set upstream tracking.",
      },
    ],
    initialGraphState: branchGraph(
      [
        { id: "l16b1", message: "feat: add user model" },
        { id: "l16b2", message: "feat: teammate pushed — add payment model" },
      ],
      [
        {
          name: "feature/orders",
          from: "l16b1",
          commits: [
            { id: "l16b3", message: "feat: add order creation endpoint" },
            { id: "l16b4", message: "feat: add order history view" },
          ],
        },
      ],
      "feature/orders"
    ),
  },

  {
    missionId: "git-l16-m3-rejected-push-recovery",
    title: "Recover from a rejected push",
    topicId: "advanced-collaboration",
    level: 16,
    orderIndex: 2,
    difficulty: 5,
    xp: 1200,
    steps: [
      {
        id: "step-1",
        instruction: "You tried pushing but got rejected — remote is ahead. Fetch to see the state: `git fetch origin`.",
        completedBy: "git fetch origin",
        alternates: ["git fetch"],
        hint: "A rejected push means origin/main has commits your local main doesn't. Never force-push main.",
      },
      {
        id: "step-2",
        instruction: "Check the branch landscape: `git branch -a`.",
        completedBy: "git branch -a",
        alternates: ["git branch"],
        hint: "Seeing remotes/origin/main helps you understand how far ahead the remote is.",
      },
      {
        id: "step-3",
        instruction: "Pull the remote changes to resolve the divergence: `git pull origin main`.",
        completedBy: "git pull origin main",
        alternates: ["git pull"],
        hint: "Pull first, then push. This is the safe pattern. Your changes and the remote changes will be merged.",
      },
      {
        id: "step-4",
        instruction: "Verify the merged history is clean: `git log --oneline --graph`.",
        completedBy: "git log --oneline --graph",
        alternates: ["git log --oneline"],
        hint: "After pull, there's a merge commit that integrates both histories. Now push is safe.",
      },
      {
        id: "step-5",
        instruction: "Now push successfully: `git push origin main`.",
        completedBy: "git push origin main",
        alternates: ["git push"],
        hint: "After incorporating the remote changes, your push is no longer rejected. You're back in sync.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "l16c1", message: "chore: init project" },
      { id: "l16c2", message: "feat: add user registration" },
      { id: "l16c3", message: "feat: add login form" },
    ]),
  },
]

/* ═══════════════════════════════════════════════════════════════
   LEVEL 17 — PR Command Center  (PRs · rebase · squash · review)
   ═══════════════════════════════════════════════════════════════ */

const level17 = [
  {
    missionId: "git-l17-m1-prepare-pr-branch",
    title: "Prepare a clean branch for code review",
    topicId: "advanced-collaboration",
    level: 17,
    orderIndex: 0,
    difficulty: 4,
    xp: 1250,
    steps: [
      {
        id: "step-1",
        instruction: "Inspect your current branch commits — see the WIP history: `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: ["git log"],
        hint: "You have 4 commits including 'WIP' and 'fix typo'. Reviewers hate this. Clean it up first.",
      },
      {
        id: "step-2",
        instruction: "Squash the last 3 WIP commits into one: `git rebase -i HEAD~3`.",
        completedBy: "git rebase -i HEAD~3",
        alternates: ["git rebase -i"],
        hint: "Interactive rebase opens an editor. Change 'pick' to 'squash' for commits to merge up.",
      },
      {
        id: "step-3",
        instruction: "Verify the cleaned history: `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: ["git log"],
        hint: "3 messy commits → 1 clean commit. Reviewers now see a single clear change to evaluate.",
      },
      {
        id: "step-4",
        instruction: "Check working tree is clean: `git status`.",
        completedBy: "git status",
        alternates: [],
        hint: "No uncommitted work. The branch is ready to push for review.",
      },
      {
        id: "step-5",
        instruction: "Push the clean branch: `git push -u origin feature/auth-refactor`.",
        completedBy: "git push -u origin feature/auth-refactor",
        alternates: ["git push -u"],
        hint: "Branch is on GitHub. Now open a PR with a clear description — the clean history does half the work.",
      },
    ],
    initialGraphState: branchGraph(
      [
        { id: "l17a1", message: "feat: add auth module" },
      ],
      [
        {
          name: "feature/auth-refactor",
          commits: [
            { id: "l17a2", message: "WIP: start refactor" },
            { id: "l17a3", message: "fix typo" },
            { id: "l17a4", message: "more WIP" },
          ],
        },
      ],
      "feature/auth-refactor"
    ),
  },

  {
    missionId: "git-l17-m2-keep-pr-up-to-date",
    title: "Keep your PR up to date while under review",
    topicId: "advanced-collaboration",
    level: 17,
    orderIndex: 1,
    difficulty: 5,
    xp: 1300,
    steps: [
      {
        id: "step-1",
        instruction: "Your PR is in review and main got new commits. Fetch to see: `git fetch origin`.",
        completedBy: "git fetch origin",
        alternates: ["git fetch"],
        hint: "Fetching shows what teammates pushed while your PR was in review.",
      },
      {
        id: "step-2",
        instruction: "Check all branches including remote: `git branch -a`.",
        completedBy: "git branch -a",
        alternates: ["git branch"],
        hint: "origin/main is ahead of your feature branch base. You need to rebase.",
      },
      {
        id: "step-3",
        instruction: "Rebase your PR branch onto the latest main: `git rebase origin/main`.",
        completedBy: "git rebase origin/main",
        alternates: ["git rebase"],
        hint: "Rebasing onto origin/main directly is cleaner than rebasing onto local main.",
      },
      {
        id: "step-4",
        instruction: "Confirm clean history after rebase: `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: ["git log"],
        hint: "Your PR commits now sit on top of the latest main — reviewers see the real diff.",
      },
      {
        id: "step-5",
        instruction: "Push the updated branch: `git push -u origin feature/profile-page`.",
        completedBy: "git push -u origin feature/profile-page",
        alternates: ["git push -u"],
        hint: "The PR on GitHub updates automatically when you push — reviewers see the fresh rebase.",
      },
    ],
    initialGraphState: branchGraph(
      [
        { id: "l17b1", message: "feat: add dashboard" },
        { id: "l17b2", message: "feat: teammate merged — add analytics widget" },
      ],
      [
        {
          name: "feature/profile-page",
          from: "l17b1",
          commits: [
            { id: "l17b3", message: "feat: add user profile view" },
            { id: "l17b4", message: "feat: add avatar upload" },
          ],
        },
      ],
      "feature/profile-page"
    ),
  },

  {
    missionId: "git-l17-m3-squash-merge-to-main",
    title: "Squash merge an approved PR into main",
    topicId: "advanced-collaboration",
    level: 17,
    orderIndex: 2,
    difficulty: 5,
    xp: 1350,
    steps: [
      {
        id: "step-1",
        instruction: "PR approved! Switch to main before integrating: `git switch main`.",
        completedBy: "git switch main",
        alternates: ["git checkout main"],
        hint: "You always merge INTO the target branch. Switch to main first.",
      },
      {
        id: "step-2",
        instruction: "Squash all PR commits into one clean commit: `git merge --squash feature/checkout-flow`.",
        completedBy: "git merge --squash feature/checkout-flow",
        alternates: ["git merge --squash"],
        hint: "--squash stages all the branch's changes as one. You write the final commit message.",
      },
      {
        id: "step-3",
        instruction: "Commit with a clean, release-worthy message: `git commit -m \"feat: add multi-step checkout flow\"`.",
        completedBy: "git commit -m",
        alternates: [],
        hint: "The squash commit message is what appears in main's history forever. Make it count.",
      },
      {
        id: "step-4",
        instruction: "Delete the merged branch — it's been squashed into main: `git branch -d feature/checkout-flow`.",
        completedBy: "git branch -d feature/checkout-flow",
        alternates: [],
        hint: "After squash merge, the feature branch's commits no longer exist on main — only the squash commit. Safe to delete.",
      },
      {
        id: "step-5",
        instruction: "See the clean main history: `git log --oneline --graph`.",
        completedBy: "git log --oneline --graph",
        alternates: ["git log --oneline"],
        hint: "No branch noise. One commit per feature. This is how professional teams keep main readable.",
      },
    ],
    initialGraphState: branchGraph(
      [
        { id: "l17c1", message: "feat: add product catalog" },
        { id: "l17c2", message: "feat: add cart" },
      ],
      [
        {
          name: "feature/checkout-flow",
          commits: [
            { id: "l17c3", message: "WIP: step 1 address" },
            { id: "l17c4", message: "WIP: step 2 payment" },
            { id: "l17c5", message: "fix: form validation" },
            { id: "l17c6", message: "fix: mobile layout" },
          ],
        },
      ],
      "main"
    ),
  },
]

/* ═══════════════════════════════════════════════════════════════
   LEVEL 18 — Git & GitHub King  (incident response · full workflow)
   ═══════════════════════════════════════════════════════════════ */

const level18 = [
  {
    missionId: "git-l18-m1-full-team-workflow",
    title: "Full team workflow: feature to merged PR",
    topicId: "advanced-collaboration",
    level: 18,
    orderIndex: 0,
    difficulty: 5,
    xp: 1450,
    steps: [
      {
        id: "step-1",
        instruction: "Start from a synced main — fetch first: `git fetch origin`.",
        completedBy: "git fetch origin",
        alternates: ["git fetch"],
        hint: "Every professional workflow starts with a fetch. Know the remote state before writing a line.",
      },
      {
        id: "step-2",
        instruction: "Create a properly named feature branch: `git switch -c feature/PROJ-212-export-pdf`.",
        completedBy: "git switch -c feature/PROJ-212-export-pdf",
        alternates: ["git checkout -b feature/PROJ-212"],
        hint: "type/TICKET-description. Teammates and CI systems parse branch names.",
      },
      {
        id: "step-3",
        instruction: "Build your feature incrementally: `git commit -m \"feat(export): add PDF generation service\"`.",
        completedBy: "git commit -m",
        alternates: [],
        hint: "Atomic, well-named commits. Each commit should be a complete, reviewable unit of work.",
      },
      {
        id: "step-4",
        instruction: "Before PR — rebase onto latest main: `git rebase main`.",
        completedBy: "git rebase main",
        alternates: ["git rebase"],
        hint: "Pre-PR rebase keeps your diff clean and conflict-free when the reviewer merges.",
      },
      {
        id: "step-5",
        instruction: "Push the feature branch: `git push -u origin feature/PROJ-212-export-pdf`.",
        completedBy: "git push -u origin feature/PROJ-212",
        alternates: ["git push -u"],
        hint: "Branch on GitHub = PR can be opened. -u sets tracking so future pushes are just git push.",
      },
      {
        id: "step-6",
        instruction: "After approval — squash merge to main: `git switch main`.",
        completedBy: "git switch main",
        alternates: ["git checkout main"],
        hint: "Switch to main to receive the merge.",
      },
      {
        id: "step-7",
        instruction: "Squash merge: `git merge --squash feature/PROJ-212-export-pdf`.",
        completedBy: "git merge --squash feature/PROJ-212",
        alternates: ["git merge --squash"],
        hint: "All feature commits collapse into one clean commit on main.",
      },
      {
        id: "step-8",
        instruction: "Commit the final integration: `git commit -m \"feat(export): add PDF export feature — PROJ-212\"`.",
        completedBy: "git commit -m",
        alternates: [],
        hint: "One clean commit per feature in main. Complete, auditable, and readable.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "l18a1", message: "feat: launch v2.0 — auth and catalog" },
      { id: "l18a2", message: "fix: correct search pagination offset" },
    ]),
  },

  {
    missionId: "git-l18-m2-production-incident-response",
    title: "Production incident: find, fix, and ship",
    topicId: "advanced-collaboration",
    level: 18,
    orderIndex: 1,
    difficulty: 5,
    xp: 1500,
    steps: [
      {
        id: "step-1",
        instruction: "Find the bad commit that caused the regression: `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: ["git log"],
        hint: "Scan recent commits — incidents are almost always caused by the last 1-3 commits.",
      },
      {
        id: "step-2",
        instruction: "Find line-level ownership fast: `git blame README.md`.",
        completedBy: "git blame README.md",
        alternates: ["git blame"],
        hint: "blame gives you commit hash, author, and date per line — instant root-cause context.",
      },
      {
        id: "step-3",
        instruction: "Branch a hotfix from main: `git switch -c hotfix/v2.1.1-null-pointer`.",
        completedBy: "git switch -c hotfix/v2.1.1-null-pointer",
        alternates: ["git checkout -b hotfix/"],
        hint: "Hotfix branches from the clean main — never from a half-baked feature branch.",
      },
      {
        id: "step-4",
        instruction: "Commit the surgical fix: `git commit -m \"fix: add null guard in order total calculation\"`.",
        completedBy: "git commit -m",
        alternates: [],
        hint: "One fix, one commit. Hotfixes must be minimal and reviewable at speed.",
      },
      {
        id: "step-5",
        instruction: "Merge to main immediately: `git switch main`.",
        completedBy: "git switch main",
        alternates: ["git checkout main"],
        hint: "Hotfix goes to main (production) first.",
      },
      {
        id: "step-6",
        instruction: "Merge it: `git merge hotfix/v2.1.1-null-pointer`.",
        completedBy: "git merge hotfix/v2.1.1-null-pointer",
        alternates: ["git merge"],
        hint: "Fast-forward merge — the hotfix is now on main.",
      },
      {
        id: "step-7",
        instruction: "Verify the full production-ready history: `git log --oneline --graph`.",
        completedBy: "git log --oneline --graph",
        alternates: ["git log --oneline"],
        hint: "Clean history, hotfix landed, incident trail is clear. This is what on-call looks like.",
      },
    ],
    initialGraphState: branchGraph(
      [
        { id: "l18b1", message: "feat: launch v2.1.0 — orders and reporting" },
        { id: "l18b2", message: "feat: add bulk order export" },
      ],
      [
        {
          name: "feature/analytics-v2",
          commits: [{ id: "l18b3", message: "feat: rebuild analytics dashboard" }],
        },
      ],
      "main"
    ),
  },

  {
    missionId: "git-l18-m3-git-github-king",
    title: "Git & GitHub King — the complete workflow",
    topicId: "advanced-collaboration",
    level: 18,
    orderIndex: 2,
    difficulty: 5,
    xp: 1600,
    steps: [
      {
        id: "step-1",
        instruction: "Start every session with a team sync: `git fetch origin`.",
        completedBy: "git fetch origin",
        alternates: ["git fetch"],
        hint: "Professional habit: fetch before any branch work. Always know the remote state.",
      },
      {
        id: "step-2",
        instruction: "See the full branch picture — yours and teammates': `git branch -a`.",
        completedBy: "git branch -a",
        alternates: ["git branch"],
        hint: "-a shows local and remote branches. You can see every teammate's active branch.",
      },
      {
        id: "step-3",
        instruction: "Inspect the team's recent history: `git log --oneline --graph`.",
        completedBy: "git log --oneline --graph",
        alternates: ["git log --graph"],
        hint: "The graph tells the story of the sprint — merges, hotfixes, features. Read it before writing.",
      },
      {
        id: "step-4",
        instruction: "Create your next feature branch: `git switch -c feature/PROJ-300-redesign-nav`.",
        completedBy: "git switch -c feature/PROJ-300-redesign-nav",
        alternates: ["git checkout -b feature/PROJ-300"],
        hint: "Naming convention: type/TICKET-short-description. Every team member can parse it.",
      },
      {
        id: "step-5",
        instruction: "Build your first commit: `git commit -m \"feat(nav): redesign top navigation layout\"`.",
        completedBy: "git commit -m",
        alternates: [],
        hint: "Every commit message should be usable as a changelog entry. Write it for your future self.",
      },
      {
        id: "step-6",
        instruction: "Before pushing — rebase to ensure a clean base: `git rebase main`.",
        completedBy: "git rebase main",
        alternates: ["git rebase"],
        hint: "Pre-push rebase = clean PR = faster review = faster merge. Always.",
      },
      {
        id: "step-7",
        instruction: "Push for review: `git push -u origin feature/PROJ-300-redesign-nav`.",
        completedBy: "git push -u origin feature/PROJ-300",
        alternates: ["git push -u"],
        hint: "Branch is live on GitHub. Open the PR, add reviewers, link the ticket. You're now a team player.",
      },
      {
        id: "step-8",
        instruction: "End with a final status check — clean slate for tomorrow: `git status`.",
        completedBy: "git status",
        alternates: [],
        hint: "Clean status, everything pushed, PR open. This is what professional Git looks like every single day.",
      },
    ],
    initialGraphState: branchGraph(
      [
        { id: "l18c1", message: "feat: ship v3.0.0 — full replatform" },
        { id: "l18c2", message: "fix: patch prod API rate limits" },
      ],
      [
        {
          name: "feature/PROJ-295-dark-mode",
          commits: [
            { id: "l18c3", message: "feat(theme): add dark mode toggle" },
            { id: "l18c4", message: "feat(theme): persist preference in localStorage" },
          ],
        },
      ],
      "main"
    ),
  },
]

/* ═══════════════════════════════════════════════════════════════
   TRACK 4 — Advanced Git Techniques  (Levels 19-24)
   ═══════════════════════════════════════════════════════════════ */

/* ── LEVEL 19 — WIP Saver  (stash · stash pop · stash list) ── */

const level19 = [
  {
    missionId: "git-l19-m1-interrupt-and-save",
    title: "Interrupt & save your WIP",
    topicId: "advanced-git-techniques",
    level: 19,
    orderIndex: 0,
    difficulty: 4,
    xp: 1600,
    steps: [
      {
        id: "step-1",
        instruction: "You're mid-feature when an urgent bug arrives. Check what's unfinished first: `git status`.",
        completedBy: "git status",
        alternates: [],
        hint: "Always inspect your working tree before stashing — know what you're saving.",
      },
      {
        id: "step-2",
        instruction: "Save your unfinished work temporarily: `git stash`.",
        completedBy: "git stash",
        alternates: ["git stash push"],
        hint: "stash is like a clipboard for your uncommitted work — it clears the tree and saves state.",
      },
      {
        id: "step-3",
        instruction: "Confirm the working tree is now clean: `git status`.",
        completedBy: "git status",
        alternates: [],
        hint: "After stashing, the working directory should show nothing to commit.",
      },
      {
        id: "step-4",
        instruction: "Fix the bug and commit it: `git commit -m \"fix: resolve auth token expiry crash\"`.",
        completedBy: "git commit -m",
        alternates: [],
        hint: "The stash is still safe. Fix, commit, then restore — in that order.",
      },
      {
        id: "step-5",
        instruction: "Restore your feature work: `git stash pop`.",
        completedBy: "git stash pop",
        alternates: ["git stash apply"],
        hint: "pop restores the most recent stash and removes it from the stash list. apply keeps it.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "a1f9b2", message: "add user dashboard" },
      { id: "b3c7d1", message: "add sidebar nav" },
    ]),
  },
  {
    missionId: "git-l19-m2-stash-list-and-apply",
    title: "Manage multiple stashes",
    topicId: "advanced-git-techniques",
    level: 19,
    orderIndex: 1,
    difficulty: 4,
    xp: 1650,
    steps: [
      {
        id: "step-1",
        instruction: "Stash your first WIP batch: `git stash`.",
        completedBy: "git stash",
        alternates: ["git stash push"],
        hint: "Each stash gets added to the top of the stash stack.",
      },
      {
        id: "step-2",
        instruction: "Make another change and stash it too: `git stash`.",
        completedBy: "git stash",
        alternates: ["git stash push"],
        hint: "You can stash multiple times. Each entry is indexed stash@{0}, stash@{1}, …",
      },
      {
        id: "step-3",
        instruction: "Inspect all saved stashes: `git stash list`.",
        completedBy: "git stash list",
        alternates: [],
        hint: "stash list shows every saved entry. stash@{0} is always the most recent.",
      },
      {
        id: "step-4",
        instruction: "Restore the most recent stash back to your tree: `git stash pop`.",
        completedBy: "git stash pop",
        alternates: ["git stash apply"],
        hint: "pop = apply + drop. It restores and removes stash@{0} in one step.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "c5d8e2", message: "init project" },
      { id: "f1a3b4", message: "add config loader" },
    ]),
  },
  {
    missionId: "git-l19-m3-branch-then-restore",
    title: "Stash, switch branch, then restore",
    topicId: "advanced-git-techniques",
    level: 19,
    orderIndex: 2,
    difficulty: 5,
    xp: 1700,
    steps: [
      {
        id: "step-1",
        instruction: "Stash your current WIP before switching context: `git stash`.",
        completedBy: "git stash",
        alternates: ["git stash push"],
        hint: "You can't switch branches with unstaged work unless you stash or commit first.",
      },
      {
        id: "step-2",
        instruction: "Create and switch to a hotfix branch: `git switch -c hotfix/login-bug`.",
        completedBy: "git switch -c hotfix/login-bug",
        alternates: ["git checkout -b hotfix/login-bug"],
        hint: "Hotfix branches isolate urgent work from your main feature.",
      },
      {
        id: "step-3",
        instruction: "Commit the hotfix: `git commit -m \"fix: restore login redirect after session expiry\"`.",
        completedBy: "git commit -m",
        alternates: [],
        hint: "A focused commit on a separate branch is easier to review and merge.",
      },
      {
        id: "step-4",
        instruction: "Switch back to your feature branch: `git switch main`.",
        completedBy: "git switch main",
        alternates: ["git checkout main"],
        hint: "Your stash is waiting on any branch — it's not branch-scoped.",
      },
      {
        id: "step-5",
        instruction: "Restore your feature work: `git stash pop`.",
        completedBy: "git stash pop",
        alternates: ["git stash apply"],
        hint: "Everything picks up exactly where you left off.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "b2e5f7", message: "feat: add profile page skeleton" },
    ]),
  },
]

/* ── LEVEL 20 — Cherry-Pick Surgeon ────────────────────────── */

const level20 = [
  {
    missionId: "git-l20-m1-pick-one-commit",
    title: "Apply one commit to main",
    topicId: "advanced-git-techniques",
    level: 20,
    orderIndex: 0,
    difficulty: 4,
    xp: 1700,
    steps: [
      {
        id: "step-1",
        instruction: "Check log to find the commit you want to apply: `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: ["git log"],
        hint: "Find the commit hash you want to cherry-pick — you only need the first 7 characters.",
      },
      {
        id: "step-2",
        instruction: "Apply commit `a3f9b1c` from the hotfix branch to your current branch: `git cherry-pick a3f9b1c`.",
        completedBy: "git cherry-pick a3f9b1c",
        alternates: ["git cherry-pick"],
        hint: "Cherry-pick replays the diff from a specific commit onto your current HEAD.",
      },
      {
        id: "step-3",
        instruction: "Verify the pick landed cleanly in your history: `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: ["git log"],
        hint: "The picked commit appears with a new hash — same message, different SHA.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "f2c1d3", message: "fix: patch input validation" },
      { id: "a3f9b1c", message: "fix: sanitize HTML in comments" },
      { id: "b8e2a4", message: "feat: add comment threading" },
    ]),
  },
  {
    missionId: "git-l20-m2-hotfix-to-release",
    title: "Back-port a hotfix to release branch",
    topicId: "advanced-git-techniques",
    level: 20,
    orderIndex: 1,
    difficulty: 5,
    xp: 1750,
    steps: [
      {
        id: "step-1",
        instruction: "You're on the release branch. View recent commits on main to find the hotfix: `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: ["git log"],
        hint: "Production branches often need cherry-picks from main without merging everything.",
      },
      {
        id: "step-2",
        instruction: "Cherry-pick the security fix commit `d4e7f8a` onto the release branch: `git cherry-pick d4e7f8a`.",
        completedBy: "git cherry-pick d4e7f8a",
        alternates: ["git cherry-pick"],
        hint: "This applies only that one fix, not every commit between then and now.",
      },
      {
        id: "step-3",
        instruction: "Confirm state is clean after the pick: `git status`.",
        completedBy: "git status",
        alternates: [],
        hint: "If cherry-pick succeeded with no conflicts, the tree will be clean.",
      },
      {
        id: "step-4",
        instruction: "Tag this patched release: `git tag v2.3.1`.",
        completedBy: "git tag v2.3.1",
        alternates: ["git tag"],
        hint: "After cherry-picking a security fix, tag the patched version for release tracking.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "cc1d22", message: "chore: bump deps" },
      { id: "d4e7f8a", message: "fix: patch XSS in search input" },
      { id: "e9f0a1", message: "feat: dark mode toggle" },
    ]),
  },
  {
    missionId: "git-l20-m3-multi-pick",
    title: "Cherry-pick a sequence of commits",
    topicId: "advanced-git-techniques",
    level: 20,
    orderIndex: 2,
    difficulty: 5,
    xp: 1800,
    steps: [
      {
        id: "step-1",
        instruction: "Scan history to plan your picks: `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: ["git log"],
        hint: "Pick only the commits you need — cherry-pick is surgical by design.",
      },
      {
        id: "step-2",
        instruction: "Cherry-pick the first needed commit `b1c2d3e`: `git cherry-pick b1c2d3e`.",
        completedBy: "git cherry-pick b1c2d3e",
        alternates: ["git cherry-pick"],
        hint: "Apply commits in chronological order to avoid dependency issues.",
      },
      {
        id: "step-3",
        instruction: "Cherry-pick the second commit `c3d4e5f`: `git cherry-pick c3d4e5f`.",
        completedBy: "git cherry-pick c3d4e5f",
        alternates: ["git cherry-pick"],
        hint: "Each cherry-pick creates a new commit with the same message but a new hash.",
      },
      {
        id: "step-4",
        instruction: "Review the final state of history: `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: ["git log"],
        hint: "You should see both picked commits landing on top of your branch.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "a0f1b2", message: "init: scaffold API routes" },
      { id: "b1c2d3e", message: "feat: add rate limiting middleware" },
      { id: "c3d4e5f", message: "fix: handle 429 response correctly" },
      { id: "d5e6f7", message: "chore: update README" },
    ]),
  },
]

/* ── LEVEL 21 — Tag & Release ────────────────────────────── */

const level21 = [
  {
    missionId: "git-l21-m1-first-release-tag",
    title: "Tag your first release",
    topicId: "advanced-git-techniques",
    level: 21,
    orderIndex: 0,
    difficulty: 4,
    xp: 1800,
    steps: [
      {
        id: "step-1",
        instruction: "Your feature is merged and tested. Check the commit log: `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: ["git log"],
        hint: "Always confirm HEAD is at the right commit before tagging a release.",
      },
      {
        id: "step-2",
        instruction: "Create a lightweight tag for v1.0.0: `git tag v1.0.0`.",
        completedBy: "git tag v1.0.0",
        alternates: ["git tag"],
        hint: "Lightweight tags are just pointers to a commit — no extra metadata.",
      },
      {
        id: "step-3",
        instruction: "List all tags to confirm it exists: `git tag`.",
        completedBy: "git tag",
        alternates: [],
        hint: "Running git tag with no arguments lists every tag in the repo.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "a1b2c3", message: "feat: complete user auth flow" },
      { id: "d4e5f6", message: "fix: correct token refresh logic" },
      { id: "g7h8i9", message: "chore: update production config" },
    ]),
  },
  {
    missionId: "git-l21-m2-annotated-tag",
    title: "Create an annotated release tag",
    topicId: "advanced-git-techniques",
    level: 21,
    orderIndex: 1,
    difficulty: 4,
    xp: 1850,
    steps: [
      {
        id: "step-1",
        instruction: "Create an annotated tag with a release message: `git tag -a v1.1.0 -m \"Release v1.1.0: add dark mode and performance fixes\"`.",
        completedBy: "git tag -a v1.1.0",
        alternates: ["git tag -a"],
        hint: "Annotated tags (-a) store a tagger name, email, date, and message. Prefer these for releases.",
      },
      {
        id: "step-2",
        instruction: "List all tags: `git tag`.",
        completedBy: "git tag",
        alternates: [],
        hint: "Annotated tags appear the same in the list but carry richer metadata.",
      },
      {
        id: "step-3",
        instruction: "Check the current clean state: `git status`.",
        completedBy: "git status",
        alternates: [],
        hint: "After tagging, your working tree hasn't changed — tags are just pointers.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "h1i2j3", message: "feat: dark mode toggle" },
      { id: "k4l5m6", message: "perf: lazy-load images" },
      { id: "n7o8p9", message: "fix: prevent layout shift on load" },
    ]),
  },
  {
    missionId: "git-l21-m3-semver-patch",
    title: "Patch release with semantic versioning",
    topicId: "advanced-git-techniques",
    level: 21,
    orderIndex: 2,
    difficulty: 5,
    xp: 1900,
    steps: [
      {
        id: "step-1",
        instruction: "A critical bug was fixed post-release. Commit the patch: `git commit -m \"fix: prevent null pointer in cart total\"`.",
        completedBy: "git commit -m",
        alternates: [],
        hint: "SemVer rule: MAJOR.MINOR.PATCH — bug fixes increment PATCH.",
      },
      {
        id: "step-2",
        instruction: "Tag the patch release: `git tag -a v1.0.1 -m \"Patch release: fix cart null pointer\"`.",
        completedBy: "git tag -a v1.0.1",
        alternates: ["git tag -a"],
        hint: "v1.0.0 → v1.0.1 follows semantic versioning for backwards-compatible bug fixes.",
      },
      {
        id: "step-3",
        instruction: "Confirm both v1.0.0 and v1.0.1 exist: `git tag`.",
        completedBy: "git tag",
        alternates: [],
        hint: "You should see both release tags listed — old releases stay in history forever.",
      },
      {
        id: "step-4",
        instruction: "Review the full commit history: `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: ["git log"],
        hint: "A clean history + correct tags = auditable release trail.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "q1r2s3", message: "feat: launch v1.0.0 — auth + cart" },
    ]),
  },
]

/* ── LEVEL 22 — Remote Origin Mastery ─────────────────────── */

const level22 = [
  {
    missionId: "git-l22-m1-add-and-verify-remote",
    title: "Connect your repo to GitHub",
    topicId: "advanced-git-techniques",
    level: 22,
    orderIndex: 0,
    difficulty: 4,
    xp: 1900,
    steps: [
      {
        id: "step-1",
        instruction: "Check if any remotes are already configured: `git remote -v`.",
        completedBy: "git remote -v",
        alternates: ["git remote"],
        hint: "An empty output means no remote is set — that's expected for a fresh local repo.",
      },
      {
        id: "step-2",
        instruction: "Add GitHub as your origin remote: `git remote add origin https://github.com/you/your-repo.git`.",
        completedBy: "git remote add origin",
        alternates: ["git remote add"],
        hint: "origin is the conventional name for your primary remote. You can use any name, but origin is standard.",
      },
      {
        id: "step-3",
        instruction: "Verify the remote was added correctly: `git remote -v`.",
        completedBy: "git remote -v",
        alternates: ["git remote"],
        hint: "You should see fetch and push URLs for origin.",
      },
      {
        id: "step-4",
        instruction: "Push your main branch and set tracking: `git push -u origin main`.",
        completedBy: "git push -u origin main",
        alternates: ["git push -u"],
        hint: "-u sets the upstream tracking so future `git push` and `git pull` work without arguments.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "t1u2v3", message: "initial commit" },
      { id: "w4x5y6", message: "add project structure" },
    ]),
  },
  {
    missionId: "git-l22-m2-fetch-before-merge",
    title: "Fetch then integrate carefully",
    topicId: "advanced-git-techniques",
    level: 22,
    orderIndex: 1,
    difficulty: 5,
    xp: 1950,
    steps: [
      {
        id: "step-1",
        instruction: "Always fetch before merging remote changes — never pull blind: `git fetch origin`.",
        completedBy: "git fetch origin",
        alternates: ["git fetch"],
        hint: "fetch downloads changes but does NOT modify your working tree. pull = fetch + merge.",
      },
      {
        id: "step-2",
        instruction: "Check for divergence after fetching: `git status`.",
        completedBy: "git status",
        alternates: [],
        hint: "After fetch, status may show 'Your branch is behind origin/main by N commits'.",
      },
      {
        id: "step-3",
        instruction: "Review what came in: `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: ["git log"],
        hint: "Inspect remote changes before integrating — know what you're merging.",
      },
      {
        id: "step-4",
        instruction: "Merge the upstream changes cleanly: `git merge origin/main`.",
        completedBy: "git merge origin/main",
        alternates: ["git merge"],
        hint: "Merging after an explicit fetch gives you full control over when integration happens.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "z1a2b3", message: "feat: setup CI pipeline" },
      { id: "c4d5e6", message: "feat: add test coverage report" },
    ]),
  },
  {
    missionId: "git-l22-m3-push-feature-branch",
    title: "Push a feature branch to origin",
    topicId: "advanced-git-techniques",
    level: 22,
    orderIndex: 2,
    difficulty: 5,
    xp: 2000,
    steps: [
      {
        id: "step-1",
        instruction: "Create and switch to a new feature branch: `git switch -c feature/payment-gateway`.",
        completedBy: "git switch -c feature/payment-gateway",
        alternates: ["git checkout -b feature/payment-gateway"],
        hint: "Feature branches let you develop in isolation without touching main.",
      },
      {
        id: "step-2",
        instruction: "Make your first commit on this branch: `git commit -m \"feat: scaffold payment gateway integration\"`.",
        completedBy: "git commit -m",
        alternates: [],
        hint: "Commit on the feature branch — main stays untouched.",
      },
      {
        id: "step-3",
        instruction: "Push the feature branch and set upstream tracking: `git push -u origin feature/payment-gateway`.",
        completedBy: "git push -u origin feature/payment-gateway",
        alternates: ["git push -u"],
        hint: "-u only needs to be set once per branch. After that, git push alone works.",
      },
      {
        id: "step-4",
        instruction: "Confirm the remote tracking is set: `git status`.",
        completedBy: "git status",
        alternates: [],
        hint: "Status should show 'Your branch is up to date with origin/feature/payment-gateway'.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "f7g8h9", message: "feat: add product listing page" },
    ]),
  },
]

/* ── LEVEL 23 — Fork & Upstream Sync ─────────────────────── */

const level23 = [
  {
    missionId: "git-l23-m1-add-upstream-remote",
    title: "Connect your fork to upstream",
    topicId: "advanced-git-techniques",
    level: 23,
    orderIndex: 0,
    difficulty: 5,
    xp: 2000,
    steps: [
      {
        id: "step-1",
        instruction: "You forked an open-source repo. Check your current remotes: `git remote -v`.",
        completedBy: "git remote -v",
        alternates: ["git remote"],
        hint: "Your fork has origin pointing to your copy. You need a second remote for the original project.",
      },
      {
        id: "step-2",
        instruction: "Add the original project as upstream: `git remote add upstream https://github.com/original/project.git`.",
        completedBy: "git remote add upstream",
        alternates: ["git remote add"],
        hint: "upstream is the conventional name for the original project you forked from.",
      },
      {
        id: "step-3",
        instruction: "Verify both remotes exist: `git remote -v`.",
        completedBy: "git remote -v",
        alternates: ["git remote"],
        hint: "You should see both origin (your fork) and upstream (original project).",
      },
      {
        id: "step-4",
        instruction: "Fetch all branches from upstream: `git fetch upstream`.",
        completedBy: "git fetch upstream",
        alternates: ["git fetch"],
        hint: "Fetching upstream doesn't change your code — it just downloads references.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "i1j2k3", message: "forked from upstream/main" },
    ]),
  },
  {
    missionId: "git-l23-m2-sync-fork-with-upstream",
    title: "Sync your fork when upstream advances",
    topicId: "advanced-git-techniques",
    level: 23,
    orderIndex: 1,
    difficulty: 5,
    xp: 2050,
    steps: [
      {
        id: "step-1",
        instruction: "Fetch the latest changes from upstream: `git fetch upstream`.",
        completedBy: "git fetch upstream",
        alternates: ["git fetch"],
        hint: "Always fetch before syncing — you need to download upstream's latest commits first.",
      },
      {
        id: "step-2",
        instruction: "Switch to your main branch: `git switch main`.",
        completedBy: "git switch main",
        alternates: ["git checkout main"],
        hint: "You sync the main branch of your fork to match upstream/main.",
      },
      {
        id: "step-3",
        instruction: "Merge upstream/main into your local main: `git merge upstream/main`.",
        completedBy: "git merge upstream/main",
        alternates: ["git merge"],
        hint: "This brings your fork up to date with the original project's main branch.",
      },
      {
        id: "step-4",
        instruction: "Push the synced main to your fork on GitHub: `git push origin main`.",
        completedBy: "git push origin main",
        alternates: ["git push"],
        hint: "Now your fork on GitHub also reflects the latest upstream changes.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "l4m5n6", message: "feat: initial fork setup" },
      { id: "o7p8q9", message: "fix: local customization" },
    ]),
  },
  {
    missionId: "git-l23-m3-contribution-branch",
    title: "Prepare a contribution PR",
    topicId: "advanced-git-techniques",
    level: 23,
    orderIndex: 2,
    difficulty: 5,
    xp: 2100,
    steps: [
      {
        id: "step-1",
        instruction: "Sync your fork first (always): fetch and merge upstream: `git fetch upstream`.",
        completedBy: "git fetch upstream",
        alternates: ["git fetch"],
        hint: "Never start a contribution on a stale fork — you'll hit unnecessary merge conflicts.",
      },
      {
        id: "step-2",
        instruction: "Create a focused branch for your contribution: `git switch -c fix/typo-in-docs`.",
        completedBy: "git switch -c fix/typo-in-docs",
        alternates: ["git checkout -b fix/typo-in-docs"],
        hint: "Keep contribution branches small and focused — one PR per concern.",
      },
      {
        id: "step-3",
        instruction: "Make your change and commit it: `git commit -m \"fix: correct typo in installation docs\"`.",
        completedBy: "git commit -m",
        alternates: [],
        hint: "Small, clear commits make code review faster and merges cleaner.",
      },
      {
        id: "step-4",
        instruction: "Push your contribution branch to your fork: `git push -u origin fix/typo-in-docs`.",
        completedBy: "git push -u origin fix/typo-in-docs",
        alternates: ["git push -u"],
        hint: "Now you can open a PR from your fork's branch to the upstream project.",
      },
      {
        id: "step-5",
        instruction: "Confirm your branch is up to date: `git status`.",
        completedBy: "git status",
        alternates: [],
        hint: "Clean status + pushed branch = ready to open your PR on GitHub.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "r1s2t3", message: "sync: up to date with upstream/main" },
    ]),
  },
]

/* ── LEVEL 24 — Advanced Recovery Pro ─────────────────────── */

const level24 = [
  {
    missionId: "git-l24-m1-stash-plus-revert",
    title: "Stash, fix, then safe-revert",
    topicId: "advanced-git-techniques",
    level: 24,
    orderIndex: 0,
    difficulty: 5,
    xp: 2200,
    steps: [
      {
        id: "step-1",
        instruction: "Production is broken. Stash current WIP immediately: `git stash`.",
        completedBy: "git stash",
        alternates: ["git stash push"],
        hint: "Get to a clean state fast so you can diagnose and fix without interference.",
      },
      {
        id: "step-2",
        instruction: "Check what commits introduced the issue: `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: ["git log"],
        hint: "Scan the most recent 3-5 commits — the culprit is almost always the last merge.",
      },
      {
        id: "step-3",
        instruction: "Safely undo the broken commit without deleting history: `git revert HEAD`.",
        completedBy: "git revert HEAD",
        alternates: ["git revert"],
        hint: "revert creates a NEW commit that undoes the target commit — safe for shared branches.",
      },
      {
        id: "step-4",
        instruction: "Verify production is stable: `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: ["git log"],
        hint: "You'll see the revert commit on top — history is preserved, bug is gone.",
      },
      {
        id: "step-5",
        instruction: "Restore your WIP to continue the feature: `git stash pop`.",
        completedBy: "git stash pop",
        alternates: ["git stash apply"],
        hint: "Production is fixed and your feature work is back — incident resolved.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "u4v5w6", message: "feat: add bulk export feature" },
      { id: "x7y8z9", message: "deploy: update production env vars" },
      { id: "aa1bb2", message: "feat: broken DB migration" },
    ]),
  },
  {
    missionId: "git-l24-m2-reflog-rescue",
    title: "Rescue a lost commit with reflog",
    topicId: "advanced-git-techniques",
    level: 24,
    orderIndex: 1,
    difficulty: 5,
    xp: 2250,
    steps: [
      {
        id: "step-1",
        instruction: "You accidentally reset and lost a commit. Check the full reflog: `git reflog`.",
        completedBy: "git reflog",
        alternates: [],
        hint: "reflog records every move HEAD has made — even after resets and checkouts.",
      },
      {
        id: "step-2",
        instruction: "Soft-reset back to before the accident: `git reset --soft HEAD~1`.",
        completedBy: "git reset --soft HEAD~1",
        alternates: ["git reset --soft"],
        hint: "Soft reset moves HEAD back but keeps your changes staged — nothing is lost.",
      },
      {
        id: "step-3",
        instruction: "Recommit the rescued work cleanly: `git commit -m \"feat: recover and clean up payment flow\"`.",
        completedBy: "git commit -m",
        alternates: [],
        hint: "The recovered work is now safely committed with a clean message.",
      },
      {
        id: "step-4",
        instruction: "Confirm history looks correct: `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: ["git log"],
        hint: "Your rescue commit should sit cleanly on top of the previous history.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "cc3dd4", message: "feat: implement payment webhook" },
      { id: "ee5ff6", message: "feat: add payment status polling" },
    ]),
  },
  {
    missionId: "git-l24-m3-full-incident-recovery",
    title: "Full incident response workflow",
    topicId: "advanced-git-techniques",
    level: 24,
    orderIndex: 2,
    difficulty: 5,
    xp: 2300,
    steps: [
      {
        id: "step-1",
        instruction: "Alert received. Stash WIP and get clean: `git stash`.",
        completedBy: "git stash",
        alternates: ["git stash push"],
        hint: "Clear your workspace before incident response — context switching costs mistakes.",
      },
      {
        id: "step-2",
        instruction: "Review the full HEAD movement log: `git reflog`.",
        completedBy: "git reflog",
        alternates: [],
        hint: "Reflog shows you every recent action — essential for understanding what happened.",
      },
      {
        id: "step-3",
        instruction: "Cherry-pick the fix from the hotfix branch: `git cherry-pick gg7hh8i`.",
        completedBy: "git cherry-pick gg7hh8i",
        alternates: ["git cherry-pick"],
        hint: "Apply the pre-tested hotfix precisely without merging unrelated changes.",
      },
      {
        id: "step-4",
        instruction: "Tag the patched release: `git tag -a v3.1.1 -m \"hotfix: resolve auth bypass vulnerability\"`.",
        completedBy: "git tag -a v3.1.1",
        alternates: ["git tag -a"],
        hint: "Tag every emergency release so the incident trail is auditable.",
      },
      {
        id: "step-5",
        instruction: "Restore your feature work: `git stash pop`.",
        completedBy: "git stash pop",
        alternates: ["git stash apply"],
        hint: "Incident resolved, back to your feature. Team workflows keep moving.",
      },
      {
        id: "step-6",
        instruction: "Confirm the clean final state: `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: ["git log"],
        hint: "Hotfix commit, release tag, and your feature work — all properly documented.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "ii9jj0", message: "feat: deploy v3.1.0" },
      { id: "gg7hh8i", message: "fix: patch auth bypass — critical security" },
    ]),
  },
]

/* ═══════════════════════════════════════════════════════════════
   TRACK 5 — Professional Mastery  (Levels 25-30)
   ═══════════════════════════════════════════════════════════════ */

/* ── LEVEL 25 — Conventional Commits ──────────────────────── */

const level25 = [
  {
    missionId: "git-l25-m1-first-conventional-commit",
    title: "Write your first conventional commit",
    topicId: "professional-mastery",
    level: 25,
    orderIndex: 0,
    difficulty: 5,
    xp: 2400,
    steps: [
      {
        id: "step-1",
        instruction: "Stage your changes: `git add .`.",
        completedBy: "git add .",
        alternates: ["git add"],
        hint: "The commit format is: <type>(<scope>): <description> — e.g., feat(auth): add OAuth login.",
      },
      {
        id: "step-2",
        instruction: "Commit a new feature using conventional format: `git commit -m \"feat(auth): add OAuth2 Google login\"`.",
        completedBy: "git commit -m \"feat(auth):",
        alternates: ["git commit -m \"feat:"],
        hint: "feat = new feature, fix = bug fix, chore = maintenance, docs = documentation.",
      },
      {
        id: "step-3",
        instruction: "Now commit a bug fix conventionally: `git commit -m \"fix(auth): handle expired refresh tokens\"`.",
        completedBy: "git commit -m \"fix(",
        alternates: ["git commit -m \"fix:"],
        hint: "fix type signals that this commit addresses a defect — triggers a PATCH version bump.",
      },
      {
        id: "step-4",
        instruction: "Review your conventional commit history: `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: ["git log"],
        hint: "Clean, typed commits make changelogs auto-generable and code reviews faster.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "kk1ll2", message: "chore: init project with vite" },
    ]),
  },
  {
    missionId: "git-l25-m2-commit-types-drill",
    title: "Practice all commit types",
    topicId: "professional-mastery",
    level: 25,
    orderIndex: 1,
    difficulty: 5,
    xp: 2450,
    steps: [
      {
        id: "step-1",
        instruction: "Commit a documentation update: `git commit -m \"docs(api): document rate limiting headers\"`.",
        completedBy: "git commit -m \"docs(",
        alternates: ["git commit -m \"docs:"],
        hint: "docs type = no production code change, just documentation updates.",
      },
      {
        id: "step-2",
        instruction: "Commit a refactor: `git commit -m \"refactor(cart): extract cart total calculation to service\"`.",
        completedBy: "git commit -m \"refactor(",
        alternates: ["git commit -m \"refactor:"],
        hint: "refactor = code change with no new feature and no bug fix — purely structural improvement.",
      },
      {
        id: "step-3",
        instruction: "Commit a test addition: `git commit -m \"test(cart): add unit tests for cart total edge cases\"`.",
        completedBy: "git commit -m \"test(",
        alternates: ["git commit -m \"test:"],
        hint: "test type = adding or fixing tests — CI tools can filter this from changelogs.",
      },
      {
        id: "step-4",
        instruction: "Review your typed commit history: `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: ["git log"],
        hint: "A conventional commit history reads like a clean changelog — every line tells a story.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "mm3nn4", message: "feat(api): initial REST endpoints" },
    ]),
  },
  {
    missionId: "git-l25-m3-breaking-change",
    title: "Signal a breaking change",
    topicId: "professional-mastery",
    level: 25,
    orderIndex: 2,
    difficulty: 5,
    xp: 2500,
    steps: [
      {
        id: "step-1",
        instruction: "You're removing a deprecated API endpoint. Stage the change: `git add .`.",
        completedBy: "git add .",
        alternates: ["git add"],
        hint: "Breaking changes require MAJOR version bump in semantic versioning.",
      },
      {
        id: "step-2",
        instruction: "Commit the breaking change with the ! notation: `git commit -m \"feat(api)!: remove deprecated v1 user endpoint\"`.",
        completedBy: "git commit -m \"feat(api)!:",
        alternates: ["git commit -m \"feat!:"],
        hint: "The ! after the type signals a breaking change — triggers MAJOR version bump in semantic-release.",
      },
      {
        id: "step-3",
        instruction: "Commit the migration guide as docs: `git commit -m \"docs(migration): v1 to v2 endpoint migration guide\"`.",
        completedBy: "git commit -m \"docs(",
        alternates: ["git commit -m \"docs:"],
        hint: "Always pair breaking changes with migration docs — teams depend on this.",
      },
      {
        id: "step-4",
        instruction: "Tag the major release: `git tag -a v2.0.0 -m \"Major release: v2 API — v1 endpoints removed\"`.",
        completedBy: "git tag -a v2.0.0",
        alternates: ["git tag -a"],
        hint: "MAJOR version bump = v1.x.x → v2.0.0 — signals breaking API changes to consumers.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "oo5pp6", message: "feat(api): add v2 user endpoint with pagination" },
      { id: "qq7rr8", message: "feat(api): deprecation notice on v1 endpoint" },
    ]),
  },
]

/* ── LEVEL 26 — Interactive Rebase ─────────────────────────── */

const level26 = [
  {
    missionId: "git-l26-m1-squash-commits",
    title: "Squash messy commits before PR",
    topicId: "professional-mastery",
    level: 26,
    orderIndex: 0,
    difficulty: 5,
    xp: 2600,
    steps: [
      {
        id: "step-1",
        instruction: "You have 4 WIP commits. Check the log before cleaning: `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: ["git log"],
        hint: "Squashing is how you turn 'WIP', 'fix typo', 'more fixes' into one clean commit for review.",
      },
      {
        id: "step-2",
        instruction: "Start interactive rebase on the last 4 commits: `git rebase -i HEAD~4`.",
        completedBy: "git rebase -i HEAD~4",
        alternates: ["git rebase -i"],
        hint: "In the interactive editor, change 'pick' to 'squash' (or 's') for commits to merge into the one above.",
      },
      {
        id: "step-3",
        instruction: "After rebase completes, verify the cleaned log: `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: ["git log"],
        hint: "You should see fewer commits — your WIP history is now one clean, reviewable commit.",
      },
      {
        id: "step-4",
        instruction: "Confirm working tree is clean post-rebase: `git status`.",
        completedBy: "git status",
        alternates: [],
        hint: "After a clean interactive rebase, the working tree should show nothing to commit.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "ss1tt2", message: "WIP: start dashboard refactor" },
      { id: "uu3vv4", message: "fix: oops, fix import" },
      { id: "ww5xx6", message: "more fixes" },
      { id: "yy7zz8", message: "WIP: almost done" },
    ]),
  },
  {
    missionId: "git-l26-m2-fixup-and-reword",
    title: "Fixup and reword commits",
    topicId: "professional-mastery",
    level: 26,
    orderIndex: 1,
    difficulty: 5,
    xp: 2650,
    steps: [
      {
        id: "step-1",
        instruction: "Review commits to clean: `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: ["git log"],
        hint: "fixup is like squash but discards the fixup commit's message. reword lets you edit a message.",
      },
      {
        id: "step-2",
        instruction: "Use interactive rebase to fixup and reword: `git rebase -i HEAD~3`.",
        completedBy: "git rebase -i HEAD~3",
        alternates: ["git rebase -i"],
        hint: "Use 'f' for fixup (merge + discard message) or 'r' to reword a commit message.",
      },
      {
        id: "step-3",
        instruction: "Check the resulting log: `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: ["git log"],
        hint: "A clean, rebased history reads like intentional work — no WIP or typo fix commits.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "aab1b2", message: "feat: add user search" },
      { id: "bbc3c4", message: "fix typo in variable name" },
      { id: "ccd5d6", message: "fxi: correct search api url" },
    ]),
  },
  {
    missionId: "git-l26-m3-reorder-commits",
    title: "Reorder and clean before merge",
    topicId: "professional-mastery",
    level: 26,
    orderIndex: 2,
    difficulty: 5,
    xp: 2700,
    steps: [
      {
        id: "step-1",
        instruction: "Scan your branch history before cleaning: `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: ["git log"],
        hint: "You want to reorder commits so logical changes are grouped before merging.",
      },
      {
        id: "step-2",
        instruction: "Open interactive rebase for the last 5 commits: `git rebase -i HEAD~5`.",
        completedBy: "git rebase -i HEAD~5",
        alternates: ["git rebase -i"],
        hint: "In the editor, you can drag lines to reorder commits. Be careful with dependencies.",
      },
      {
        id: "step-3",
        instruction: "Check that rebase completed without conflicts: `git status`.",
        completedBy: "git status",
        alternates: [],
        hint: "If conflicts occur during rebase, resolve them and run git rebase --continue.",
      },
      {
        id: "step-4",
        instruction: "Review the final clean history: `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: ["git log"],
        hint: "A properly ordered history tells a story — reviewers can follow the narrative.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "dde7e8", message: "feat: add notifications" },
      { id: "eef9f0", message: "test: notification unit tests" },
      { id: "ffg1g2", message: "feat: add email template" },
      { id: "ggh3h4", message: "test: email integration tests" },
      { id: "hhi5i6", message: "docs: notification API docs" },
    ]),
  },
]

/* ── LEVEL 27 — Git Audit Tools ─────────────────────────────── */

const level27 = [
  {
    missionId: "git-l27-m1-blame-investigation",
    title: "Find who introduced a bug",
    topicId: "professional-mastery",
    level: 27,
    orderIndex: 0,
    difficulty: 5,
    xp: 2800,
    steps: [
      {
        id: "step-1",
        instruction: "A bug was introduced in README.md. Find the author of each line: `git blame README.md`.",
        completedBy: "git blame README.md",
        alternates: ["git blame"],
        hint: "blame shows every line with its commit hash, author, and date — essential for root-cause analysis.",
      },
      {
        id: "step-2",
        instruction: "Once you found the suspect commit, get the full context: `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: ["git log"],
        hint: "Combine blame (who/when) with log (why) for a complete picture of the change.",
      },
      {
        id: "step-3",
        instruction: "Check current working state before your fix: `git status`.",
        completedBy: "git status",
        alternates: [],
        hint: "Always verify clean state before making investigative fixes.",
      },
      {
        id: "step-4",
        instruction: "Commit your targeted fix: `git commit -m \"fix(readme): correct misleading install instructions\"`.",
        completedBy: "git commit -m",
        alternates: [],
        hint: "Reference blame findings in your fix commit — makes the audit trail clear.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "iij7j8", message: "docs: rewrite getting started section" },
      { id: "jjk9k0", message: "fix: update node version requirement" },
    ]),
  },
  {
    missionId: "git-l27-m2-log-archaeology",
    title: "Search commit history like a detective",
    topicId: "professional-mastery",
    level: 27,
    orderIndex: 1,
    difficulty: 5,
    xp: 2850,
    steps: [
      {
        id: "step-1",
        instruction: "Search for all commits that mention 'payment' in their message: `git log --oneline --grep=\"payment\"`.",
        completedBy: "git log --oneline --grep",
        alternates: ["git log --grep"],
        hint: "--grep filters the log to commits whose messages match a pattern. Case-sensitive by default.",
      },
      {
        id: "step-2",
        instruction: "Find commits from the last 30 days: `git log --oneline --since=\"30 days ago\"`.",
        completedBy: "git log --oneline --since",
        alternates: ["git log --since"],
        hint: "--since accepts natural language or ISO dates. Useful for sprint reviews and incident timelines.",
      },
      {
        id: "step-3",
        instruction: "Review a compact visual branch graph: `git log --oneline --graph`.",
        completedBy: "git log --oneline --graph",
        alternates: ["git log --graph"],
        hint: "--graph draws branch and merge topology — shows how the history was shaped.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "kkl1l2", message: "feat(payment): add stripe integration" },
      { id: "llm3m4", message: "fix(payment): handle webhook retry logic" },
      { id: "mmn5n6", message: "chore: upgrade stripe SDK" },
    ]),
  },
  {
    missionId: "git-l27-m3-bisect-bug-hunt",
    title: "Binary search for the bad commit",
    topicId: "professional-mastery",
    level: 27,
    orderIndex: 2,
    difficulty: 5,
    xp: 2900,
    steps: [
      {
        id: "step-1",
        instruction: "Start a bisect session to find a regression: `git bisect start`.",
        completedBy: "git bisect start",
        alternates: [],
        hint: "bisect uses binary search to find the commit that introduced a bug — O(log n) commit checks.",
      },
      {
        id: "step-2",
        instruction: "Mark HEAD as the bad commit where the bug exists: `git bisect bad`.",
        completedBy: "git bisect bad",
        alternates: [],
        hint: "bad tells Git: this commit has the bug. Git will then ask you to test a midpoint.",
      },
      {
        id: "step-3",
        instruction: "Mark the last known good commit: `git bisect good nno7o8p`.",
        completedBy: "git bisect good nno7o8p",
        alternates: ["git bisect good"],
        hint: "Git now knows the range and checks out the midpoint for you to test.",
      },
      {
        id: "step-4",
        instruction: "End the bisect session: `git bisect reset`.",
        completedBy: "git bisect reset",
        alternates: [],
        hint: "reset returns HEAD to where you were before bisect. Always reset when done.",
      },
      {
        id: "step-5",
        instruction: "Once the culprit is found, revert it safely: `git revert HEAD`.",
        completedBy: "git revert HEAD",
        alternates: ["git revert"],
        hint: "Revert the bad commit — safe for shared branches because it adds rather than removes history.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "nno7o8p", message: "feat: all tests passing — v2.0 baseline" },
      { id: "oop9p0", message: "refactor: reorganize middleware order" },
      { id: "ppq1q2", message: "feat: add request correlation IDs" },
    ]),
  },
]

/* ── LEVEL 28 — Branch Strategy ─────────────────────────────── */

const level28 = [
  {
    missionId: "git-l28-m1-gitflow-hotfix",
    title: "GitFlow hotfix branch workflow",
    topicId: "professional-mastery",
    level: 28,
    orderIndex: 0,
    difficulty: 5,
    xp: 3000,
    steps: [
      {
        id: "step-1",
        instruction: "Production bug detected. Create a hotfix branch from main: `git switch -c hotfix/v2.1.1-auth-fix`.",
        completedBy: "git switch -c hotfix/v2.1.1-auth-fix",
        alternates: ["git checkout -b hotfix/v2.1.1-auth-fix"],
        hint: "GitFlow hotfix branches are always cut from main/master (the release branch), not develop.",
      },
      {
        id: "step-2",
        instruction: "Commit the hotfix: `git commit -m \"fix(auth): prevent session hijacking on token refresh\"`.",
        completedBy: "git commit -m",
        alternates: [],
        hint: "Hotfix commits should be minimal and surgical — only the fix, nothing else.",
      },
      {
        id: "step-3",
        instruction: "Switch back to main to merge the hotfix: `git switch main`.",
        completedBy: "git switch main",
        alternates: ["git checkout main"],
        hint: "In GitFlow, hotfixes merge to BOTH main (for release) and develop (so the fix carries forward).",
      },
      {
        id: "step-4",
        instruction: "Merge the hotfix: `git merge hotfix/v2.1.1-auth-fix`.",
        completedBy: "git merge hotfix/v2.1.1-auth-fix",
        alternates: ["git merge"],
        hint: "Use --no-ff to preserve the merge commit — makes the hotfix visible in history.",
      },
      {
        id: "step-5",
        instruction: "Tag the patched production release: `git tag -a v2.1.1 -m \"hotfix: auth session fix\"`.",
        completedBy: "git tag -a v2.1.1",
        alternates: ["git tag -a"],
        hint: "Every production deployment should be tagged. This is your audit trail.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "qqr3r4", message: "release: v2.1.0 — new dashboard" },
    ]),
  },
  {
    missionId: "git-l28-m2-trunk-based-feature",
    title: "Trunk-based development workflow",
    topicId: "professional-mastery",
    level: 28,
    orderIndex: 1,
    difficulty: 5,
    xp: 3050,
    steps: [
      {
        id: "step-1",
        instruction: "Trunk-based: start from the latest main: `git switch main`.",
        completedBy: "git switch main",
        alternates: ["git checkout main"],
        hint: "In trunk-based development, you integrate to main frequently — branches are short-lived (1-2 days max).",
      },
      {
        id: "step-2",
        instruction: "Create a short-lived feature branch: `git switch -c feat/quick-filter`.",
        completedBy: "git switch -c feat/quick-filter",
        alternates: ["git checkout -b feat/quick-filter"],
        hint: "Keep trunk-based branches tiny and focused — one small, releasable increment.",
      },
      {
        id: "step-3",
        instruction: "Commit your small, complete increment: `git commit -m \"feat(filter): add debounced search filter to product list\"`.",
        completedBy: "git commit -m",
        alternates: [],
        hint: "Every trunk-based commit should be production-safe — no half-built features.",
      },
      {
        id: "step-4",
        instruction: "Merge back to trunk immediately: `git switch main`.",
        completedBy: "git switch main",
        alternates: ["git checkout main"],
        hint: "Short-lived branches reduce merge conflicts and keep CI feedback fast.",
      },
      {
        id: "step-5",
        instruction: "Merge your feature to trunk: `git merge feat/quick-filter`.",
        completedBy: "git merge feat/quick-filter",
        alternates: ["git merge"],
        hint: "Trunk-based teams merge multiple times per day — the key is small, safe increments.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "rrs5s6", message: "feat: add product grid with pagination" },
    ]),
  },
  {
    missionId: "git-l28-m3-branch-naming-convention",
    title: "Apply professional branch naming",
    topicId: "professional-mastery",
    level: 28,
    orderIndex: 2,
    difficulty: 5,
    xp: 3100,
    steps: [
      {
        id: "step-1",
        instruction: "Create a feature branch with standard naming: `git switch -c feature/PROJ-142-user-avatar-upload`.",
        completedBy: "git switch -c feature/PROJ-142-user-avatar-upload",
        alternates: ["git checkout -b feature/PROJ-142"],
        hint: "Convention: <type>/<ticket-id>-<short-description>. Type is feature, fix, chore, release, hotfix.",
      },
      {
        id: "step-2",
        instruction: "Commit your work: `git commit -m \"feat(avatar): add image upload with compression\"`.",
        completedBy: "git commit -m",
        alternates: [],
        hint: "The ticket ID in the branch name links commits to your project tracking tool.",
      },
      {
        id: "step-3",
        instruction: "Now create a release preparation branch: `git switch -c release/v3.0.0`.",
        completedBy: "git switch -c release/v3.0.0",
        alternates: ["git checkout -b release/v3.0.0"],
        hint: "Release branches are for final testing and bump commits before tagging the production release.",
      },
      {
        id: "step-4",
        instruction: "Commit a version bump: `git commit -m \"chore(release): bump version to 3.0.0\"`.",
        completedBy: "git commit -m",
        alternates: [],
        hint: "Version bump commits are often automated by semantic-release tools in CI/CD.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "sst7t8", message: "feat: complete v2.9 milestone" },
    ]),
  },
]

/* ── LEVEL 29 — CI/CD & Repo Hygiene ─────────────────────────── */

const level29 = [
  {
    missionId: "git-l29-m1-gitignore-patterns",
    title: "Master .gitignore patterns",
    topicId: "professional-mastery",
    level: 29,
    orderIndex: 0,
    difficulty: 5,
    xp: 3200,
    steps: [
      {
        id: "step-1",
        instruction: "Check what files Git is currently tracking: `git status`.",
        completedBy: "git status",
        alternates: [],
        hint: "You may see node_modules, .env, dist, and build artifacts that should never be committed.",
      },
      {
        id: "step-2",
        instruction: "Stop tracking a file that was accidentally committed: `git rm --cached .env`.",
        completedBy: "git rm --cached .env",
        alternates: ["git rm --cached"],
        hint: "git rm --cached removes a file from Git's tracking WITHOUT deleting it from disk.",
      },
      {
        id: "step-3",
        instruction: "Commit the untracking change: `git commit -m \"chore: remove .env from version control\"`.",
        completedBy: "git commit -m",
        alternates: [],
        hint: "After removing from tracking, commit so teammates' repos also untrack it.",
      },
      {
        id: "step-4",
        instruction: "Confirm the .env is no longer tracked: `git status`.",
        completedBy: "git status",
        alternates: [],
        hint: "If .gitignore now lists .env, the file should appear as untracked (not staged).",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "ttu9u0", message: "chore: init project with express" },
      { id: "uuv1v2", message: "feat: add database connection" },
    ]),
  },
  {
    missionId: "git-l29-m2-commit-message-hook",
    title: "Enforce commit standards with hooks",
    topicId: "professional-mastery",
    level: 29,
    orderIndex: 1,
    difficulty: 5,
    xp: 3250,
    steps: [
      {
        id: "step-1",
        instruction: "Hooks live in .git/hooks/. View current repo state: `git status`.",
        completedBy: "git status",
        alternates: [],
        hint: "Git hooks are scripts that run at specific points: pre-commit, commit-msg, pre-push, etc.",
      },
      {
        id: "step-2",
        instruction: "Stage your hook configuration: `git add .`.",
        completedBy: "git add .",
        alternates: ["git add"],
        hint: "You can commit hook configuration files like .husky/ or .lefthook.yml to share them with the team.",
      },
      {
        id: "step-3",
        instruction: "Commit the hook setup: `git commit -m \"chore: add husky pre-commit and commit-msg hooks\"`.",
        completedBy: "git commit -m",
        alternates: [],
        hint: "Shared hooks enforce consistent commit messages and prevent broken code from being committed.",
      },
      {
        id: "step-4",
        instruction: "Review the commit history: `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: ["git log"],
        hint: "Hook configuration is part of your project's developer tooling — it belongs in version control.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "vvw3w4", message: "chore: add eslint and prettier config" },
    ]),
  },
  {
    missionId: "git-l29-m3-ci-workflow-setup",
    title: "Version control your CI workflow",
    topicId: "professional-mastery",
    level: 29,
    orderIndex: 2,
    difficulty: 5,
    xp: 3300,
    steps: [
      {
        id: "step-1",
        instruction: "Stage your GitHub Actions workflow file: `git add .github/workflows/ci.yml`.",
        completedBy: "git add .github/workflows/ci.yml",
        alternates: ["git add .github"],
        hint: "GitHub Actions workflows live at .github/workflows/ — they're just YAML files in your repo.",
      },
      {
        id: "step-2",
        instruction: "Commit the CI workflow: `git commit -m \"ci: add GitHub Actions workflow for tests and lint\"`.",
        completedBy: "git commit -m \"ci:",
        alternates: ["git commit -m"],
        hint: "ci is a conventional commit type for CI/CD configuration changes.",
      },
      {
        id: "step-3",
        instruction: "Check for any untracked config files: `git status`.",
        completedBy: "git status",
        alternates: [],
        hint: "Also commit .github/CODEOWNERS and .github/pull_request_template.md if present.",
      },
      {
        id: "step-4",
        instruction: "Tag the state before your first CI-enforced PR: `git tag v0.1.0-ci`.",
        completedBy: "git tag v0.1.0-ci",
        alternates: ["git tag"],
        hint: "Tagging the CI setup commit makes it easy to reference when debugging pipeline failures.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "wwx5x6", message: "chore: scaffold .github directory" },
    ]),
  },
]

/* ── LEVEL 30 — Git & GitHub King: Pro Capstone ─────────────── */

const level30 = [
  {
    missionId: "git-l30-m1-full-feature-lifecycle",
    title: "Complete feature lifecycle: branch to tag",
    topicId: "professional-mastery",
    level: 30,
    orderIndex: 0,
    difficulty: 6,
    xp: 3800,
    steps: [
      {
        id: "step-1",
        instruction: "Start from a synced main: `git switch main`.",
        completedBy: "git switch main",
        alternates: ["git checkout main"],
        hint: "Always start features from the latest main — avoid building on stale code.",
      },
      {
        id: "step-2",
        instruction: "Create a properly named feature branch: `git switch -c feature/PROJ-250-dashboard-analytics`.",
        completedBy: "git switch -c feature/PROJ-250-dashboard-analytics",
        alternates: ["git checkout -b feature/PROJ-250"],
        hint: "Professional branch naming: type/ticket-description. Tools can auto-link to issue trackers.",
      },
      {
        id: "step-3",
        instruction: "Commit incrementally with conventional format: `git commit -m \"feat(dashboard): add weekly active users chart\"`.",
        completedBy: "git commit -m \"feat(",
        alternates: ["git commit -m \"feat:"],
        hint: "Conventional commits enable automatic changelog generation and semantic versioning.",
      },
      {
        id: "step-4",
        instruction: "Rebase to incorporate any upstream changes: `git rebase main`.",
        completedBy: "git rebase main",
        alternates: ["git rebase"],
        hint: "Rebasing keeps your feature branch linear and conflict-free before the PR.",
      },
      {
        id: "step-5",
        instruction: "Squash WIP commits before PR: `git rebase -i HEAD~3`.",
        completedBy: "git rebase -i HEAD~3",
        alternates: ["git rebase -i"],
        hint: "Clean squashed history makes code review faster and merges cleaner.",
      },
      {
        id: "step-6",
        instruction: "Push your clean branch: `git push -u origin feature/PROJ-250-dashboard-analytics`.",
        completedBy: "git push -u origin feature/PROJ-250",
        alternates: ["git push -u"],
        hint: "Now open your PR on GitHub — the branch is ready for review.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "xxy7y8", message: "release: v3.0.0 production deploy" },
    ]),
  },
  {
    missionId: "git-l30-m2-incident-to-release",
    title: "Production incident to patched release",
    topicId: "professional-mastery",
    level: 30,
    orderIndex: 1,
    difficulty: 6,
    xp: 3900,
    steps: [
      {
        id: "step-1",
        instruction: "Stash active WIP before incident response: `git stash`.",
        completedBy: "git stash",
        alternates: ["git stash push"],
        hint: "Clear your workspace immediately — incident response needs a clean slate.",
      },
      {
        id: "step-2",
        instruction: "Create a hotfix branch: `git switch -c hotfix/v3.0.1-payment-crash`.",
        completedBy: "git switch -c hotfix/v3.0.1-payment-crash",
        alternates: ["git checkout -b hotfix/v3.0.1"],
        hint: "Hotfix branches are cut from main (production) — not from develop or feature branches.",
      },
      {
        id: "step-3",
        instruction: "Commit the critical fix: `git commit -m \"fix(payment)!: handle Stripe webhook timeout on high load\"`.",
        completedBy: "git commit -m \"fix(",
        alternates: ["git commit -m"],
        hint: "! marks a breaking change or critical fix — important for release notes.",
      },
      {
        id: "step-4",
        instruction: "Tag the patch release immediately: `git tag -a v3.0.1 -m \"hotfix: payment webhook timeout fix\"`.",
        completedBy: "git tag -a v3.0.1",
        alternates: ["git tag -a"],
        hint: "Tag immediately after the hotfix commit — before merging back to develop.",
      },
      {
        id: "step-5",
        instruction: "View the incident timeline in the log: `git log --oneline --graph`.",
        completedBy: "git log --oneline --graph",
        alternates: ["git log --graph"],
        hint: "The graph shows the hotfix branch clearly — useful for post-mortem documentation.",
      },
      {
        id: "step-6",
        instruction: "Restore your WIP after the incident is resolved: `git stash pop`.",
        completedBy: "git stash pop",
        alternates: ["git stash apply"],
        hint: "Feature work resumes. Incident response is contained and the trail is clear.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "yyz9z0", message: "release: v3.0.0 — launch day deploy" },
    ]),
  },
  {
    missionId: "git-l30-m3-professional-capstone",
    title: "Git & GitHub King: full professional workflow",
    topicId: "professional-mastery",
    level: 30,
    orderIndex: 2,
    difficulty: 6,
    xp: 4000,
    steps: [
      {
        id: "step-1",
        instruction: "Inspect history with the full audit view: `git log --oneline --graph`.",
        completedBy: "git log --oneline --graph",
        alternates: ["git log --graph"],
        hint: "The graph shows branches, merges, and tags — the full story of your project.",
      },
      {
        id: "step-2",
        instruction: "Cherry-pick a security fix from the hotfix branch: `git cherry-pick zza1b2c`.",
        completedBy: "git cherry-pick zza1b2c",
        alternates: ["git cherry-pick"],
        hint: "Cherry-pick applies the exact fix without merging unrelated commits.",
      },
      {
        id: "step-3",
        instruction: "Stash your current WIP for a context switch: `git stash`.",
        completedBy: "git stash",
        alternates: ["git stash push"],
        hint: "Stash is your professional context-switch tool — never commit WIP to shared branches.",
      },
      {
        id: "step-4",
        instruction: "Commit an emergency fix with conventional format: `git commit -m \"fix(security): patch CSRF token validation\"`.",
        completedBy: "git commit -m \"fix(",
        alternates: ["git commit -m"],
        hint: "fix type with security scope is immediately recognizable in changelogs and release notes.",
      },
      {
        id: "step-5",
        instruction: "Tag the emergency release: `git tag -a v4.0.1 -m \"security patch: CSRF fix\"`.",
        completedBy: "git tag -a v4.0.1",
        alternates: ["git tag -a"],
        hint: "Every production push should have a version tag — non-negotiable in professional teams.",
      },
      {
        id: "step-6",
        instruction: "Restore your feature WIP: `git stash pop`.",
        completedBy: "git stash pop",
        alternates: ["git stash apply"],
        hint: "All done: you've handled an incident, shipped a patch release, and resumed feature work.",
      },
      {
        id: "step-7",
        instruction: "Audit the final state with blame: `git blame README.md`.",
        completedBy: "git blame README.md",
        alternates: ["git blame"],
        hint: "blame closes the loop — every line has an owner, every change has a reason.",
      },
      {
        id: "step-8",
        instruction: "Final check — clean state before end of day: `git status`.",
        completedBy: "git status",
        alternates: [],
        hint: "Always end your session with a clean status check. Ship it, don't stash it — unless intentional.",
      },
    ],
    initialGraphState: mainWithCommits([
      { id: "zzb3c4", message: "feat: complete v4.0.0 release cycle" },
      { id: "zza1b2c", message: "fix(security): CSRF token validation — pre-tested" },
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
  19: level19,
  20: level20,
  21: level21,
  22: level22,
  23: level23,
  24: level24,
  25: level25,
  26: level26,
  27: level27,
  28: level28,
  29: level29,
  30: level30,
}

function getStaticGitMissions(level) {
  return gitMissionsByLevel[level] || null
}

module.exports = {
  gitMissionsByLevel,
  getStaticGitMissions,
}
