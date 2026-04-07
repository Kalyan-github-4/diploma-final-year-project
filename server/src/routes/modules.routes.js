const express = require("express")
const { eq } = require("drizzle-orm")
const router = express.Router()
const { getDb } = require("../db/client")
const { modulesTable } = require("../db/schema")
const { cache } = require("../utils/cache")

const MODULES_LIST_KEY = "modules:all"
const MODULE_TTL = 5 * 60 * 1000 // 5 minutes

router.get("/", async (req, res) => {
    try {
        const cached = cache.get(MODULES_LIST_KEY)
        if (cached) return res.json(cached)

        const { db } = getDb()
        const modules = await db.select().from(modulesTable).orderBy(modulesTable.orderIndex)

        cache.set(MODULES_LIST_KEY, modules, MODULE_TTL)
        res.json(modules)
    } catch (err) {
        console.error("MODULE_FETCH_ERROR:", err)
        res.status(500).json({ message: "Failed to fetch modules" })
    }
})

router.get("/:slug", async (req, res) => {
    try {
        const { slug } = req.params
        const cacheKey = `modules:${slug}`

        const cached = cache.get(cacheKey)
        if (cached) return res.json(cached)

        const { db } = getDb()
        const rows = await db.select().from(modulesTable).where(eq(modulesTable.slug, slug)).limit(1)

        if (!rows.length) {
            return res.status(404).json({ message: "Module not found" })
        }

        cache.set(cacheKey, rows[0], MODULE_TTL)
        res.json(rows[0])

    } catch (err) {
        console.error("MODULE_FETCH_ERROR:", err)
        res.status(500).json({ message: "Failed to fetch module" })
    }
})

module.exports = router