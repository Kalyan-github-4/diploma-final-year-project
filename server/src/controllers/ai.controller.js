const { generateAIReply, streamAIReply, generateDSAQuestions } = require("../services/ai.service")

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

module.exports = { chatWithAI, streamChatWithAI, generateDSAQuestionsController }
