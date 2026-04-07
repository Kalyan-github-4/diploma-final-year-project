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

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS user_progress (
      id SERIAL PRIMARY KEY,
      user_id TEXT NOT NULL,
      module_slug TEXT NOT NULL,
      completed_levels JSONB NOT NULL DEFAULT '[]',
      level_xp JSONB NOT NULL DEFAULT '{}',
      total_xp_earned INTEGER NOT NULL DEFAULT 0,
      time_spent JSONB NOT NULL DEFAULT '{}',
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      UNIQUE(user_id, module_slug)
    );
  `)
}

module.exports = { ensureDatabaseSchema }
