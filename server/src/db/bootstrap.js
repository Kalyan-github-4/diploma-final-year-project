const { sql } = require("drizzle-orm")
const { getDb } = require("./client")

async function ensureDatabaseSchema() {
  const { db } = getDb()

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS user_profiles (
      id SERIAL PRIMARY KEY,
      user_id TEXT NOT NULL UNIQUE,
      level INTEGER NOT NULL DEFAULT 1,
      total_xp INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `)

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS generated_missions (
      id SERIAL PRIMARY KEY,
      mission_id TEXT NOT NULL UNIQUE,
      user_id TEXT NOT NULL,
      level INTEGER NOT NULL,
      difficulty INTEGER NOT NULL,
      order_index INTEGER NOT NULL,
      title TEXT NOT NULL,
      xp INTEGER NOT NULL,
      mission_data JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `)

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
