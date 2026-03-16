const express = require("express")
const { eq } = require("drizzle-orm")
const router = express.Router()
const { getDb } = require("../db/client")
const { modulesTable } = require("../db/schema")

router.get("/", async (req, res) => {
    try {
        const { db } = getDb()
        const modules = await db.select().from(modulesTable).orderBy(modulesTable.orderIndex)
        res.json(modules)
    } catch (err) {
        console.error("MODULE_FETCH_ERROR:", err)
        res.status(500).json({ message: "Failed to fetch modules" })
    }
})

router.get("/:slug", async (req, res) => {
    try {
        const { db } = getDb()
        const { slug } = req.params
        const rows = await db.select().from(modulesTable).where(eq(modulesTable.slug, slug)).limit(1)

        if (!rows.length) {
            return res.status(404).json({ message: "Module not found" })
        }

        res.json(rows[0])

    } catch (err) {
        console.error("MODULE_FETCH_ERROR:", err)
        res.status(500).json({ message: "Failed to fetch module" })
    }
})

module.exports = router