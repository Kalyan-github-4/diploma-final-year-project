const express = require("express")
const cors = require("cors")
const { env } = require("./config/env")
const { ensureDatabaseSchema } = require("./db/bootstrap")
const missionsRouter = require("./routes/missions.routes")
const aiRouter = require("./routes/ai.routes")


const app = express()

app.use(
	cors({
		origin: env.clientOrigin,
		credentials: true,
	})
)
app.use(express.json({ limit: "1mb" }))

app.get("/api/health", (_req, res) => {
	res.status(200).json({ status: "ok", ts: new Date().toISOString() })
})

app.use("/api/git/missions", missionsRouter)
app.use("/api/ai", aiRouter)

async function initializeApp() {
	if (!env.databaseUrl) {
		console.warn("[server] DATABASE_URL missing. API will run but DB-backed mission routes will fail.")
		return
	}

	await ensureDatabaseSchema()
}

module.exports = {
	app,
	initializeApp,
}
