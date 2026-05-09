// client/src/lib/realGit/commandRouter.ts
//
// Parses user-typed git commands and dispatches to isomorphic-git.
// Returns plain text output formatted to look like real git's stdout.

import * as git from "isomorphic-git"
import * as diff from "diff"
import type { RepoContext } from "./types"
import { DEFAULT_AUTHOR } from "./createRepo"

interface TrainerMeta {
  remotes: Record<string, string>
  upstreams: Record<string, string>
  remoteTips: Record<string, string>
  tags: Record<string, string>
  bisect: {
    active: boolean
    badRef: string | null
    goodRefs: string[]
  }
}

const trainerMeta = new WeakMap<RepoContext, TrainerMeta>()

function getTrainerMeta(ctx: RepoContext): TrainerMeta {
  const existing = trainerMeta.get(ctx)
  if (existing) return existing

  const created: TrainerMeta = {
    remotes: {},
    upstreams: {},
    remoteTips: {},
    tags: {},
    bisect: {
      active: false,
      badRef: null,
      goodRefs: [],
    },
  }

  trainerMeta.set(ctx, created)
  return created
}

export interface CommandResult {
  output: string
  outputType: "normal" | "success" | "error"
}

/* ── Tokenizer ───────────────────────────────────────────────── */

/**
 * Quote-aware tokenizer. Handles:
 *   git commit -m "add new feature"      → ["commit", "-m", "add new feature"]
 *   git commit -m 'fix the bug'          → ["commit", "-m", "fix the bug"]
 *   git add .                            → ["add", "."]
 *
 * Strips a leading "git" if present.
 */
function tokenize(input: string): string[] {
  const tokens: string[] = []
  let current = ""
  let quote: '"' | "'" | null = null

  for (let i = 0; i < input.length; i++) {
    const ch = input[i]
    if (quote) {
      if (ch === quote) {
        quote = null
      } else {
        current += ch
      }
      continue
    }
    if (ch === '"' || ch === "'") {
      quote = ch as '"' | "'"
      continue
    }
    if (ch === " " || ch === "\t") {
      if (current) {
        tokens.push(current)
        current = ""
      }
      continue
    }
    current += ch
  }
  if (current) tokens.push(current)

  if (tokens[0] === "git") tokens.shift()
  return tokens
}

/* ── Helpers ─────────────────────────────────────────────────── */

const STARTER_FILE = "README.md"

/**
 * Make sure the repo has at least one editable file in the working tree.
 * Called after init and before stage operations so the user always has
 * something to add/commit.
 */
async function ensureStarterFile(ctx: RepoContext) {
  const path = `${ctx.dir}/${STARTER_FILE}`
  try {
    await ctx.fs.promises.stat(path)
  } catch {
    await ctx.fs.promises.writeFile(path, "# CodeKing\n\nedit me\n")
  }
}

/**
 * Append a synthetic edit to the starter file so the next `add` has
 * something to stage. The user types `git add .` and it always works,
 * even though they never explicitly edited a file in the UI.
 */
async function bumpStarterFile(ctx: RepoContext) {
  await ensureStarterFile(ctx)
  ctx.editCounter.value += 1
  const path = `${ctx.dir}/${STARTER_FILE}`
  const existing = await ctx.fs.promises.readFile(path, "utf8")
  await ctx.fs.promises.writeFile(
    path,
    `${existing}\n- edit ${ctx.editCounter.value}`
  )
}

/**
 * Translate a possibly-fake SHA in user input into the corresponding
 * real isomorphic-git SHA. Falls back to the input as-is.
 */
function resolveAlias(maybeFake: string, ctx: RepoContext): string {
  return ctx.fakeToReal[maybeFake] || maybeFake
}

function displayId(realSha: string, ctx: RepoContext): string {
  return ctx.realToFake[realSha] || realSha.slice(0, 7)
}

async function listChangedFiles(ctx: RepoContext): Promise<string[]> {
  const matrix = await git.statusMatrix({ fs: ctx.fs, dir: ctx.dir })
  return matrix
    .filter(([, head, workdir, stage]) => head !== workdir || workdir !== stage)
    .map(([file]) => file)
}

/* ── Command handlers ────────────────────────────────────────── */

async function handleInit(ctx: RepoContext): Promise<CommandResult> {
  await git.init({ fs: ctx.fs, dir: ctx.dir, defaultBranch: "main" })
  await ensureStarterFile(ctx)
  return {
    output: `Initialized empty Git repository in ${ctx.dir}/.git/`,
    outputType: "success",
  }
}

async function handleStatus(ctx: RepoContext): Promise<CommandResult> {
  const branch =
    (await git.currentBranch({ fs: ctx.fs, dir: ctx.dir, fullname: false })) ||
    "main"

  const matrix = await git.statusMatrix({ fs: ctx.fs, dir: ctx.dir })

  const untracked: string[] = []
  const modified: string[] = []
  const staged: string[] = []

  for (const [file, head, workdir, stage] of matrix) {
    if (head === 0 && workdir === 2 && stage === 0) {
      untracked.push(file)
    } else if (head === 0 && workdir === 2 && stage === 2) {
      staged.push(file) // newly staged file
    } else if (head === 1 && workdir === 2 && stage === 1) {
      modified.push(file)
    } else if (head === 1 && workdir === 2 && stage === 2) {
      staged.push(file) // staged modification
    }
  }

  let output = `On branch ${branch}\n`

  if (staged.length === 0 && modified.length === 0 && untracked.length === 0) {
    output += "nothing to commit, working tree clean"
    return { output, outputType: "normal" }
  }

  if (staged.length > 0) {
    output += "\nChanges to be committed:\n"
    for (const f of staged) output += `  staged:    ${f}\n`
  }
  if (modified.length > 0) {
    output += "\nChanges not staged for commit:\n"
    for (const f of modified) output += `  modified:  ${f}\n`
  }
  if (untracked.length > 0) {
    output += "\nUntracked files:\n"
    for (const f of untracked) output += `  ${f}\n`
  }

  return { output: output.trimEnd(), outputType: "normal" }
}

async function handleAdd(
  ctx: RepoContext,
  args: string[]
): Promise<CommandResult> {
  const target = args[0]
  if (!target) {
    return { output: "Nothing specified, nothing added.", outputType: "error" }
  }

  // Auto-edit so users always have something to stage.
  await bumpStarterFile(ctx)

  if (target === "." || target === "-A" || target === "--all") {
    const files = await listChangedFiles(ctx)
    if (files.length === 0) {
      return { output: "", outputType: "normal" }
    }
    for (const file of files) {
      await git.add({ fs: ctx.fs, dir: ctx.dir, filepath: file })
    }
    return { output: "", outputType: "normal" }
  }

  try {
    await git.add({ fs: ctx.fs, dir: ctx.dir, filepath: target })
    return { output: "", outputType: "normal" }
  } catch {
    return {
      output: `fatal: pathspec '${target}' did not match any files`,
      outputType: "error",
    }
  }
}

async function handleCommit(
  ctx: RepoContext,
  args: string[]
): Promise<CommandResult> {
  const mIdx = args.indexOf("-m")
  if (mIdx === -1 || !args[mIdx + 1]) {
    return {
      output: "Aborting commit due to empty commit message.",
      outputType: "error",
    }
  }
  const message = args[mIdx + 1]

  // If there's nothing staged, auto-stage so the commit can land.
  // (The user typed "git commit -m ..." which implies intent to commit.)
  const matrix = await git.statusMatrix({ fs: ctx.fs, dir: ctx.dir })
  const hasStaged = matrix.some(([, head, , stage]) => head !== stage)
  if (!hasStaged) {
    await bumpStarterFile(ctx)
    const files = await listChangedFiles(ctx)
    for (const file of files) {
      await git.add({ fs: ctx.fs, dir: ctx.dir, filepath: file })
    }
  }

  try {
    const sha = await git.commit({
      fs: ctx.fs,
      dir: ctx.dir,
      message,
      author: DEFAULT_AUTHOR,
    })
    const branch =
      (await git.currentBranch({
        fs: ctx.fs,
        dir: ctx.dir,
        fullname: false,
      })) || "main"
    return {
      output: `[${branch} ${displayId(sha, ctx)}] ${message}`,
      outputType: "success",
    }
  } catch (err) {
    return {
      output: `error: ${(err as Error).message}`,
      outputType: "error",
    }
  }
}

async function handleLog(
  ctx: RepoContext,
  args: string[]
): Promise<CommandResult> {
  const oneline = args.includes("--oneline")
  try {
    const log = await git.log({ fs: ctx.fs, dir: ctx.dir })
    if (log.length === 0) {
      return {
        output: "fatal: your current branch does not have any commits yet",
        outputType: "error",
      }
    }
    const output = log
      .map((entry) => {
        const id = displayId(entry.oid, ctx)
        const msg = entry.commit.message.trim()
        if (oneline) return `${id} ${msg}`
        const author = entry.commit.author
        return `commit ${entry.oid}\nAuthor: ${author.name} <${author.email}>\n\n    ${msg}\n`
      })
      .join(oneline ? "\n" : "\n")
    return { output, outputType: "normal" }
  } catch (err) {
    return {
      output: `fatal: ${(err as Error).message}`,
      outputType: "error",
    }
  }
}

async function handleBranch(
  ctx: RepoContext,
  args: string[]
): Promise<CommandResult> {
  const meta = getTrainerMeta(ctx)

  /* ── git branch (list local) ─────────────────────────── */
  if (args.length === 0) {
    const branches = await git.listBranches({ fs: ctx.fs, dir: ctx.dir })
    const current = await git.currentBranch({ fs: ctx.fs, dir: ctx.dir, fullname: false })
    const lines = branches.map((b) => (b === current ? `* ${b}` : `  ${b}`))
    return { output: lines.join("\n"), outputType: "normal" }
  }

  /* ── git branch -v (list with last commit) ───────────── */
  if (args[0] === "-v" || args[0] === "--verbose") {
    const branches = await git.listBranches({ fs: ctx.fs, dir: ctx.dir })
    const current = await git.currentBranch({ fs: ctx.fs, dir: ctx.dir, fullname: false })
    const lines: string[] = []
    for (const b of branches) {
      try {
        const tip = await git.resolveRef({ fs: ctx.fs, dir: ctx.dir, ref: b })
        const commit = await git.readCommit({ fs: ctx.fs, dir: ctx.dir, oid: tip })
        const id = displayId(tip, ctx)
        const msg = commit.commit.message.trim().slice(0, 50)
        const prefix = b === current ? "* " : "  "
        lines.push(`${prefix}${b.padEnd(28)} ${id} ${msg}`)
      } catch {
        lines.push(`  ${b}`)
      }
    }
    return { output: lines.join("\n"), outputType: "normal" }
  }

  /* ── git branch -a (list local + remote tracking) ───── */
  if (args[0] === "-a" || args[0] === "--all") {
    const branches = await git.listBranches({ fs: ctx.fs, dir: ctx.dir })
    const current = await git.currentBranch({ fs: ctx.fs, dir: ctx.dir, fullname: false })
    const localLines = branches.map((b) => (b === current ? `* ${b}` : `  ${b}`))
    const remoteLines = Object.keys(meta.remoteTips).map((ref) => `  remotes/${ref}`)
    const allLines = [...localLines, ...remoteLines]
    return { output: allLines.join("\n") || "(no branches)", outputType: "normal" }
  }

  /* ── git branch -d <name>  or  -D <name> (delete) ───── */
  if (args[0] === "-d" || args[0] === "-D") {
    const name = args[1]
    if (!name) return { output: "fatal: branch name required", outputType: "error" }
    const current = await git.currentBranch({ fs: ctx.fs, dir: ctx.dir, fullname: false })
    if (name === current) {
      return { output: `error: Cannot delete branch '${name}' checked out at '${ctx.dir}'`, outputType: "error" }
    }
    try {
      await git.deleteBranch({ fs: ctx.fs, dir: ctx.dir, ref: name })
      return { output: `Deleted branch ${name}.`, outputType: "success" }
    } catch {
      return { output: `error: branch '${name}' not found.`, outputType: "error" }
    }
  }

  /* ── git branch <name>  (create) ────────────────────── */
  const name = args[0]
  try {
    await git.branch({ fs: ctx.fs, dir: ctx.dir, ref: name })
    return { output: "", outputType: "normal" }
  } catch (err) {
    return {
      output: `fatal: ${(err as Error).message}`,
      outputType: "error",
    }
  }
}

async function handleCheckoutOrSwitch(
  ctx: RepoContext,
  args: string[]
): Promise<CommandResult> {
  // Forms:
  //   git checkout <branch>
  //   git checkout -b <branch>
  //   git switch <branch>
  //   git switch -c <branch>
  let createFlag = false
  let target: string | null = null
  for (const arg of args) {
    if (arg === "-b" || arg === "-c") createFlag = true
    else if (!arg.startsWith("-") && !target) target = arg
  }
  if (!target) {
    return {
      output: "fatal: missing branch name",
      outputType: "error",
    }
  }
  try {
    if (createFlag) {
      await git.branch({ fs: ctx.fs, dir: ctx.dir, ref: target, checkout: true })
      return {
        output: `Switched to a new branch '${target}'`,
        outputType: "success",
      }
    }
    await git.checkout({ fs: ctx.fs, dir: ctx.dir, ref: target })
    return {
      output: `Switched to branch '${target}'`,
      outputType: "success",
    }
  } catch (err) {
    return {
      output: `error: ${(err as Error).message}`,
      outputType: "error",
    }
  }
}

async function handleReset(
  ctx: RepoContext,
  args: string[]
): Promise<CommandResult> {
  // Supported: git reset <--soft|--mixed|--hard> HEAD~1
  const mode = args.find((a) => a.startsWith("--")) || "--mixed"
  const target = args.find((a) => !a.startsWith("--")) || "HEAD~1"

  if (!["--soft", "--mixed", "--hard"].includes(mode)) {
    return {
      output: `usage: git reset <--soft|--mixed|--hard> HEAD~1`,
      outputType: "error",
    }
  }
  if (target !== "HEAD~1") {
    return {
      output: "Only HEAD~1 reset is supported in this trainer.",
      outputType: "error",
    }
  }

  const branch = await git.currentBranch({
    fs: ctx.fs,
    dir: ctx.dir,
    fullname: false,
  })
  if (!branch) {
    return {
      output: "fatal: detached HEAD reset unsupported",
      outputType: "error",
    }
  }

  try {
    const tipSha = await git.resolveRef({ fs: ctx.fs, dir: ctx.dir, ref: branch })
    const tipCommit = await git.readCommit({
      fs: ctx.fs,
      dir: ctx.dir,
      oid: tipSha,
    })
    const parentSha = tipCommit.commit.parent[0]
    if (!parentSha) {
      return {
        output: "fatal: cannot reset — no parent commit",
        outputType: "error",
      }
    }

    // Move the branch ref back one commit.
    await git.writeRef({
      fs: ctx.fs,
      dir: ctx.dir,
      ref: `refs/heads/${branch}`,
      value: parentSha,
      force: true,
    })

    if (mode === "--hard") {
      // Update HEAD/working dir to match the parent commit.
      await git.checkout({ fs: ctx.fs, dir: ctx.dir, ref: branch, force: true })
    }
    // For --soft and --mixed we leave the working tree alone.
    // (Auto-edit logic ensures users always have something to re-stage.)

    const undoneId = displayId(tipSha, ctx)
    return {
      output: `HEAD is now at ${displayId(parentSha, ctx)} (reset, undid ${undoneId})`,
      outputType: "success",
    }
  } catch (err) {
    return {
      output: `fatal: ${(err as Error).message}`,
      outputType: "error",
    }
  }
}

async function handleRevert(
  ctx: RepoContext,
  args: string[]
): Promise<CommandResult> {
  const targetArg = args[0]
  if (!targetArg) {
    return { output: "usage: git revert <commit>", outputType: "error" }
  }
  const realSha = resolveAlias(targetArg, ctx)

  try {
    const target = await git.readCommit({
      fs: ctx.fs,
      dir: ctx.dir,
      oid: realSha,
    })
    const branch = await git.currentBranch({
      fs: ctx.fs,
      dir: ctx.dir,
      fullname: false,
    })
    if (!branch) {
      return {
        output: "fatal: detached HEAD cannot create revert commit",
        outputType: "error",
      }
    }

    // Synthetic revert: create a new commit on the current branch with a
    // "Revert ..." message. Like the simulator, we don't actually try to
    // invert the diff — for the learning UI, the *intent* is what matters.
    await bumpStarterFile(ctx)
    const files = await listChangedFiles(ctx)
    for (const file of files) {
      await git.add({ fs: ctx.fs, dir: ctx.dir, filepath: file })
    }

    const newSha = await git.commit({
      fs: ctx.fs,
      dir: ctx.dir,
      message: `Revert "${target.commit.message.trim()}"`,
      author: DEFAULT_AUTHOR,
    })

    return {
      output: `[${branch} ${displayId(newSha, ctx)}] Revert "${target.commit.message.trim()}"`,
      outputType: "success",
    }
  } catch {
    return {
      output: `fatal: bad revision '${targetArg}'`,
      outputType: "error",
    }
  }
}

async function handleMerge(
  ctx: RepoContext,
  args: string[]
): Promise<CommandResult> {
  const targetBranch = args.find(a => !a.startsWith("-"))
  if (!targetBranch) {
    return { output: "error: specify a branch to merge", outputType: "error" }
  }

  const current = await git.currentBranch({
    fs: ctx.fs,
    dir: ctx.dir,
    fullname: false,
  })
  
  if (!current) {
    return {
      output: "fatal: not on a branch, cannot merge",
      outputType: "error",
    }
  }

  try {
    const result = await git.merge({
      fs: ctx.fs,
      dir: ctx.dir,
      ours: current,
      theirs: targetBranch,
      author: DEFAULT_AUTHOR,
    })

    if (result.alreadyMerged) {
      return { output: "Already up to date.", outputType: "normal" }
    }
    
    // Fast-forward or 3-way merge
    if (result.fastForward) {
      return { output: `Updating\nFast-forward`, outputType: "success" }
    }
    return { output: `Merge made by the 'ort' strategy.`, outputType: "success" }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    const name =
      typeof error === "object" && error !== null && "name" in error
        ? String((error as { name?: string }).name)
        : ""
    const code =
      typeof error === "object" && error !== null && "code" in error
        ? String((error as { code?: string }).code)
        : ""

    if (name === "MergeNotSupportedError" || code === "MergeNotSupportedError" || message.includes("conflict")) {
       return {
         output: `CONFLICT (content): Merge conflict\nAutomatic merge failed; fix conflicts and then commit the result.`,
         outputType: "error"
       }
    }
    return {
      output: `merge: ${targetBranch} - not something we can merge (${message})`,
      outputType: "error",
    }
  }
}

async function handleDiff(
  ctx: RepoContext,
  args: string[]
): Promise<CommandResult> {
  const isStaged = args.includes("--staged") || args.includes("--cached")
  const matrix = await git.statusMatrix({ fs: ctx.fs, dir: ctx.dir })

  let output = ""
  for (const [filepath, head, workdir, stage] of matrix) {
    const isTarget = isStaged ? head !== stage : stage !== workdir
    if (isTarget && workdir === 2) {
      let headContent = ""
      try {
        if (head === 1) {
          const { blob } = await git.readBlob({ fs: ctx.fs, dir: ctx.dir, oid: "HEAD", filepath })
          headContent = new TextDecoder().decode(blob)
        }
      } catch {
        // Ignore missing HEAD blob content and keep generating a best-effort diff.
      }
      const workContent = await ctx.fs.promises.readFile(`${ctx.dir}/${filepath}`, "utf8")
      // fallback in case diff library isn't loaded properly at runtime
      if (diff && diff.createTwoFilesPatch) {
         const patch = diff.createTwoFilesPatch(`a/${filepath}`, `b/${filepath}`, headContent, workContent, "", "", { context: 3 })
         output += patch.split('\\n').filter(l => !l.startsWith('===')).join('\\n') + "\\n"
      } else {
         output += `diff --git a/${filepath} b/${filepath}\\n--- a/${filepath}\\n+++ b/${filepath}\\n`
      }
    }
  }
  return { output: output.trim() || "", outputType: "normal" }
}

async function handleRestore(
  ctx: RepoContext,
  args: string[]
): Promise<CommandResult> {
  const files = args.filter(a => !a.startsWith("-"))
  if (files.length === 0) return { output: "error: you must specify path(s) to restore", outputType: "error" }

  const isStaged = args.includes("--staged")

  for (const file of files) {
    if (file === ".") continue 
    try {
      if (isStaged) {
         await git.resetIndex({ fs: ctx.fs, dir: ctx.dir, filepath: file })
      } else {
         await git.checkout({ fs: ctx.fs, dir: ctx.dir, filepaths: [file], force: true })
      }
    } catch {
      // Ignore restore failures for non-existent files in this training environment.
    }
  }
  return { output: "", outputType: "normal" }
}

async function handleCherryPick(
  ctx: RepoContext,
  args: string[]
): Promise<CommandResult> {
  const target = args[0]
  if (!target) return { output: "usage: git cherry-pick <commit>", outputType: "error" }
  
  const realSha = resolveAlias(target, ctx)
  try {
    const commit = await git.readCommit({ fs: ctx.fs, dir: ctx.dir, oid: realSha })
    await bumpStarterFile(ctx)
    for (const f of await listChangedFiles(ctx)) await git.add({ fs: ctx.fs, dir: ctx.dir, filepath: f })
    
    const newSha = await git.commit({
      fs: ctx.fs,
      dir: ctx.dir,
      message: commit.commit.message,
      author: DEFAULT_AUTHOR,
    })
    
    const branch = await git.currentBranch({ fs: ctx.fs, dir: ctx.dir, fullname: false }) || "HEAD"
    return {
      output: `[${branch} ${displayId(newSha, ctx)}] ${commit.commit.message.trim()}`,
      outputType: "success"
    }
  } catch {
    return { output: `fatal: bad object ${target}`, outputType: "error" }
  }
}

async function handleStash(
  ctx: RepoContext,
  args: string[]
): Promise<CommandResult> {
  const sub = args[0] || "push"
  
  if (sub === "push" || sub === "save") {
    // Simulate drop changes
    const branch = await git.currentBranch({ fs: ctx.fs, dir: ctx.dir, fullname: false })
    if (branch) await git.checkout({ fs: ctx.fs, dir: ctx.dir, ref: branch, force: true })
    return { output: "Saved working directory and index state WIP", outputType: "success" }
  } else if (sub === "pop" || sub === "apply") {
    await bumpStarterFile(ctx)
    for (const f of await listChangedFiles(ctx)) await git.add({ fs: ctx.fs, dir: ctx.dir, filepath: f })
    return { output: "Dropped refs/stash@{0}\\nApplied stash", outputType: "success" }
  }
  
  return { output: `usage: git stash [push | pop | apply]`, outputType: "error" }
}

async function handleReflog(
  ctx: RepoContext,
  args: string[]
): Promise<CommandResult> {
  void args
  try {
    const log = await ctx.fs.promises.readFile(`${ctx.dir}/.git/logs/HEAD`, "utf8")
    const lines = log.trim().split("\\n").reverse()
    const final = lines.map((l: string, i: number) => {
        const parts = l.split('\\t')
        if (parts.length < 2) return ""
        const hash = parts[0].split(' ')[1]
        return `${displayId(hash, ctx)} HEAD@{${i}}: ${parts[1]}`
    }).filter(Boolean).join("\\n")
    return { output: final, outputType: "normal" }
  } catch {
    return { output: "", outputType: "normal" }
  }
}

async function handleRebase(
  ctx: RepoContext,
  args: string[]
): Promise<CommandResult> {
  if (args.includes("--continue")) {
    const branch =
      (await git.currentBranch({ fs: ctx.fs, dir: ctx.dir, fullname: false })) ||
      "HEAD"
    return {
      output: `Successfully rebased and updated refs/heads/${branch}.`,
      outputType: "success",
    }
  }

  const target = args.find(a => !a.startsWith("-"))
  const isInteractive = args.includes("-i") || args.includes("--interactive")
  
  if (!target) return { output: "usage: git rebase <branch>", outputType: "error" }

  const branch = await git.currentBranch({ fs: ctx.fs, dir: ctx.dir, fullname: false })
  if (!branch) return { output: "fatal: not on a branch", outputType: "error" }

  const meta = getTrainerMeta(ctx)
  const targetSha = resolveAlias(meta.remoteTips[target] || target, ctx)
  try {
    await git.readCommit({ fs: ctx.fs, dir: ctx.dir, oid: targetSha })
    
    // Simple MVP: Fast-forward type rebase or simulate rebased commits
    await git.writeRef({ fs: ctx.fs, dir: ctx.dir, ref: `refs/heads/${branch}`, value: targetSha, force: true })
    await git.checkout({ fs: ctx.fs, dir: ctx.dir, ref: branch, force: true })
    
    await bumpStarterFile(ctx)
    for (const f of await listChangedFiles(ctx)) {
       await git.add({ fs: ctx.fs, dir: ctx.dir, filepath: f })
    }
    
    await git.commit({ fs: ctx.fs, dir: ctx.dir, message: `Rebased commits on ${target}`, author: DEFAULT_AUTHOR })

    if (isInteractive) {
       return { output: `Successfully rebased and updated refs/heads/${branch}.\\n(Interactive rebase squashes applied)`, outputType: "success" }
    }
    return { output: `Successfully rebased and updated refs/heads/${branch}.`, outputType: "success" }
  } catch {
    return { output: `fatal: invalid upstream '${target}'`, outputType: "error" }
  }
}

async function handleRemote(
  ctx: RepoContext,
  args: string[]
): Promise<CommandResult> {
  const meta = getTrainerMeta(ctx)
  const sub = args[0]

  if (!sub || sub === "-v") {
    const names = Object.keys(meta.remotes)
    if (names.length === 0) {
      return { output: "", outputType: "normal" }
    }
    const rows = names.flatMap((name) => {
      const url = meta.remotes[name]
      return [`${name}\t${url} (fetch)`, `${name}\t${url} (push)`]
    })
    return { output: rows.join("\n"), outputType: "normal" }
  }

  if (sub === "add") {
    const name = args[1]
    const url = args[2]
    if (!name || !url) {
      return { output: "usage: git remote add <name> <url>", outputType: "error" }
    }
    if (meta.remotes[name]) {
      return { output: `error: remote ${name} already exists.`, outputType: "error" }
    }
    meta.remotes[name] = url
    return { output: "", outputType: "normal" }
  }

  return { output: `error: unknown remote subcommand '${sub}'`, outputType: "error" }
}

async function handleFetch(
  ctx: RepoContext,
  args: string[]
): Promise<CommandResult> {
  const meta = getTrainerMeta(ctx)
  const remote = args[0] || "origin"
  const url = meta.remotes[remote]
  if (!url) {
    return {
      output: `fatal: '${remote}' does not appear to be a git repository`,
      outputType: "error",
    }
  }

  const branches = await git.listBranches({ fs: ctx.fs, dir: ctx.dir })
  for (const branch of branches) {
    try {
      const tip = await git.resolveRef({ fs: ctx.fs, dir: ctx.dir, ref: branch })
      meta.remoteTips[`${remote}/${branch}`] = tip
    } catch {
      // ignore branches without tips
    }
  }

  const summaryBranch = branches.includes("main") ? "main" : branches[0] || "main"
  return {
    output: `From ${url}\n * [new branch]      ${summaryBranch} -> ${remote}/${summaryBranch}`,
    outputType: "success",
  }
}

async function handlePull(
  ctx: RepoContext,
  args: string[]
): Promise<CommandResult> {
  const remote = args[0] || "origin"
  const branchArg = args[1]
  const fetchResult = await handleFetch(ctx, [remote])
  if (fetchResult.outputType === "error") {
    return fetchResult
  }

  const current = await git.currentBranch({ fs: ctx.fs, dir: ctx.dir, fullname: false })
  const branch = branchArg || current || "main"
  return {
    output: `${fetchResult.output}\nAlready up to date with ${remote}/${branch}.`,
    outputType: "success",
  }
}

async function handlePush(
  ctx: RepoContext,
  args: string[]
): Promise<CommandResult> {
  const meta = getTrainerMeta(ctx)
  const currentBranch =
    (await git.currentBranch({ fs: ctx.fs, dir: ctx.dir, fullname: false })) || "main"

  const setUpstream = args.includes("-u") || args.includes("--set-upstream")
  const nonFlags = args.filter((a) => !a.startsWith("-"))
  const remote = nonFlags[0] || "origin"
  const targetBranch = nonFlags[1] || currentBranch

  if (!meta.remotes[remote]) {
    return {
      output: `fatal: '${remote}' does not appear to be a git repository`,
      outputType: "error",
    }
  }

  try {
    const tip = await git.resolveRef({ fs: ctx.fs, dir: ctx.dir, ref: currentBranch })
    meta.remoteTips[`${remote}/${targetBranch}`] = tip
  } catch {
    // ignore tip update failures
  }

  if (setUpstream) {
    meta.upstreams[currentBranch] = `${remote}/${targetBranch}`
    return {
      output: `branch '${currentBranch}' set up to track '${remote}/${targetBranch}'.\nEverything up-to-date`,
      outputType: "success",
    }
  }

  return {
    output: `Everything up-to-date\nTo ${meta.remotes[remote]}`,
    outputType: "success",
  }
}

async function handleTag(
  ctx: RepoContext,
  args: string[]
): Promise<CommandResult> {
  const meta = getTrainerMeta(ctx)
  const name = args[0]

  if (!name) {
    return { output: Object.keys(meta.tags).sort().join("\n"), outputType: "normal" }
  }

  if (meta.tags[name]) {
    return { output: `fatal: tag '${name}' already exists`, outputType: "error" }
  }

  try {
    const branch = await git.currentBranch({ fs: ctx.fs, dir: ctx.dir, fullname: false })
    const ref = branch || "HEAD"
    const tip = await git.resolveRef({ fs: ctx.fs, dir: ctx.dir, ref })
    meta.tags[name] = tip
  } catch {
    meta.tags[name] = ""
  }

  return { output: "", outputType: "normal" }
}

async function handleBlame(
  ctx: RepoContext,
  args: string[]
): Promise<CommandResult> {
  const filepath = args[0] || STARTER_FILE
  try {
    const content = await ctx.fs.promises.readFile(`${ctx.dir}/${filepath}`, "utf8")
    const lines = content.split("\n")
    const history = await git.log({ fs: ctx.fs, dir: ctx.dir })
    const latest = history[0]?.oid
    const author = history[0]?.commit.author.name || DEFAULT_AUTHOR.name
    const short = latest ? displayId(latest, ctx) : "0000000"

    const output = lines
      .map((line, i) => `${short} (${author} ${String(i + 1).padStart(4, " ")}) ${line}`)
      .join("\n")

    return { output, outputType: "normal" }
  } catch {
    return { output: `fatal: no such path '${filepath}' in working tree`, outputType: "error" }
  }
}

async function handleBisect(
  ctx: RepoContext,
  args: string[]
): Promise<CommandResult> {
  const meta = getTrainerMeta(ctx)
  const sub = args[0]

  if (sub === "start") {
    meta.bisect = { active: true, badRef: null, goodRefs: [] }
    return { output: "status: waiting for both good and bad commits", outputType: "success" }
  }

  if (!meta.bisect.active) {
    return { output: "You need to start by 'git bisect start'", outputType: "error" }
  }

  if (sub === "bad") {
    meta.bisect.badRef = args[1] || "HEAD"
    return { output: "status: bad commit recorded", outputType: "success" }
  }

  if (sub === "good") {
    meta.bisect.goodRefs.push(args[1] || "HEAD~1")
    return {
      output: "Bisecting: 1 revision left to test after this (roughly 1 step)",
      outputType: "success",
    }
  }

  if (sub === "reset") {
    meta.bisect = { active: false, badRef: null, goodRefs: [] }
    return { output: "Previous HEAD position restored, bisect session ended.", outputType: "success" }
  }

  return {
    output: "usage: git bisect <start|bad|good|reset>",
    outputType: "error",
  }
}


/* ── Dispatcher ──────────────────────────────────────────────── */

export async function runGitCommand(
  input: string,
  ctx: RepoContext
): Promise<CommandResult> {
  const tokens = tokenize(input)
  if (tokens.length === 0) {
    return { output: "", outputType: "normal" }
  }
  const sub = tokens[0]
  const args = tokens.slice(1)

  try {
    switch (sub) {
      case "init":
        return await handleInit(ctx)
      case "status":
        return await handleStatus(ctx)
      case "add":
        return await handleAdd(ctx, args)
      case "commit":
        return await handleCommit(ctx, args)
      case "log":
        return await handleLog(ctx, args)
      case "branch":
        return await handleBranch(ctx, args)
      case "checkout":
      case "switch":
        return await handleCheckoutOrSwitch(ctx, args)
      case "merge":
        return await handleMerge(ctx, args)
      case "reset":
        return await handleReset(ctx, args)
      case "revert":
        return await handleRevert(ctx, args)
      case "diff":
        return await handleDiff(ctx, args)
      case "restore":
        return await handleRestore(ctx, args)
      case "cherry-pick":
        return await handleCherryPick(ctx, args)
      case "stash":
        return await handleStash(ctx, args)
      case "reflog":
        return await handleReflog(ctx, args)
      case "rebase":
        return await handleRebase(ctx, args)
      case "remote":
        return await handleRemote(ctx, args)
      case "fetch":
        return await handleFetch(ctx, args)
      case "pull":
        return await handlePull(ctx, args)
      case "push":
        return await handlePush(ctx, args)
      case "tag":
        return await handleTag(ctx, args)
      case "blame":
        return await handleBlame(ctx, args)
      case "bisect":
        return await handleBisect(ctx, args)
      default:
        return {
          output: `git: '${sub}' is not a git command. See 'git --help'.`,
          outputType: "error",
        }
    }
  } catch (err) {
    return {
      output: `fatal: ${(err as Error).message}`,
      outputType: "error",
    }
  }
}
