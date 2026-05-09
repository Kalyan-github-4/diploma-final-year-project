// client/src/lib/realGit/snapshot.ts

import * as git from "isomorphic-git"
import type { RepoContext, Snapshot, SnapshotCommit } from "./types"

/**
 * Translate a real isomorphic-git SHA to its display id.
 * Uses the fake alias from materialization if present, otherwise the
 * standard 7-char short hash.
 */
function displayId(realSha: string, ctx: RepoContext): string {
  return ctx.realToFake[realSha] || realSha.slice(0, 7)
}

/**
 * Build a snapshot of the repo in a shape compatible with the existing
 * GitGraph component (which reads commits/branches/HEAD).
 *
 * Strategy:
 *  1. List all branches and resolve each tip
 *  2. Walk every branch's history, assigning each commit to the FIRST
 *     branch that owns it (so main wins ties — feature branches inherit
 *     unique commits past the fork)
 *  3. Build the final commits map keyed by display id
 *  4. Resolve HEAD via currentBranch()
 */
export async function buildSnapshot(ctx: RepoContext): Promise<Snapshot> {
  const { fs, dir } = ctx

  const branches = await git.listBranches({ fs, dir })

  // Order branches deterministically: main/master first, then alphabetic.
  const ordered = [...branches].sort((a, b) => {
    const aPriority = a === "main" || a === "master" ? 0 : 1
    const bPriority = b === "main" || b === "master" ? 0 : 1
    if (aPriority !== bPriority) return aPriority - bPriority
    return a.localeCompare(b)
  })

  const commitToBranch: Record<string, string> = {} // realSha → branchName
  const realCommitData: Record<
    string,
    { message: string; parent: string | null; secondParent: string | null }
  > = {}

  for (const branchName of ordered) {
    let log
    try {
      log = await git.log({ fs, dir, ref: branchName })
    } catch {
      // Branch points to nothing yet (e.g. fresh init with no commits)
      continue
    }
    for (const entry of log) {
      const realSha = entry.oid
      if (!commitToBranch[realSha]) {
        commitToBranch[realSha] = branchName
      }
      if (!realCommitData[realSha]) {
        const parents = entry.commit.parent || []
        realCommitData[realSha] = {
          message: entry.commit.message.trim(),
          parent: parents[0] || null,
          secondParent: parents[1] || null,
        }
      }
    }
  }

  // Build display-id-keyed commits map.
  const commits: Record<string, SnapshotCommit> = {}
  for (const [realSha, data] of Object.entries(realCommitData)) {
    const id = displayId(realSha, ctx)
    commits[id] = {
      id,
      message: data.message,
      parent: data.parent ? displayId(data.parent, ctx) : null,
      secondParent: data.secondParent ? displayId(data.secondParent, ctx) : null,
      branch: commitToBranch[realSha] || "main",
    }
  }

  // Build branches map: branch name → display id of tip.
  const branchTips: Record<string, string> = {}
  for (const branchName of branches) {
    try {
      const tipSha = await git.resolveRef({ fs, dir, ref: branchName })
      branchTips[branchName] = displayId(tipSha, ctx)
    } catch {
      /* branch with no commits — skip */
    }
  }

  // Resolve HEAD.
  let head: Snapshot["HEAD"] = { type: "branch", ref: "main" }
  try {
    const current = await git.currentBranch({ fs, dir, fullname: false })
    if (current) {
      head = { type: "branch", ref: current }
    } else {
      // Detached HEAD — resolve to commit short id.
      const sha = await git.resolveRef({ fs, dir, ref: "HEAD" })
      head = { type: "detached", ref: displayId(sha, ctx) }
    }
  } catch {
    /* repo not initialized yet — keep default */
  }

  return { commits, branches: branchTips, HEAD: head }
}

/**
 * Empty snapshot for the "no mission loaded" / pre-init state.
 */
export function emptySnapshot(): Snapshot {
  return {
    commits: {},
    branches: {},
    HEAD: { type: "branch", ref: "main" },
  }
}
