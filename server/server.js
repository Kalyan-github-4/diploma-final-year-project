const { app, initializeApp } = require("./src/app")
const { env } = require("./src/config/env")

async function start() {
	try {
		await initializeApp()

		app.listen(env.port, () => {
			console.log(`[server] listening on http://localhost:${env.port}`)
		})
	} catch (error) {
		console.error("[server] failed to start", error)
		process.exit(1)
	}
}

start()
