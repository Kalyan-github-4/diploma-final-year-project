const { generateAIReply, generateDSAQuestions } = require("../services/ai.service")

const chatWithAI = async (req, res) => {
    try {
        const { message, module, topic } = req.body

        if (!message || typeof message !== "string") {
            return res.status(400).json({ error: "Message is required" })
        }

        const aiResponse = await generateAIReply(message, module, topic)

        return res.status(200).json({ reply: aiResponse })
    } catch (error) {
        const message = error?.message || String(error) || "Unknown AI error"

        if (message.includes("insufficient_quota") || message.includes("RESOURCE_EXHAUSTED")) {
            return res.status(429).json({
                error: "AI quota exceeded",
                message: "Gemini quota is exhausted for this API key. Use another key, upgrade quota, or retry later.",
            })
        }

        if (message.includes("Gemini request failed (429)") || message.includes("rate limit")) {
            return res.status(429).json({
                error: "AI rate limited",
                message: `Gemini is rate-limiting requests right now. ${message}`,
            })
        }

        return res.status(500).json({
            error: "Failed to generate AI response",
            message,
        })
    }
}

function normalizeDSAStep(step) {
    if (!step || typeof step !== "object") {
        return null
    }

    const stepId = typeof step.stepId === "string" ? step.stepId.trim() : ""
    const description = typeof step.description === "string" ? step.description.trim() : ""
    const type = typeof step.type === "string" ? step.type.trim() : ""
    const codeLine = Number.isInteger(step.codeLine) ? step.codeLine : null
    const snapshot = step.snapshot && typeof step.snapshot === "object" ? step.snapshot : null

    if (!stepId || !description || !type || codeLine === null || !snapshot) {
        return null
    }

    return {
        stepId,
        description,
        type,
        codeLine,
        snapshot,
    }
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

        return res.status(200).json({
            algorithm,
            count: questions.length,
            questions,
        })
    } catch (error) {
        const message = error?.message || String(error) || "Unknown AI error"

        if (message.includes("insufficient_quota") || message.includes("RESOURCE_EXHAUSTED")) {
            return res.status(429).json({
                error: "AI quota exceeded",
                message: "Gemini quota is exhausted for this API key. Use another key, upgrade quota, or retry later.",
            })
        }

        if (message.includes("failed (429)") || message.includes("rate limit")) {
            return res.status(429).json({
                error: "AI rate limited",
                message,
            })
        }

        return res.status(500).json({
            error: "Failed to generate DSA questions",
            message,
        })
    }
}

module.exports = {
    chatWithAI,
    generateDSAQuestionsController,
}