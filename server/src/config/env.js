const dotenv = require("dotenv")

dotenv.config()

function toInt(value, fallback) {
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) ? parsed : fallback
}

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: toInt(process.env.PORT, 4000),
  databaseUrl: process.env.DATABASE_URL || "",
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  geminiModel: process.env.GEMINI_MODEL || "gemini-2.0-flash",
  aiTimeoutMs: toInt(process.env.AI_TIMEOUT_MS, 12000),
  aiRetryCount: toInt(process.env.AI_RETRY_COUNT, 2),
  aiRetryBaseDelayMs: toInt(process.env.AI_RETRY_BASE_DELAY_MS, 700),
  openAiApiKey: process.env.OPENAI_API_KEY || "",
  openAiModel: process.env.OPENAI_MODEL || "gpt-4.1-mini",
  ollamaModel: process.env.OLLAMA_MODEL || "phi3:mini",
  ollamaApiUrl: process.env.OLLAMA_API_URL || "http://localhost:11434",
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
}

module.exports = { env }
