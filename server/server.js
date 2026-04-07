const { app, initializeApp } = require("./src/app")
const { env } = require("./src/config/env")

async function start() {
	try {
		await initializeApp()

		app.listen(env.port, () => {
			console.log(`  [server] ✓ listening on http://localhost:${env.port}`)
			console.log("")
			console.log("  Ready for requests.")
			console.log("")
		})
	} catch (error) {
		console.error("")
		console.error("  [server] ✗ failed to start")
		console.error("  ", error.message || error)
		console.error("")
		process.exit(1)
	}
}

start()
