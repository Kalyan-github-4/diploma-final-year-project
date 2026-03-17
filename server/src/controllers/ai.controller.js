const { generateAIReply } = require("../services/ai.service")

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

module.exports = {
    chatWithAI,
}