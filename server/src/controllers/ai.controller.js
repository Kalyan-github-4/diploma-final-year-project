const { generateAIReply, streamAIReply, generateDSAQuestions, synthesizeSpeech } = require("../services/ai.service")

// ─── Chat (non-streaming) ─────────────────────────────────────────────────────

const chatWithAI = async (req, res) => {
    try {
        const { message, module, topic, history } = req.body

        if (!message || typeof message !== "string") {
            return res.status(400).json({ error: "Message is required" })
        }

        const safeHistory = Array.isArray(history) ? history : []
        const reply = await generateAIReply(message, module, topic, safeHistory)

        return res.status(200).json({ reply })
    } catch (error) {
        const msg = error?.message || "Unknown AI error"

        if (msg.includes("timed out")) {
            return res.status(504).json({ error: "AI timed out", message: msg })
        }

        return res.status(500).json({ error: "Failed to generate AI response", message: msg })
    }
}

// ─── Chat (streaming — SSE) ───────────────────────────────────────────────────

const streamChatWithAI = async (req, res) => {
    const { message, module, topic, history } = req.body

    if (!message || typeof message !== "string") {
        res.status(400).json({ error: "Message is required" })
        return
    }

    const safeHistory = Array.isArray(history) ? history : []
    await streamAIReply(message, module, topic, safeHistory, res)
}

// ─── DSA Questions ────────────────────────────────────────────────────────────

function normalizeDSAStep(step) {
    if (!step || typeof step !== "object") return null

    const stepId = typeof step.stepId === "string" ? step.stepId.trim() : ""
    const description = typeof step.description === "string" ? step.description.trim() : ""
    const type = typeof step.type === "string" ? step.type.trim() : ""
    const codeLine = Number.isInteger(step.codeLine) ? step.codeLine : null
    const snapshot = step.snapshot && typeof step.snapshot === "object" ? step.snapshot : null

    if (!stepId || !description || !type || codeLine === null || !snapshot) return null

    return { stepId, description, type, codeLine, snapshot }
}

const generateDSAQuestionsController = async (req, res) => {
    try {
        const { algorithm, context, steps } = req.body || {}

        if (algorithm !== "binary-search" && algorithm !== "bubble-sort") {
            return res.status(400).json({ error: "algorithm must be binary-search or bubble-sort" })
        }

        if (!Array.isArray(steps) || steps.length === 0) {
            return res.status(400).json({ error: "steps array is required" })
        }

        if (steps.length > 30) {
            return res.status(400).json({ error: "steps payload is too large" })
        }

        const normalizedSteps = steps.map(normalizeDSAStep).filter(Boolean)
        if (normalizedSteps.length === 0) {
            return res.status(400).json({ error: "No valid step payloads were provided" })
        }

        const safeContext = context && typeof context === "object" ? context : {}

        const questions = await generateDSAQuestions({
            algorithm,
            context: safeContext,
            steps: normalizedSteps,
        })

        return res.status(200).json({ algorithm, count: questions.length, questions })
    } catch (error) {
        const msg = error?.message || "Unknown AI error"

        if (msg.includes("timed out")) {
            return res.status(504).json({ error: "AI timed out", message: msg })
        }

        return res.status(500).json({ error: "Failed to generate DSA questions", message: msg })
    }
}

const textToSpeechController = async (req, res) => {
    try {
        const { input, voice, model, response_format } = req.body || {}

        if (!input || typeof input !== "string") {
            return res.status(400).json({ error: "input text is required" })
        }

        const { contentType, audioBuffer } = await synthesizeSpeech({
            input,
            voice: typeof voice === "string" && voice.trim() ? voice : "af_heart",
            model: typeof model === "string" && model.trim() ? model : "kokoro",
            response_format: typeof response_format === "string" && response_format.trim() ? response_format : "mp3",
        })

        res.setHeader("Content-Type", contentType)
        res.setHeader("Cache-Control", "no-store")
        return res.status(200).send(audioBuffer)
    } catch (error) {
        const msg = error?.message || "Failed to synthesize speech"
        return res.status(502).json({ error: "TTS failed", message: msg })
    }
}

const healthCheckController = async (_req, res) => {
    const { getOllamaBaseCandidates } = require("../services/ai.service")
    const candidates = getOllamaBaseCandidates()
    const results = await Promise.all(
        candidates.map(async (baseUrl) => {
            try {
                const r = await fetch(`${baseUrl}/api/tags`, { signal: AbortSignal.timeout(4000) })
                if (!r.ok) return { url: baseUrl, status: "error", detail: `HTTP ${r.status}` }
                const data = await r.json()
                const models = (data.models || []).map((m) => m.name)
                return { url: baseUrl, status: "ok", models }
            } catch (err) {
                return { url: baseUrl, status: "unreachable", detail: err.message }
            }
        })
    )
    const reachable = results.find((r) => r.status === "ok")
    return res.status(reachable ? 200 : 503).json({ ollama: results })
}

module.exports = { chatWithAI, streamChatWithAI, generateDSAQuestionsController, textToSpeechController, healthCheckController }
