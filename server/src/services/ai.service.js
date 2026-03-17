const { env } = require("../config/env")

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

function parseGeminiError(errorText) {
    try {
        const parsed = JSON.parse(errorText)
        return parsed?.error?.message || parsed?.error?.status || errorText
    } catch {
        return errorText
    }
}

function getRetryDelayMs(response, attempt, baseDelayMs) {
    const retryAfter = response.headers.get("retry-after")
    if (retryAfter) {
        const asSeconds = Number.parseInt(retryAfter, 10)
        if (Number.isFinite(asSeconds) && asSeconds >= 0) {
            return asSeconds * 1000
        }

        const asDateMs = Date.parse(retryAfter)
        if (Number.isFinite(asDateMs)) {
            const diff = asDateMs - Date.now()
            if (diff > 0) {
                return diff
            }
        }
    }

    const jitterMs = Math.floor(Math.random() * 250)
    return baseDelayMs * (2 ** attempt) + jitterMs
}

async function generateAIReply(message, module = "git", topic = "branching") {
    if (!env.geminiApiKey) {
        throw new Error("GEMINI_API_KEY is not configured")
    }

    const systemPrompt = `You are an AI assistant for a coding education platform. Help users learn programming concepts, debug code, and explain ideas for the ${module} module, specifically the topic ${topic}. Be concise, practical, and accurate. If the answer is uncertain, say so directly.`

    const model = env.geminiModel || "gemini-2.0-flash"
    const timeoutMs = env.aiTimeoutMs || 12000
    const maxRetries = Math.max(0, env.aiRetryCount || 0)
    const baseDelayMs = Math.max(100, env.aiRetryBaseDelayMs || 700)

    let response
    let lastErrorMessage = ""

    for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => {
            controller.abort()
        }, timeoutMs)

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

            if (attempt < maxRetries) {
                const delayMs = baseDelayMs * (2 ** attempt)
                await sleep(delayMs)
                continue
            }

            throw new Error("AI network error — unable to reach Gemini")
        } finally {
            clearTimeout(timeoutId)
        }

        if (response.ok) {
            break
        }

        const errorText = await response.text()
        const reason = parseGeminiError(errorText)
        lastErrorMessage = `Gemini request failed (${response.status}): ${reason}`

        const isRetryable = response.status === 429 || response.status === 503
        if (isRetryable && attempt < maxRetries) {
            const delayMs = getRetryDelayMs(response, attempt, baseDelayMs)
            await sleep(delayMs)
            continue
        }

        throw new Error(lastErrorMessage)
    }

    if (!response || !response.ok) {
        throw new Error(lastErrorMessage || "Gemini request failed")
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