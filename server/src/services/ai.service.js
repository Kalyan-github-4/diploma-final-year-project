const { env } = require("../config/env")

async function generateAIReply(message, module = "git", topic = "branching") {
    if (!env.geminiApiKey) {
        throw new Error("GEMINI_API_KEY is not configured")
    }

    const systemPrompt = `You are an AI assistant for a coding education platform. Help users learn programming concepts, debug code, and explain ideas for the ${module} module, specifically the topic ${topic}. Be concise, practical, and accurate. If the answer is uncertain, say so directly.`

    const model = env.geminiModel || "gemini-2.0-flash"

    // ✅ timeout control
    const controller = new AbortController()
    const timeoutMs = env.aiTimeoutMs || 12000

    const timeoutId = setTimeout(() => {
        controller.abort()
    }, timeoutMs)

    let response

    try {
        response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(env.geminiApiKey)}`,
            {
                method: "POST",
                signal: controller.signal,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    systemInstruction: {
                        parts: [{ text: systemPrompt }],
                    },
                    contents: [
                        {
                            role: "user",
                            parts: [{ text: message }],
                        },
                    ],
                }),
            }
        )
    } catch (err) {
        if (err.name === "AbortError") {
            throw new Error("AI request timeout — model took too long to respond")
        }
        throw new Error("AI network error — unable to reach Gemini")
    } finally {
        clearTimeout(timeoutId)
    }

    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Gemini API error (${response.status})`)
    }

    const data = await response.json()

    const reply = data?.candidates?.[0]?.content?.parts
        ?.map((p) => p?.text || "")
        .join("\n")
        .trim()

    if (!reply) {
        throw new Error("AI returned empty response")
    }

    return reply
}

module.exports = { generateAIReply }