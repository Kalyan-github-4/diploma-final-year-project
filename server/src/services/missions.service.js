const { and, asc, eq } = require("drizzle-orm")
const { getDb } = require("../db/client")
const { generatedMissions, userProfiles } = require("../db/schema")
const { generateMissionSet } = require("./mission-generator.service")

async function upsertUserProfile({ userId, level }) {
  const { db } = getDb()

  await db
    .insert(userProfiles)
    .values({ userId, level })
    .onConflictDoUpdate({
      target: userProfiles.userId,
      set: {
        level,
        updatedAt: new Date(),
      },
    })
}

async function replaceUserMissionBatch({ userId, level, topic, generationNonce }) {
  const { db } = getDb()
  const existingRows = await db
    .select({ missionData: generatedMissions.missionData })
    .from(generatedMissions)
    .where(and(eq(generatedMissions.userId, userId), eq(generatedMissions.level, level)))
    .orderBy(asc(generatedMissions.orderIndex))

  const previousMissions = existingRows.map((row) => row.missionData)
  // Only use AI-generated missions
  const missions = await generateMissionSet({ userId, level, topic, generationNonce, previousMissions })

  await db
    .delete(generatedMissions)
    .where(and(eq(generatedMissions.userId, userId), eq(generatedMissions.level, level)))

  if (missions.length === 0) return []

  const inserted = await db
    .insert(generatedMissions)
    .values(
      missions.map((mission) => ({
        missionId: mission.missionId,
        userId,
        level,
        difficulty: mission.difficulty,
        orderIndex: mission.orderIndex,
        title: mission.title,
        xp: mission.xp,
        missionData: mission,
      }))
    )
    .returning()

  return inserted
    .sort((a, b) => a.orderIndex - b.orderIndex)
    .map((row) => row.missionData)
}

async function getUserMissions({ userId, level }) {
  const { db } = getDb()

  const rows = await db
    .select({
      missionData: generatedMissions.missionData,
    })
    .from(generatedMissions)
    .where(and(eq(generatedMissions.userId, userId), eq(generatedMissions.level, level)))
    .orderBy(asc(generatedMissions.orderIndex))

  return rows.map((row) => row.missionData)
}

module.exports = {
  upsertUserProfile,
  replaceUserMissionBatch,
  getUserMissions,
}
