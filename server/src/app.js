const express = require("express")
const cors = require("cors")
const { env } = require("./config/env")
const { ensureDatabaseSchema } = require("./db/bootstrap")
const { testConnection } = require("./db/client")
const missionsRouter = require("./routes/missions.routes")
const aiRouter = require("./routes/ai.routes")
const modulesRoute = require("./routes/modules.routes")
const progressRouter = require("./routes/progress.routes")

const app = express()

app.use(
	cors({
		origin: env.clientOrigin,
		credentials: true,
	})
)
app.use(express.json({ limit: "1mb" }))

app.get("/api/health", (_req, res) => {
	const { cache } = require("./utils/cache")
	res.status(200).json({
		status: "ok",
		ts: new Date().toISOString(),
		cache: { entries: cache._store.size },
	})
})

app.use("/api/git/missions", missionsRouter)
app.use("/api/ai", aiRouter)
app.use("/api/modules", modulesRoute)
app.use("/api/progress", progressRouter)

async function initializeApp() {
	console.log("")
	console.log("  ╭─────────────────────────────────────╮")
	console.log("  │         ⚡ CodeKing Server          │")
	console.log("  ╰─────────────────────────────────────╯")
	console.log("")

	// Environment
	console.log(`  [env]    mode        : ${env.nodeEnv}`)
	console.log(`  [env]    client      : ${env.clientOrigin}`)
	console.log(`  [env]    ai model    : ${env.geminiApiKey ? env.geminiModel : env.openAiApiKey ? env.openAiModel : "ollama/" + env.ollamaModel}`)
	console.log("")

	// Database
	if (!env.databaseUrl) {
		console.warn("  [db]     ⚠  DATABASE_URL missing — DB routes will fail")
		console.log("")
		return
	}

	const dbHost = env.databaseUrl.match(/@([^:/]+)/)?.[1] || "unknown"
	console.log(`  [db]     host        : ${dbHost}`)

	const start = Date.now()
	const connected = await testConnection()
	const ms = Date.now() - start

	if (connected) {
		console.log(`  [db]     status      : ✓ connected (${ms}ms)`)
		await ensureDatabaseSchema()
		console.log("  [db]     schema      : ✓ verified")
	} else {
		console.error(`  [db]     status      : ✗ connection failed (${ms}ms)`)
		console.error("  [db]     hint        : check DATABASE_URL and network access")
	}

	// Routes
	console.log("")
	console.log("  [routes] GET  /api/health")
	console.log("  [routes] GET  /api/modules")
	console.log("  [routes] GET  /api/modules/:slug")
	console.log("  [routes] GET  /api/git/missions")
	console.log("  [routes] POST /api/git/missions/generate")
	console.log("  [routes] POST /api/ai/chat")
	console.log("  [routes] GET  /api/progress")
	console.log("  [routes] GET  /api/progress/all")
	console.log("  [routes] POST /api/progress")
	console.log("")
}

module.exports = {
	app,
	initializeApp,
}
