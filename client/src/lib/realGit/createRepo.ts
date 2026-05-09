// client/src/lib/realGit/createRepo.ts

import LightningFS from "@isomorphic-git/lightning-fs"
import * as git from "isomorphic-git"
import type { RepoContext } from "./types"

/**
 * Spin up a fresh in-memory repo. Each call wipes any prior state under
 * the same `repoName`, so missions always start clean.
 */
export async function createRepo(repoName: string): Promise<RepoContext> {
  const fs = new LightningFS(repoName, { wipe: true })
  const pfs = fs.promises
  const dir = `/${repoName}`

  // Ensure the working dir exists before init.
  try {
    await pfs.mkdir(dir)
  } catch {
    /* already exists — fine */
  }

  await git.init({ fs, dir, defaultBranch: "main" })

  return {
    fs,
    dir,
    fakeToReal: {},
    realToFake: {},
    editCounter: { value: 0 },
  }
}

export const DEFAULT_AUTHOR = {
  name: "CodeKing Learner",
  email: "learner@codeking.dev",
}
