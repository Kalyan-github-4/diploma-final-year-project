const { pgTable, serial, text, integer, boolean, timestamp, jsonb } = require("drizzle-orm/pg-core")

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



const modulesTable = pgTable("modules", {
  id: serial("id").primaryKey(),

  slug: text("slug").notNull().unique(),   // git-github | dsa | layout-engineering
  title: text("title").notNull(),
  description: text("description").notNull(),

  category: text("category").notNull(),    // programming | cs-fundamentals | tools | frontend

  difficulty: text("difficulty").notNull(), // beginner | intermediate | advanced
  topicsCount: integer("topics_count").notNull(),

  totalXp: integer("total_xp").notNull(),

  icon: text("icon").notNull(),   // store icon key → gitFork | network | terminal
  themeColor: text("theme_color").notNull(),

  isLocked: boolean("is_locked").default(false),

  orderIndex: integer("order_index").default(0),

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})

const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  moduleSlug: text("module_slug").notNull(),
  completedLevels: jsonb("completed_levels").notNull().default([]),
  levelXp: jsonb("level_xp").notNull().default({}),
  totalXpEarned: integer("total_xp_earned").notNull().default(0),
  timeSpent: jsonb("time_spent").notNull().default({}),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
})

module.exports = {
  userProfiles,
  generatedMissions,
  modulesTable,
  userProgress,
}