const { sql } = require("drizzle-orm")
const { getDb } = require("./client")

async function ensureDatabaseSchema() {
  const { db } = getDb()


  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS modules (
      id SERIAL PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      topics_count INTEGER NOT NULL,
      total_xp INTEGER NOT NULL,
      icon TEXT NOT NULL,
      theme_color TEXT NOT NULL,
      is_locked BOOLEAN DEFAULT FALSE,
      order_index INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `)
}

module.exports = { ensureDatabaseSchema }
