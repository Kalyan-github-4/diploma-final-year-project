const { z } = require("zod")
const {
  upsertUserProfile,
  replaceUserMissionBatch,
  getUserMissions,
} = require("../services/missions.service")

const requestSchema = z.object({
  userId: z.string().min(1),
  level: z.coerce.number().int().min(1).max(50),
  topic: z.string().min(1).max(120).optional(),
  generationNonce: z.string().min(6).max(120).optional(),
})

async function generateMissions(req, res) {
  try {
    const parsed = requestSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid request payload",
        details: parsed.error.flatten(),
      })
    }

    const { userId, level, topic, generationNonce } = parsed.data

    await upsertUserProfile({ userId, level })
    const missions = await replaceUserMissionBatch({ userId, level, topic, generationNonce })

    return res.status(200).json({
      userId,
      level,
      count: missions.length,
      missions,
    })
  } catch (error) {
    return res.status(500).json({
      error: "Failed to generate missions",
      message: error instanceof Error ? error.message : "Unknown server error",
    })
  }
}

async function listMissions(req, res) {
  try {
    const parsed = requestSchema.safeParse(req.query)
    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid query parameters",
        details: parsed.error.flatten(),
      })
    }

    const { userId, level } = parsed.data
    const missions = await getUserMissions({ userId, level })

    return res.status(200).json({
      userId,
      level,
      count: missions.length,
      missions,
    })
  } catch (error) {
    return res.status(500).json({
      error: "Failed to load missions",
      message: error instanceof Error ? error.message : "Unknown server error",
    })
  }
}

module.exports = {
  generateMissions,
  listMissions,
}