// client/src/lib/realGit/materialize.ts
//
// Turns a mission's static `initialGraphState` (fake commit graph) into
// a real isomorphic-git repository. Returns a RepoContext with SHA alias
// maps so the rest of the system can keep referring to the mission's
// fake short hashes (e.g. "bad3333") even though the underlying repo has
// real hashes.

import * as git from "isomorphic-git"
import type { Mission, MissionGraphState } from "@/lib/mission.utils"
import { createRepo, DEFAULT_AUTHOR } from "./createRepo"
import type { RepoContext } from "./types"

const STARTER_FILE = "README.md"

/**
 * Materialize the commits in a mission's initialGraphState as real git
 * commits, in topological order (parents before children).
 */
async function materializeCommits(
  ctx: RepoContext,
  graph: MissionGraphState
): Promise<void> {
  const { fs, dir } = ctx
  const pfs = fs.promises

  // Topological order — parents before children.
  const order: string[] = []
  const visited = new Set<string>()
  function visit(id: string) {
    if (visited.has(id) || !graph.commits[id]) return
    visited.add(id)
    const parent = graph.commits[id].parent
    if (parent) visit(parent)
    order.push(id)
  }
  for (const id of Object.keys(graph.commits)) visit(id)

  // Create the starter file with initial content.
  await pfs.writeFile(`${dir}/${STARTER_FILE}`, "# CodeKing\n\nstart of repo\n")

  for (const fakeId of order) {
    const data = graph.commits[fakeId]
    // Make a unique edit per commit so each commit hashes uniquely.
    const existing = await pfs.readFile(`${dir}/${STARTER_FILE}`, "utf8")
    await pfs.writeFile(
      `${dir}/${STARTER_FILE}`,
      `${existing}\n- ${data.message} (${fakeId})`
    )
    await git.add({ fs, dir, filepath: STARTER_FILE })
    const realSha = await git.commit({
      fs,
      dir,
      message: data.message,
      author: DEFAULT_AUTHOR,
    })
    ctx.fakeToReal[fakeId] = realSha
    ctx.realToFake[realSha] = fakeId
  }
}

/**
 * Set up branches as defined in the mission graph and check out HEAD's
 * target branch.
 */
async function materializeBranches(
  ctx: RepoContext,
  graph: MissionGraphState
): Promise<void> {
  const { fs, dir } = ctx

  // Find what isomorphic-git's default branch ended up pointing at after
  // our linear commit chain. Every commit landed on whatever the current
  // branch is (main by default).
  const defaultBranch =
    (await git.currentBranch({ fs, dir, fullname: false })) || "main"

  // For each branch in the mission, point a real branch ref at the right
  // commit. We rewrite branch tips by writing the ref directly so we can
  // back-date branches to mid-history commits.
  for (const [branchName, tipFakeId] of Object.entries(graph.branches)) {
    const realSha = ctx.fakeToReal[tipFakeId]
    if (!realSha) continue
    if (branchName === defaultBranch) {
      // Default branch already points at the latest commit. Reset it to
      // the mission's intended tip in case the mission says main !== latest.
      await git.writeRef({
        fs,
        dir,
        ref: `refs/heads/${branchName}`,
        value: realSha,
        force: true,
      })
    } else {
      // Create the branch and point it.
      await git.writeRef({
        fs,
        dir,
        ref: `refs/heads/${branchName}`,
        value: realSha,
        force: true,
      })
    }
  }

  // Check out the requested HEAD branch.
  if (graph.HEAD.type === "branch") {
    try {
      await git.checkout({ fs, dir, ref: graph.HEAD.ref, force: true })
    } catch {
      /* ignore — branch may not exist for missions that start uninitialized */
    }
  }
}

/**
 * Public entry point. Returns a fully-prepared RepoContext for a mission.
 *
 * If the mission's first step is `git init`, we return an EMPTY repo
 * (uninitialized) so the user actually performs the init themselves.
 * Otherwise we materialize the full starting graph.
 */
export async function materializeMission(mission: Mission): Promise<RepoContext> {
  // The server-side mission objects carry an extra `missionId` field which
  // isn't on the client Mission type — use it when present, fall back to id.
  const missionAny = mission as Mission & { missionId?: string }
  const repoName = `mission-${missionAny.missionId || mission.id || "anon"}`
  const ctx = await createRepo(repoName)

  const isInitMission = mission.steps[0]?.completedBy === "git init"

  if (isInitMission) {
    // Wipe the auto-init from createRepo so `git init` is the user's job.
    // We do this by removing the .git directory and the starter file.
    try {
      await ctx.fs.promises.unlink(`${ctx.dir}/${STARTER_FILE}`)
    } catch {
      /* not present yet */
    }
    // Remove .git so `git init` actually has work to do.
    await removeRecursive(ctx, `${ctx.dir}/.git`)
    return ctx
  }

  const graph = mission.initialGraphState
  if (!graph || Object.keys(graph.commits || {}).length === 0) {
    // No graph — just leave a starter file in place.
    await ctx.fs.promises.writeFile(
      `${ctx.dir}/${STARTER_FILE}`,
      "# CodeKing\n\nedit me\n"
    )
    return ctx
  }

  await materializeCommits(ctx, graph)
  await materializeBranches(ctx, graph)
  return ctx
}

/**
 * Recursively delete a path in the lightning-fs tree.
 * Used to wipe `.git` for fresh-init missions.
 */
async function removeRecursive(ctx: RepoContext, path: string): Promise<void> {
  const pfs = ctx.fs.promises
  let stat
  try {
    stat = await pfs.stat(path)
  } catch {
    return
  }
  if (stat.isDirectory()) {
    const entries = await pfs.readdir(path)
    for (const name of entries) {
      await removeRecursive(ctx, `${path}/${name}`)
    }
    await pfs.rmdir(path)
  } else {
    await pfs.unlink(path)
  }
}
