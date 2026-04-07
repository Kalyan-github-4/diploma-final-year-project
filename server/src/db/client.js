const postgres = require("postgres")
const { drizzle } = require("drizzle-orm/postgres-js")
const { env } = require("../config/env")

let sqlClient = null
let db = null

function getDb() {
	if (!env.databaseUrl) {
		throw new Error("DATABASE_URL is missing. Configure Neon connection first.")
	}

	if (!sqlClient) {
		sqlClient = postgres(env.databaseUrl, {
			ssl: "require",
			max: 10,
			idle_timeout: 20,
			connect_timeout: 60, // Neon free tier cold-starts can take 30-50s
		})
		db = drizzle(sqlClient)
	}

	return { db, sqlClient }
}

async function testConnection() {
	if (!env.databaseUrl) return false

	try {
		const { sqlClient: sql } = getDb()
		const [row] = await sql`SELECT 1 AS ok`
		return row?.ok === 1
	} catch {
		return false
	}
}

module.exports = { getDb, testConnection }
