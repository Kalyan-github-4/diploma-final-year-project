const express = require("express")
const { and, eq } = require("drizzle-orm")
const { z } = require("zod")
const router = express.Router()
const { getDb } = require("../db/client")
const { userProgress } = require("../db/schema")
const { cache } = require("../utils/cache")

const PROGRESS_TTL = 2 * 60 * 1000 // 2 minutes

function progressCacheKey(userId, slug) {
  return `progress:${userId}:${slug}`
}

const getSchema = z.object({
  userId: z.string().min(1),
  slug: z.string().min(1),
})

const saveSchema = z.object({
  userId: z.string().min(1),
  slug: z.string().min(1),
  completedLevels: z.array(z.number()),
  levelXp: z.record(z.string(), z.number()),
  totalXpEarned: z.number().int().min(0),
  timeSpent: z.record(z.string(), z.number()).optional(),
})

// GET /api/progress?userId=X&slug=dsa
router.get("/", async (req, res) => {
  try {
    const parsed = getSchema.safeParse(req.query)
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid query", details: parsed.error.flatten() })
    }

    const { userId, slug } = parsed.data
    const key = progressCacheKey(userId, slug)

    const cached = cache.get(key)
    if (cached) return res.json(cached)

    const { db } = getDb()
    const rows = await db
      .select()
      .from(userProgress)
      .where(and(eq(userProgress.userId, userId), eq(userProgress.moduleSlug, slug)))
      .limit(1)

    const data = rows.length
      ? {
          completedLevels: rows[0].completedLevels,
          levelXp: rows[0].levelXp,
          totalXpEarned: rows[0].totalXpEarned,
          timeSpent: rows[0].timeSpent,
        }
      : { completedLevels: [], levelXp: {}, totalXpEarned: 0, timeSpent: {} }

    cache.set(key, data, PROGRESS_TTL)
    res.json(data)
  } catch (err) {
    console.error("PROGRESS_FETCH_ERROR:", err)
    res.status(500).json({ error: "Failed to fetch progress" })
  }
})

// GET /api/progress/all?userId=X  — all modules for one user
router.get("/all", async (req, res) => {
  try {
    const userId = req.query.userId
    if (!userId || typeof userId !== "string") {
      return res.status(400).json({ error: "userId is required" })
    }

    const { db } = getDb()
    const rows = await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId))

    const result = {}
    for (const row of rows) {
      result[row.moduleSlug] = {
        completedLevels: row.completedLevels,
        levelXp: row.levelXp,
        totalXpEarned: row.totalXpEarned,
        timeSpent: row.timeSpent,
      }
    }

    res.json(result)
  } catch (err) {
    console.error("PROGRESS_ALL_ERROR:", err)
    res.status(500).json({ error: "Failed to fetch all progress" })
  }
})

// POST /api/progress — upsert progress for a module
router.post("/", async (req, res) => {
  try {
    const parsed = saveSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ error: "Invalid body", details: parsed.error.flatten() })
    }

    const { userId, slug, completedLevels, levelXp, totalXpEarned, timeSpent } = parsed.data
    const { db } = getDb()

    await db
      .insert(userProgress)
      .values({
        userId,
        moduleSlug: slug,
        completedLevels,
        levelXp,
        totalXpEarned,
        timeSpent: timeSpent ?? {},
      })
      .onConflictDoUpdate({
        target: [userProgress.userId, userProgress.moduleSlug],
        set: {
          completedLevels,
          levelXp,
          totalXpEarned,
          timeSpent: timeSpent ?? {},
          updatedAt: new Date(),
        },
      })

    cache.invalidate(progressCacheKey(userId, slug))

    res.json({ ok: true })
  } catch (err) {
    console.error("PROGRESS_SAVE_ERROR:", err)
    res.status(500).json({ error: "Failed to save progress" })
  }
})

module.exports = router
