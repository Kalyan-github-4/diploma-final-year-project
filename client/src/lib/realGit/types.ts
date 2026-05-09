// client/src/lib/realGit/types.ts
//
// Snapshot types and shared utilities for the real-git layer.
//
// The Snapshot type is intentionally shaped to match what the existing
// GitGraph component reads from `GitState` (commits/branches/HEAD).
// This lets us swap the simulator for isomorphic-git without rewriting
// the rendering layer.

import type LightningFS from "@isomorphic-git/lightning-fs"

export interface SnapshotCommit {
  id: string // display id — fake alias if available, else 7-char real sha
  message: string
  parent: string | null
  secondParent?: string | null
  branch: string
}

export interface Snapshot {
  commits: Record<string, SnapshotCommit>
  branches: Record<string, string> // branch name → display id of tip commit
  HEAD: { type: "branch" | "detached"; ref: string }
}

/**
 * Repo context held by the learning page. Wraps the in-memory filesystem,
 * the working directory path, and the SHA alias maps used to translate
 * between mission-defined fake SHAs and isomorphic-git's real hashes.
 */
export interface RepoContext {
  fs: LightningFS
  dir: string
  /** fakeShortSha → realSha (used to translate user input commands) */
  fakeToReal: Record<string, string>
  /** realSha → fakeShortSha (used to render display ids in snapshots) */
  realToFake: Record<string, string>
  /** Counter used by the router to invent file edits when needed. */
  editCounter: { value: number }
}

/* ── Branch color util (was in gitSimulator) ─────────────────── */

export const BRANCH_COLORS: Record<string, string> = {
  main: "#6366F1",
  master: "#6366F1",
  develop: "#F59E0B",
}

const FALLBACK_PALETTE = ["#22C55E", "#EC4899", "#06B6D4", "#F97316", "#A855F7"]

export function getBranchColor(branch: string): string {
  if (BRANCH_COLORS[branch]) return BRANCH_COLORS[branch]
  // Stable color from name hash so the same branch always renders the same hue.
  let hash = 0
  for (let i = 0; i < branch.length; i++) {
    hash = (hash * 31 + branch.charCodeAt(i)) | 0
  }
  return FALLBACK_PALETTE[Math.abs(hash) % FALLBACK_PALETTE.length]
}
