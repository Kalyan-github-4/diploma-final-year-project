const { pgTable, serial, text, integer, timestamp, jsonb } = require("drizzle-orm/pg-core")

const userProfiles = pgTable("user_profiles", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().unique(),
  level: integer("level").notNull().default(1),
  totalXp: integer("total_xp").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
})

const generatedMissions = pgTable("generated_missions", {
  id: serial("id").primaryKey(),
  missionId: text("mission_id").notNull().unique(),
  userId: text("user_id").notNull(),
  level: integer("level").notNull(),
  difficulty: integer("difficulty").notNull(),
  orderIndex: integer("order_index").notNull(),
  title: text("title").notNull(),
  xp: integer("xp").notNull(),
  missionData: jsonb("mission_data").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})

module.exports = {
  userProfiles,
  generatedMissions,
}