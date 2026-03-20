/* ─────────────────────────────────
   Git Simulator Engine
   Handles command parsing and state
   ───────────────────────────────── */

export interface Commit {
  id: string
  message: string
  parent: string | null
  secondParent?: string | null
  branch: string
}

export interface FileEntry {
  name: string
  status: "modified" | "new" | "deleted"
}

export interface HeadRef {
  type: "branch" | "detached"
  ref: string
}

export interface PullRequestState {
  id: number
  title: string
  fromBranch: string
  toBranch: string
  status: "open" | "closed" | "merged"
  checks: "pending" | "passed" | "failed"
  reviewStatus: "pending" | "changes-requested" | "approved"
  mergeStrategy?: "merge" | "squash" | "rebase"
}

export interface ConflictRule {
  sourceBranch: string
  targetBranch: string
  files: string[]
  message?: string
}

export interface ActiveMergeConflict {
  sourceBranch: string
  targetBranch: string
  files: string[]
  message: string
}

export interface GitState {
  commits: Record<string, Commit>
  branches: Record<string, string>
  HEAD: HeadRef
  staging: FileEntry[]
  workingDir: FileEntry[]
  initialized: boolean
  remotes?: Record<string, string>
  upstreams?: Record<string, string>
  pullRequests?: PullRequestState[]
  nextPullRequestId?: number
  conflictRules?: ConflictRule[]
  mergeConflict?: ActiveMergeConflict | null
  stashStack?: FileEntry[][]
  tags?: Record<string, string>
  reflog?: string[]
}

export interface CommandResult {
  output: string
  newState: GitState
  graphChanged: boolean
  stepCompleted: string | null
}

/* Branch color map */
export const BRANCH_COLORS: Record<string, string> = {
  main: "#6366F1",
  master: "#6366F1",
  develop: "#F59E0B",
}

const BRANCH_COLOR_PALETTE = [
  "#22C55E",
  "#EF4444",
  "#3B82F6",
  "#A855F7",
  "#14B8A6",
  "#F97316",
  "#EAB308",
  "#06B6D4",
  "#EC4899",
  "#84CC16",
]

function hashedBranchColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0
  }
  return BRANCH_COLOR_PALETTE[hash % BRANCH_COLOR_PALETTE.length]
}

export function getBranchColor(name: string): string {
  if (BRANCH_COLORS[name]) return BRANCH_COLORS[name]
  if (name.startsWith("origin/")) return "#0EA5E9"
  if (name.startsWith("teammate/")) return "#F97316"
  if (name.startsWith("feature")) return "#22C55E"
  if (name.startsWith("hotfix")) return "#EF4444"
  if (name.startsWith("release")) return "#3B82F6"
  return hashedBranchColor(name)
}

/* Generate short hash */
function shortHash(): string {
  const chars = "0123456789abcdef"
  let hash = ""
  for (let i = 0; i < 7; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)]
  }
  return hash
}

/* Get current branch name */
function currentBranch(state: GitState): string | null {
  return state.HEAD.type === "branch" ? state.HEAD.ref : null
}

/* Get current commit ID */
function currentCommitId(state: GitState): string | null {
  if (state.HEAD.type === "branch") {
    return state.branches[state.HEAD.ref] || null
  }
  return state.HEAD.ref
}

function isAncestor(
  commits: Record<string, Commit>,
  ancestorId: string,
  descendantId: string
): boolean {
  let cursor: string | null = descendantId

  while (cursor && commits[cursor]) {
    if (cursor === ancestorId) {
      return true
    }
    cursor = commits[cursor].parent
  }

  return false
}

function recordReflog(state: GitState, entry: string): GitState {
  const reflog = state.reflog || []
  return {
    ...state,
    reflog: [`${new Date().toISOString()} ${entry}`, ...reflog].slice(0, 50),
  }
}

/* Get commits reachable from a given commit id */
function getCommitChain(
  commits: Record<string, Commit>,
  startId: string | null
): Commit[] {
  const chain: Commit[] = []
  let id = startId
  while (id && commits[id]) {
    chain.push(commits[id])
    id = commits[id].parent
  }
  return chain
}

/* ─── Command Processor ─── */

export function processCommand(
  input: string,
  state: GitState
): CommandResult {
  const trimmed = input.trim()
  const parts = trimmed.split(/\s+/)

  /* Not a git command? */
  if (parts[0] !== "git") {
    return {
      output: `bash: ${parts[0]}: command not found\n(hint: only Git commands are supported in this simulation)`,
      newState: state,
      graphChanged: false,
      stepCompleted: null,
    }
  }

  const sub = parts[1]

  if (!state.initialized && sub !== "init") {
    return {
      output: "fatal: not a git repository (or any of the parent directories): .git",
      newState: state,
      graphChanged: false,
      stepCompleted: null,
    }
  }

  switch (sub) {
    case "init":
      return gitInit(state)
    case "status":
      return gitStatus(state)
    case "add":
      return gitAdd(parts.slice(2), state)
    case "commit":
      return gitCommit(parts.slice(2), trimmed, state)
    case "branch":
      return gitBranch(parts.slice(2), state)
    case "checkout":
      return gitCheckout(parts.slice(2), state)
    case "switch":
      return gitSwitch(parts.slice(2), state)
    case "log":
      return gitLog(parts.slice(2), state)
    case "merge":
      return gitMerge(parts.slice(2), state)
    case "remote":
      return gitRemote(parts.slice(2), fullInputState(state))
    case "fetch":
      return gitFetch(parts.slice(2), fullInputState(state))
    case "pull":
      return gitPull(parts.slice(2), fullInputState(state))
    case "push":
      return gitPush(parts.slice(2), fullInputState(state))
    case "pr":
      return gitPr(parts.slice(2), trimmed, fullInputState(state))
    case "revert":
      return gitRevert(parts.slice(2), fullInputState(state))
    case "reset":
      return gitReset(parts.slice(2), fullInputState(state))
    case "reflog":
      return gitReflog(fullInputState(state))
    case "stash":
      return gitStash(parts.slice(2), fullInputState(state))
    case "tag":
      return gitTag(parts.slice(2), fullInputState(state))
    case "cherry-pick":
      return gitCherryPick(parts.slice(2), fullInputState(state))
    default:
      return {
        output: `git: '${sub}' is not a git command.`,
        newState: state,
        graphChanged: false,
        stepCompleted: null,
      }
  }
}

function fullInputState(state: GitState): GitState {
  return {
    ...state,
    remotes: { ...(state.remotes || {}) },
    upstreams: { ...(state.upstreams || {}) },
    pullRequests: [...(state.pullRequests || [])],
    nextPullRequestId: state.nextPullRequestId || 1,
    conflictRules: [...(state.conflictRules || [])],
    mergeConflict: state.mergeConflict || null,
    stashStack: [...(state.stashStack || [])],
    tags: { ...(state.tags || {}) },
    reflog: [...(state.reflog || [])],
  }
}

/* ─── git init ─── */
function gitInit(state: GitState): CommandResult {
  if (state.initialized) {
    return {
      output: "Reinitialized existing Git repository",
      newState: state,
      graphChanged: false,
      stepCompleted: "git init",
    }
  }
  return {
    output: "Initialized empty Git repository in ~/repo/.git/",
    newState: { ...state, initialized: true },
    graphChanged: false,
    stepCompleted: "git init",
  }
}

/* ─── git status ─── */
function gitStatus(state: GitState): CommandResult {
  const branch = currentBranch(state) || "HEAD detached"
  let output = `On branch ${branch}\n`

  if (state.mergeConflict) {
    output += "\nYou have unmerged paths.\n"
    output += "  (fix conflicts and run \"git add\")\n"
    for (const file of state.mergeConflict.files) {
      output += `\tboth modified:   ${file}\n`
    }
  }

  if (state.staging.length > 0) {
    output += "\nChanges to be committed:\n"
    for (const f of state.staging) {
      output += `  ${f.status}: ${f.name}\n`
    }
  }

  if (state.workingDir.length > 0) {
    output += "\nChanges not staged for commit:\n"
    for (const f of state.workingDir) {
      output += `  ${f.status}: ${f.name}\n`
    }
  }

  if (state.staging.length === 0 && state.workingDir.length === 0) {
    output += "\nnothing to commit, working tree clean"
  }

  return {
    output,
    newState: state,
    graphChanged: false,
    stepCompleted: null,
  }
}

/* ─── git add ─── */
function gitAdd(args: string[], state: GitState): CommandResult {
  if (args.length === 0) {
    return {
      output: "Nothing specified, nothing added.",
      newState: state,
      graphChanged: false,
      stepCompleted: null,
    }
  }

  const newState = { ...state }

  if (args[0] === ".") {
    newState.staging = [...state.staging, ...state.workingDir]
    newState.workingDir = []
  } else {
    const fileName = args[0]
    const file = state.workingDir.find((f) => f.name === fileName)
    if (file) {
      newState.staging = [...state.staging, file]
      newState.workingDir = state.workingDir.filter(
        (f) => f.name !== fileName
      )
    } else {
      return {
        output: `fatal: pathspec '${fileName}' did not match any files`,
        newState: state,
        graphChanged: false,
        stepCompleted: null,
      }
    }
  }

  if (state.mergeConflict) {
    const conflictEntries = state.mergeConflict.files.map((name) => ({
      name,
      status: "modified" as const,
    }))

    newState.staging = [...newState.staging, ...conflictEntries]
    newState.mergeConflict = null
  }

  const cmd = args[0] === "." ? "git add ." : `git add ${args[0]}`
  return {
    output: "",
    newState,
    graphChanged: false,
    stepCompleted: cmd,
  }
}

/* ─── git commit ─── */
function gitCommit(
  _args: string[],
  fullCmd: string,
  state: GitState
): CommandResult {
  /* Parse -m "message" */
  const msgMatch = fullCmd.match(/git commit -m\s+["'](.+?)["']/)
  if (!msgMatch) {
    return {
      output: 'error: switch `m` requires a value\nUsage: git commit -m "message"',
      newState: state,
      graphChanged: false,
      stepCompleted: null,
    }
  }

  if (state.staging.length === 0) {
    return {
      output: "nothing to commit, working tree clean",
      newState: state,
      graphChanged: false,
      stepCompleted: null,
    }
  }

  const message = msgMatch[1]
  const id = shortHash()
  const branch = currentBranch(state) || "HEAD"
  const parentId = currentCommitId(state)

  const newCommit: Commit = {
    id,
    message,
    parent: parentId,
    branch: state.HEAD.type === "branch" ? state.HEAD.ref : "detached",
  }

  const newState: GitState = {
    ...state,
    commits: { ...state.commits, [id]: newCommit },
    branches: {
      ...state.branches,
      ...(state.HEAD.type === "branch"
        ? { [state.HEAD.ref]: id }
        : {}),
    },
    staging: [],
  }

  const withReflog = recordReflog(newState, `commit ${id} ${message}`)

  return {
    output: `[${branch} ${id}] ${message}\n ${state.staging.length} file(s) changed`,
    newState: withReflog,
    graphChanged: true,
    stepCompleted: "git commit -m",
  }
}

/* ─── git branch ─── */
function gitBranch(args: string[], state: GitState): CommandResult {
  /* List branches */
  if (args.length === 0) {
    const branch = currentBranch(state)
    const lines = Object.keys(state.branches).map((b) =>
      b === branch ? `* ${b}` : `  ${b}`
    )
    return {
      output: lines.join("\n"),
      newState: state,
      graphChanged: false,
      stepCompleted: null,
    }
  }

  const name = args[0]
  if (state.branches[name]) {
    return {
      output: `fatal: A branch named '${name}' already exists.`,
      newState: state,
      graphChanged: false,
      stepCompleted: null,
    }
  }

  const commitId = currentCommitId(state)
  const newState: GitState = {
    ...state,
    branches: { ...state.branches, [name]: commitId! },
  }

  return {
    output: "",
    newState,
    graphChanged: true,
    stepCompleted: `git branch ${name}`,
  }
}

/* ─── git checkout ─── */
function gitCheckout(args: string[], state: GitState): CommandResult {
  if (args.length === 0) {
    return {
      output: "error: you must specify a branch or commit",
      newState: state,
      graphChanged: false,
      stepCompleted: null,
    }
  }

  /* -b flag: create + switch */
  if (args[0] === "-b") {
    const name = args[1]
    if (!name) {
      return {
        output: "error: switch `b` requires a value",
        newState: state,
        graphChanged: false,
        stepCompleted: null,
      }
    }
    if (state.branches[name]) {
      return {
        output: `fatal: A branch named '${name}' already exists.`,
        newState: state,
        graphChanged: false,
        stepCompleted: null,
      }
    }

    const commitId = currentCommitId(state)
    const newState: GitState = {
      ...state,
      branches: { ...state.branches, [name]: commitId! },
      HEAD: { type: "branch", ref: name },
    }

    return {
      output: `Switched to a new branch '${name}'`,
      newState,
      graphChanged: true,
      stepCompleted: `git checkout -b ${name}`,
    }
  }

  /* Switch to existing branch */
  const name = args[0]
  if (!state.branches[name]) {
    return {
      output: `error: pathspec '${name}' did not match any file(s) known to git`,
      newState: state,
      graphChanged: false,
      stepCompleted: null,
    }
  }

  const newState: GitState = {
    ...state,
    HEAD: { type: "branch", ref: name },
  }

  return {
    output: `Switched to branch '${name}'`,
    newState,
    graphChanged: true,
    stepCompleted: `git checkout ${name}`,
  }
}

/* ─── git switch ─── */
function gitSwitch(args: string[], state: GitState): CommandResult {
  if (args.length === 0) {
    return {
      output: "error: missing branch name",
      newState: state,
      graphChanged: false,
      stepCompleted: null,
    }
  }

  /* -c flag: create + switch */
  if (args[0] === "-c") {
    const name = args[1]
    if (!name) {
      return {
        output: "error: switch `c` requires a value",
        newState: state,
        graphChanged: false,
        stepCompleted: null,
      }
    }
    if (state.branches[name]) {
      return {
        output: `fatal: A branch named '${name}' already exists.`,
        newState: state,
        graphChanged: false,
        stepCompleted: null,
      }
    }

    const commitId = currentCommitId(state)
    const newState: GitState = {
      ...state,
      branches: { ...state.branches, [name]: commitId! },
      HEAD: { type: "branch", ref: name },
    }

    return {
      output: `Switched to a new branch '${name}'`,
      newState,
      graphChanged: true,
      stepCompleted: `git switch -c ${name}`,
    }
  }

  /* Switch to existing branch */
  const name = args[0]
  if (!state.branches[name]) {
    return {
      output: `fatal: invalid reference: ${name}`,
      newState: state,
      graphChanged: false,
      stepCompleted: null,
    }
  }

  const newState: GitState = {
    ...state,
    HEAD: { type: "branch", ref: name },
  }

  return {
    output: `Switched to branch '${name}'`,
    newState,
    graphChanged: true,
    stepCompleted: `git switch ${name}`,
  }
}

/* ─── git log ─── */
function gitLog(args: string[], state: GitState): CommandResult {
  const commitId = currentCommitId(state)
  const chain = getCommitChain(state.commits, commitId)

  if (args.includes("--oneline")) {
    const lines = chain.map((c) => `${c.id} ${c.message}`)
    return {
      output: lines.join("\n"),
      newState: state,
      graphChanged: false,
      stepCompleted: null,
    }
  }

  const lines = chain.map(
    (c) =>
      `commit ${c.id}\n    ${c.message}\n`
  )
  return {
    output: lines.join("\n"),
    newState: state,
    graphChanged: false,
    stepCompleted: null,
  }
}

/* ─── git merge ─── */
function gitMerge(args: string[], state: GitState): CommandResult {
  if (args[0] === "--abort") {
    if (!state.mergeConflict) {
      return {
        output: "fatal: There is no merge to abort.",
        newState: state,
        graphChanged: false,
        stepCompleted: null,
      }
    }

    return {
      output: "Merge aborted. Working tree restored.",
      newState: {
        ...state,
        mergeConflict: null,
        staging: [],
      },
      graphChanged: false,
      stepCompleted: "git merge --abort",
    }
  }

  if (state.mergeConflict) {
    return {
      output: "error: Merging is not possible because you have unmerged files.",
      newState: state,
      graphChanged: false,
      stepCompleted: null,
    }
  }

  if (args.length === 0) {
    return {
      output: "error: specify a branch to merge",
      newState: state,
      graphChanged: false,
      stepCompleted: null,
    }
  }

  const sourceBranch = args[0]
  if (!state.branches[sourceBranch]) {
    return {
      output: `merge: ${sourceBranch} - not something we can merge`,
      newState: state,
      graphChanged: false,
      stepCompleted: null,
    }
  }

  const targetBranch = currentBranch(state)
  if (!targetBranch) {
    return {
      output: "fatal: not on a branch, cannot merge",
      newState: state,
      graphChanged: false,
      stepCompleted: null,
    }
  }

  const targetCommitId = state.branches[targetBranch]
  const sourceCommitId = state.branches[sourceBranch]

  const conflictRule = (state.conflictRules || []).find(
    (rule) => rule.sourceBranch === sourceBranch && rule.targetBranch === targetBranch
  )

  if (conflictRule) {
    const conflictMessage = conflictRule.message || "Automatic merge failed; fix conflicts and then commit the result."
    return {
      output: `${conflictMessage}\nCONFLICT (content): Merge conflict in ${conflictRule.files.join(", ")}`,
      newState: {
        ...state,
        mergeConflict: {
          sourceBranch,
          targetBranch,
          files: conflictRule.files,
          message: conflictMessage,
        },
      },
      graphChanged: false,
      stepCompleted: null,
    }
  }

  if (targetCommitId === sourceCommitId) {
    return {
      output: "Already up to date.",
      newState: state,
      graphChanged: false,
      stepCompleted: null,
    }
  }

  /* Check if fast-forward is possible */
  const sourceChain = getCommitChain(state.commits, sourceCommitId)
  const canFF = sourceChain.some((c) => c.id === targetCommitId)

  if (canFF) {
    /* Fast-forward */
    const newState: GitState = {
      ...state,
      branches: { ...state.branches, [targetBranch]: sourceCommitId },
    }
    const withReflog = recordReflog(newState, `merge ${sourceBranch} (fast-forward)`)
    return {
      output: `Updating ${targetCommitId.slice(0, 7)}..${sourceCommitId.slice(0, 7)}\nFast-forward`,
      newState: withReflog,
      graphChanged: true,
      stepCompleted: `git merge ${sourceBranch}`,
    }
  }

  /* 3-way merge: create merge commit */
  const id = shortHash()
  const mergeCommit: Commit = {
    id,
    message: `Merge branch '${sourceBranch}' into ${targetBranch}`,
    parent: targetCommitId,
    secondParent: sourceCommitId,
    branch: targetBranch,
  }

  const newState: GitState = {
    ...state,
    commits: { ...state.commits, [id]: mergeCommit },
    branches: { ...state.branches, [targetBranch]: id },
  }
  const withReflog = recordReflog(newState, `merge ${sourceBranch} into ${targetBranch}`)

  return {
    output: `Merge made by the 'ort' strategy.`,
    newState: withReflog,
    graphChanged: true,
    stepCompleted: `git merge ${sourceBranch}`,
  }
}

function gitRemote(args: string[], state: GitState): CommandResult {
  const remotes = state.remotes || {}

  if (args.length === 0) {
    const names = Object.keys(remotes)
    return {
      output: names.length ? names.join("\n") : "",
      newState: state,
      graphChanged: false,
      stepCompleted: null,
    }
  }

  if (args[0] === "-v") {
    const lines = Object.entries(remotes).flatMap(([name, url]) => [
      `${name}\t${url} (fetch)`,
      `${name}\t${url} (push)`,
    ])
    return {
      output: lines.join("\n"),
      newState: state,
      graphChanged: false,
      stepCompleted: "git remote -v",
    }
  }

  if (args[0] === "add") {
    const remoteName = args[1]
    const remoteUrl = args[2]

    if (!remoteName || !remoteUrl) {
      return {
        output: "usage: git remote add <name> <url>",
        newState: state,
        graphChanged: false,
        stepCompleted: null,
      }
    }

    if (remotes[remoteName]) {
      return {
        output: `error: remote ${remoteName} already exists.`,
        newState: state,
        graphChanged: false,
        stepCompleted: null,
      }
    }

    return {
      output: "",
      newState: {
        ...state,
        remotes: {
          ...remotes,
          [remoteName]: remoteUrl,
        },
      },
      graphChanged: false,
      stepCompleted: `git remote add ${remoteName}`,
    }
  }

  return {
    output: `error: unknown remote subcommand '${args[0]}'`,
    newState: state,
    graphChanged: false,
    stepCompleted: null,
  }
}

function gitFetch(args: string[], state: GitState): CommandResult {
  const remote = args[0] || "origin"
  const remotes = state.remotes || {}

  if (!remotes[remote]) {
    return {
      output: `fatal: '${remote}' does not appear to be a git repository`,
      newState: state,
      graphChanged: false,
      stepCompleted: null,
    }
  }

  return {
    output: `From ${remote}\n * fetched remote updates`,
    newState: state,
    graphChanged: false,
    stepCompleted: `git fetch ${remote}`,
  }
}

function gitPull(args: string[], state: GitState): CommandResult {
  const targetBranch = currentBranch(state)
  if (!targetBranch) {
    return {
      output: "fatal: not on a branch, cannot pull",
      newState: state,
      graphChanged: false,
      stepCompleted: null,
    }
  }

  const remote = args[0] || "origin"
  const remoteBranch = args[1] || targetBranch
  const remoteRef = `${remote}/${remoteBranch}`

  if (!state.branches[remoteRef]) {
    return {
      output: `fatal: couldn't find remote ref ${remoteBranch}`,
      newState: state,
      graphChanged: false,
      stepCompleted: null,
    }
  }

  const localTip = state.branches[targetBranch]
  const remoteTip = state.branches[remoteRef]

  if (localTip === remoteTip) {
    return {
      output: "Already up to date.",
      newState: state,
      graphChanged: false,
      stepCompleted: `git pull ${remote} ${remoteBranch}`,
    }
  }

  if (!isAncestor(state.commits, localTip, remoteTip)) {
    return {
      output: "Automatic merge required. Use git merge manually in this simulator.",
      newState: state,
      graphChanged: false,
      stepCompleted: null,
    }
  }

  return {
    output: `Updating ${localTip.slice(0, 7)}..${remoteTip.slice(0, 7)}\nFast-forward`,
    newState: {
      ...state,
      branches: {
        ...state.branches,
        [targetBranch]: remoteTip,
      },
    },
    graphChanged: true,
    stepCompleted: `git pull ${remote} ${remoteBranch}`,
  }
}

function gitPush(args: string[], state: GitState): CommandResult {
  const activeBranch = currentBranch(state)
  if (!activeBranch) {
    return {
      output: "fatal: detached HEAD cannot be pushed in this simulator",
      newState: state,
      graphChanged: false,
      stepCompleted: null,
    }
  }

  let remote = "origin"
  let branch = activeBranch
  let setUpstream = false

  if (args[0] === "--set-upstream" || args[0] === "-u") {
    setUpstream = true
    remote = args[1] || "origin"
    branch = args[2] || activeBranch
  } else {
    remote = args[0] || "origin"
    branch = args[1] || activeBranch
  }

  const remotes = state.remotes || {}
  if (!remotes[remote]) {
    return {
      output: `fatal: '${remote}' does not appear to be a git repository`,
      newState: state,
      graphChanged: false,
      stepCompleted: null,
    }
  }

  const localTip = state.branches[activeBranch]
  const remoteRef = `${remote}/${branch}`
  const remoteTip = state.branches[remoteRef]

  if (remoteTip && !isAncestor(state.commits, remoteTip, localTip)) {
    return {
      output:
        "! [rejected]        push (non-fast-forward)\nerror: failed to push some refs.\nhint: Integrate the remote changes before pushing again.",
      newState: state,
      graphChanged: false,
      stepCompleted: null,
    }
  }

  const nextState: GitState = {
    ...state,
    branches: {
      ...state.branches,
      [remoteRef]: localTip,
    },
  }

  if (setUpstream) {
    nextState.upstreams = {
      ...(state.upstreams || {}),
      [activeBranch]: remoteRef,
    }
  }

  return {
    output: setUpstream
      ? `Branch '${activeBranch}' set up to track '${remoteRef}'.\nTo ${remotes[remote]}\n   ${localTip.slice(0, 7)}..${localTip.slice(0, 7)}  ${branch} -> ${branch}`
      : `To ${remotes[remote]}\n   ${localTip.slice(0, 7)}..${localTip.slice(0, 7)}  ${branch} -> ${branch}`,
    newState: nextState,
    graphChanged: true,
    stepCompleted: setUpstream ? `git push --set-upstream ${remote} ${branch}` : `git push ${remote} ${branch}`,
  }
}

function gitPr(args: string[], fullCmd: string, state: GitState): CommandResult {
  const sub = args[0]

  if (!sub) {
    return {
      output: "usage: git pr <create|status|checks|review|merge>",
      newState: state,
      graphChanged: false,
      stepCompleted: null,
    }
  }

  if (sub === "create") {
    const branch = currentBranch(state)
    if (!branch || branch === "main") {
      return {
        output: "error: create your PR from a feature branch, not main.",
        newState: state,
        graphChanged: false,
        stepCompleted: null,
      }
    }

    const titleMatch = fullCmd.match(/--title\s+["'](.+?)["']/)
    const title = titleMatch?.[1] || `PR: ${branch}`
    const id = state.nextPullRequestId || 1
    const prs = state.pullRequests || []

    const created: PullRequestState = {
      id,
      title,
      fromBranch: branch,
      toBranch: "main",
      status: "open",
      checks: "pending",
      reviewStatus: "pending",
    }

    return {
      output: `Created PR #${id}: ${title}\nChecks: pending · Review: pending`,
      newState: {
        ...state,
        pullRequests: [created, ...prs],
        nextPullRequestId: id + 1,
      },
      graphChanged: false,
      stepCompleted: "git pr create",
    }
  }

  const openPr = (state.pullRequests || []).find((pr) => pr.status === "open")
  if (!openPr) {
    return {
      output: "No open pull request.",
      newState: state,
      graphChanged: false,
      stepCompleted: null,
    }
  }

  if (sub === "status") {
    return {
      output: `PR #${openPr.id} ${openPr.fromBranch} -> ${openPr.toBranch}\nChecks: ${openPr.checks}\nReview: ${openPr.reviewStatus}`,
      newState: state,
      graphChanged: false,
      stepCompleted: "git pr status",
    }
  }

  if (sub === "checks") {
    const updated = {
      ...openPr,
      checks: "passed" as const,
    }
    return {
      output: `PR #${openPr.id} checks passed.`,
      newState: {
        ...state,
        pullRequests: (state.pullRequests || []).map((pr) => (pr.id === openPr.id ? updated : pr)),
      },
      graphChanged: false,
      stepCompleted: "git pr checks",
    }
  }

  if (sub === "review") {
    const decision = args[1]
    if (decision !== "approve" && decision !== "request-changes") {
      return {
        output: "usage: git pr review <approve|request-changes>",
        newState: state,
        graphChanged: false,
        stepCompleted: null,
      }
    }

    const updated = {
      ...openPr,
      reviewStatus: decision === "approve" ? "approved" as const : "changes-requested" as const,
    }

    return {
      output:
        decision === "approve"
          ? `PR #${openPr.id} approved.`
          : `PR #${openPr.id} changes requested. Address comments and push updates.`,
      newState: {
        ...state,
        pullRequests: (state.pullRequests || []).map((pr) => (pr.id === openPr.id ? updated : pr)),
      },
      graphChanged: false,
      stepCompleted: `git pr review ${decision}`,
    }
  }

  if (sub === "merge") {
    if (openPr.checks !== "passed") {
      return {
        output: "Merge blocked: required checks are not passed.",
        newState: state,
        graphChanged: false,
        stepCompleted: null,
      }
    }
    if (openPr.reviewStatus !== "approved") {
      return {
        output: "Merge blocked: PR needs approval.",
        newState: state,
        graphChanged: false,
        stepCompleted: null,
      }
    }

    const strategy = args[1] === "--squash" ? "squash" : args[1] === "--rebase" ? "rebase" : "merge"
    const fromTip = state.branches[openPr.fromBranch]
    const mainTip = state.branches[openPr.toBranch]
    const nextId = shortHash()

    const mergeCommit: Commit = {
      id: nextId,
      message:
        strategy === "squash"
          ? `squash: ${openPr.title}`
          : strategy === "rebase"
            ? `rebase: ${openPr.title}`
            : `Merge PR #${openPr.id}: ${openPr.title}`,
      parent: mainTip,
      ...(strategy === "merge" ? { secondParent: fromTip } : {}),
      branch: openPr.toBranch,
    }

    const closedPr: PullRequestState = {
      ...openPr,
      status: "merged",
      mergeStrategy: strategy,
    }

    const nextState = {
      ...state,
      commits: {
        ...state.commits,
        [nextId]: mergeCommit,
      },
      branches: {
        ...state.branches,
        [openPr.toBranch]: nextId,
        [`origin/${openPr.toBranch}`]: nextId,
      },
      pullRequests: (state.pullRequests || []).map((pr) => (pr.id === openPr.id ? closedPr : pr)),
    }

    return {
      output: `PR #${openPr.id} merged with ${strategy} strategy.`,
      newState: recordReflog(nextState, `pr merge #${openPr.id} ${strategy}`),
      graphChanged: true,
      stepCompleted: "git pr merge",
    }
  }

  return {
    output: `Unknown git pr subcommand '${sub}'.`,
    newState: state,
    graphChanged: false,
    stepCompleted: null,
  }
}

function gitRevert(args: string[], state: GitState): CommandResult {
  const target = args[0]
  if (!target || !state.commits[target]) {
    return {
      output: "usage: git revert <commit>",
      newState: state,
      graphChanged: false,
      stepCompleted: null,
    }
  }

  const branch = currentBranch(state)
  if (!branch) {
    return {
      output: "fatal: detached HEAD cannot create revert commit",
      newState: state,
      graphChanged: false,
      stepCompleted: null,
    }
  }

  const current = state.branches[branch]
  const id = shortHash()
  const commit: Commit = {
    id,
    message: `Revert "${state.commits[target].message}"`,
    parent: current,
    branch,
  }

  const nextState = {
    ...state,
    commits: { ...state.commits, [id]: commit },
    branches: { ...state.branches, [branch]: id },
  }

  return {
    output: `[${branch} ${id}] Revert "${state.commits[target].message}"`,
    newState: recordReflog(nextState, `revert ${target}`),
    graphChanged: true,
    stepCompleted: `git revert ${target}`,
  }
}

function gitReset(args: string[], state: GitState): CommandResult {
  const mode = args[0]
  const target = args[1]
  const branch = currentBranch(state)
  if (!branch) {
    return {
      output: "fatal: detached HEAD reset unsupported in this simulator",
      newState: state,
      graphChanged: false,
      stepCompleted: null,
    }
  }

  if (!["--soft", "--mixed", "--hard"].includes(mode || "")) {
    return {
      output: "usage: git reset <--soft|--mixed|--hard> HEAD~1",
      newState: state,
      graphChanged: false,
      stepCompleted: null,
    }
  }

  const tip = state.branches[branch]
  const parent = state.commits[tip]?.parent
  if (target !== "HEAD~1" || !parent) {
    return {
      output: "Only HEAD~1 reset is supported in this simulator.",
      newState: state,
      graphChanged: false,
      stepCompleted: null,
    }
  }

  const nextState: GitState = {
    ...state,
    branches: {
      ...state.branches,
      [branch]: parent,
    },
  }

  if (mode === "--hard") {
    nextState.staging = []
    nextState.workingDir = []
  }

  if (mode === "--mixed") {
    nextState.staging = []
  }

  return {
    output: `HEAD is now at ${parent.slice(0, 7)} ${state.commits[parent]?.message || ""}`,
    newState: recordReflog(nextState, `reset ${mode} HEAD~1`),
    graphChanged: true,
    stepCompleted: `git reset ${mode}`,
  }
}

function gitReflog(state: GitState): CommandResult {
  const entries = state.reflog || []
  return {
    output: entries.length ? entries.join("\n") : "reflog is empty",
    newState: state,
    graphChanged: false,
    stepCompleted: "git reflog",
  }
}

function gitStash(args: string[], state: GitState): CommandResult {
  const sub = args[0]
  const stashStack = state.stashStack || []

  if (!sub || sub === "push") {
    if (state.workingDir.length === 0 && state.staging.length === 0) {
      return {
        output: "No local changes to save",
        newState: state,
        graphChanged: false,
        stepCompleted: null,
      }
    }

    const entry = [...state.workingDir, ...state.staging]
    return {
      output: `Saved working directory and index state WIP on ${currentBranch(state) || "HEAD"}`,
      newState: {
        ...state,
        stashStack: [entry, ...stashStack],
        workingDir: [],
        staging: [],
      },
      graphChanged: false,
      stepCompleted: "git stash",
    }
  }

  if (sub === "pop") {
    if (stashStack.length === 0) {
      return {
        output: "No stash entries found.",
        newState: state,
        graphChanged: false,
        stepCompleted: null,
      }
    }

    const [top, ...rest] = stashStack
    return {
      output: "Applied stash@{0}",
      newState: {
        ...state,
        stashStack: rest,
        workingDir: [...state.workingDir, ...top],
      },
      graphChanged: false,
      stepCompleted: "git stash pop",
    }
  }

  return {
    output: "usage: git stash [push|pop]",
    newState: state,
    graphChanged: false,
    stepCompleted: null,
  }
}

function gitTag(args: string[], state: GitState): CommandResult {
  const tags = state.tags || {}
  if (args.length === 0) {
    return {
      output: Object.keys(tags).sort().join("\n"),
      newState: state,
      graphChanged: false,
      stepCompleted: "git tag",
    }
  }

  const name = args[0]
  const target = currentCommitId(state)
  if (!target) {
    return {
      output: "fatal: no commit to tag",
      newState: state,
      graphChanged: false,
      stepCompleted: null,
    }
  }

  return {
    output: "",
    newState: {
      ...state,
      tags: {
        ...tags,
        [name]: target,
      },
    },
    graphChanged: false,
    stepCompleted: `git tag ${name}`,
  }
}

function gitCherryPick(args: string[], state: GitState): CommandResult {
  const target = args[0]
  if (!target || !state.commits[target]) {
    return {
      output: "usage: git cherry-pick <commit>",
      newState: state,
      graphChanged: false,
      stepCompleted: null,
    }
  }

  const branch = currentBranch(state)
  if (!branch) {
    return {
      output: "fatal: detached HEAD cherry-pick unsupported in this simulator",
      newState: state,
      graphChanged: false,
      stepCompleted: null,
    }
  }

  const id = shortHash()
  const commit: Commit = {
    id,
    message: `cherry-pick: ${state.commits[target].message}`,
    parent: state.branches[branch],
    branch,
  }

  const nextState = {
    ...state,
    commits: {
      ...state.commits,
      [id]: commit,
    },
    branches: {
      ...state.branches,
      [branch]: id,
    },
  }

  return {
    output: `[${branch} ${id}] cherry-pick: ${state.commits[target].message}`,
    newState: recordReflog(nextState, `cherry-pick ${target}`),
    graphChanged: true,
    stepCompleted: `git cherry-pick ${target}`,
  }
}
