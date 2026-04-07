const { getStaticGitMissions } = require("../data/git-missions.data")

/**
 * Static-missions service.
 *
 * Missions are hand-authored in `server/src/data/git-missions.data.js`,
 * keyed by level. Each call returns the same deterministic set of 3 missions
 * for a given level — no per-user generation, no DB writes.
 *
 * The upsertUserProfile and replaceUserMissionBatch names are kept so the
 * existing controller / route surface doesn't change.
 */

async function upsertUserProfile(/* { userId, level } */) {
  // No-op: we no longer track per-user mission state.
  // Kept as a function so the controller stays untouched.
}

async function replaceUserMissionBatch({ level }) {
  // Returns [] for levels that haven't been authored yet (7-18 pending).
  // The client surfaces this as a friendly "missions coming soon" state.
  return getStaticGitMissions(level) || []
}

async function getUserMissions({ level }) {
  const missions = getStaticGitMissions(level)
  return missions || []
}

module.exports = {
  upsertUserProfile,
  replaceUserMissionBatch,
  getUserMissions,
}
