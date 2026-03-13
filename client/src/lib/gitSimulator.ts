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

export interface GitState {
  commits: Record<string, Commit>
  branches: Record<string, string>
  HEAD: HeadRef
  staging: FileEntry[]
  workingDir: FileEntry[]
  initialized: boolean
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

export function getBranchColor(name: string): string {
  if (BRANCH_COLORS[name]) return BRANCH_COLORS[name]
  if (name.startsWith("feature")) return "#22C55E"
  if (name.startsWith("hotfix")) return "#EF4444"
  if (name.startsWith("release")) return "#3B82F6"
  return "#8B5CF6"
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
    default:
      return {
        output: `git: '${sub}' is not a git command.`,
        newState: state,
        graphChanged: false,
        stepCompleted: null,
      }
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

  return {
    output: `[${branch} ${id}] ${message}\n ${state.staging.length} file(s) changed`,
    newState,
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
    return {
      output: `Updating ${targetCommitId.slice(0, 7)}..${sourceCommitId.slice(0, 7)}\nFast-forward`,
      newState,
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

  return {
    output: `Merge made by the 'ort' strategy.`,
    newState,
    graphChanged: true,
    stepCompleted: `git merge ${sourceBranch}`,
  }
}
