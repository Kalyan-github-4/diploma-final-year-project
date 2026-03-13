require("dotenv").config()

if (!process.env.DATABASE_URL) {
  console.warn("[drizzle] DATABASE_URL is not set. db:push/db:generate will fail until configured.")
}

module.exports = {
  schema: "./src/db/schema.js",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL || "",
  },
}
