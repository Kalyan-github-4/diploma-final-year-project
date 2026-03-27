const { env } = require("../config/env")

const OLLAMA_BASE = () => env.ollamaApiUrl || "http://localhost:11434"
const OLLAMA_MODEL = () => env.ollamaModel || "phi3:mini"

function buildSystemPrompt(module, topic) {
    const context = module && module !== "git" || topic && topic !== "general"
        ? ` The user is currently studying "${topic}" in the "${module}" module, so lean into that context when it's relevant.`
        : ""

    return `You are a friendly AI assistant on CodeKing, a coding education platform. Be concise and direct. Match the tone of the user's message. If they say "hi", just greet them naturally. If they ask a simple question, give a short answer (1-2 sentences max). Save lengthy explanations only for explicitly complex questions.${context} Use markdown code blocks for code. Never write long paragraphs unless directly asked. Prefer bullet points or numbered lists when explaining multiple things.`
}

function buildMessages(message, module, topic, history) {
    return [
        { role: "system", content: buildSystemPrompt(module, topic) },
        ...history.slice(-10).map((h) => ({
            role: h.role === "bot" ? "assistant" : "user",
            content: h.text,
        })),
        { role: "user", content: message },
    ]
}

// ─── Chat (non-streaming) ─────────────────────────────────────────────────────

async function generateAIReply(message, module = "git", topic = "branching", history = []) {
    const baseUrl = OLLAMA_BASE()
    const model = OLLAMA_MODEL()
    const timeoutMs = env.aiTimeoutMs || 60000

    const messages = buildMessages(message, module, topic, history)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

    try {
        const response = await fetch(`${baseUrl}/api/chat`, {
            method: "POST",
            signal: controller.signal,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ model, messages, stream: false, options: { num_predict: 256, temperature: 0.7 } }),
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
            const errText = await response.text()
            throw new Error(`Ollama error (${response.status}): ${errText}`)
        }

        const data = await response.json()
        const reply = data?.message?.content?.trim()
        if (!reply) throw new Error("Ollama returned an empty response")
        return reply
    } catch (err) {
        clearTimeout(timeoutId)
        if (err.name === "AbortError") {
            throw new Error("AI request timed out. The model may still be loading — please try again.")
        }
        throw new Error(`Ollama connection error: ${err.message}`)
    }
}

// ─── Chat (streaming — SSE) ───────────────────────────────────────────────────

async function streamAIReply(message, module = "git", topic = "branching", history = [], res) {
    const baseUrl = OLLAMA_BASE()
    const model = OLLAMA_MODEL()

    const messages = buildMessages(message, module, topic, history)

    // Set SSE headers before anything else
    res.setHeader("Content-Type", "text/event-stream; charset=utf-8")
    res.setHeader("Cache-Control", "no-cache")
    res.setHeader("Connection", "keep-alive")
    res.setHeader("X-Accel-Buffering", "no")
    res.flushHeaders()

    let ollamaRes
    try {
        ollamaRes = await fetch(`${baseUrl}/api/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ model, messages, stream: true, options: { num_predict: 256, temperature: 0.7 } }),
        })
    } catch (err) {
        res.write(`data: ${JSON.stringify({ error: `Cannot reach Ollama: ${err.message}` })}\n\n`)
        res.end()
        return
    }

    if (!ollamaRes.ok) {
        const errText = await ollamaRes.text()
        res.write(`data: ${JSON.stringify({ error: `Ollama error (${ollamaRes.status}): ${errText}` })}\n\n`)
        res.end()
        return
    }

    const reader = ollamaRes.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ""

    try {
        while (true) {
            const { done, value } = await reader.read()
            if (done) break

            buffer += decoder.decode(value, { stream: true })
            const lines = buffer.split("\n")
            buffer = lines.pop() ?? "" // keep any incomplete trailing line

            for (const line of lines) {
                if (!line.trim()) continue
                try {
                    const chunk = JSON.parse(line)
                    if (chunk.message?.content) {
                        res.write(`data: ${JSON.stringify({ token: chunk.message.content })}\n\n`)
                    }
                    if (chunk.done) {
                        res.write("data: [DONE]\n\n")
                    }
                } catch {
                    // skip malformed lines
                }
            }
        }
    } catch (err) {
        res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`)
    } finally {
        res.end()
    }
}

// ─── DSA Questions ────────────────────────────────────────────────────────────

function normalizeQuestionItem(item) {
    if (!item || typeof item !== "object") return null

    const stepId = typeof item.stepId === "string" ? item.stepId.trim() : ""
    const text = typeof item.text === "string" ? item.text.trim() : ""
    const explanation = typeof item.explanation === "string" ? item.explanation.trim() : ""
    const options = Array.isArray(item.options)
        ? item.options.filter((v) => typeof v === "string").map((v) => v.trim()).filter(Boolean)
        : []
    const correct = Number.isInteger(item.correct) ? item.correct : -1

    if (!stepId || !text || !explanation || options.length !== 4) return null
    if (correct < 0 || correct >= options.length) return null

    return { stepId, text, options, correct, explanation }
}

async function generateDSAQuestions({ algorithm, context, steps }) {
    const baseUrl = OLLAMA_BASE()
    const model = OLLAMA_MODEL()
    const timeoutMs = env.aiTimeoutMs || 120000

    const systemPrompt = [
        "You generate DSA predict-mode multiple-choice questions as strict JSON.",
        'Return only JSON with this exact shape: {"questions":[{"stepId":"string","text":"string","options":["A","B","C","D"],"correct":0,"explanation":"string"}]}',
        "Rules:",
        "- Keep each question tied to its stepId.",
        "- Exactly 4 options per question.",
        "- correct is the zero-based index of the correct option.",
        "- Questions must match the algorithm state and what happens next.",
        "- No markdown, no prose outside the JSON object.",
    ].join("\n")

    const messages = [
        { role: "system", content: systemPrompt },
        { role: "user", content: JSON.stringify({ algorithm, context, steps }) },
    ]

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

    try {
        const response = await fetch(`${baseUrl}/api/chat`, {
            method: "POST",
            signal: controller.signal,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ model, messages, stream: false, format: "json" }),
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
            const errText = await response.text()
            throw new Error(`Ollama DSA request failed (${response.status}): ${errText}`)
        }

        const data = await response.json()
        const raw = data?.message?.content?.trim()
        if (!raw) throw new Error("Ollama returned empty DSA response")

        let parsed
        try { parsed = JSON.parse(raw) } catch { throw new Error("AI returned invalid JSON for DSA questions") }

        const questions = Array.isArray(parsed?.questions) ? parsed.questions : []
        const normalized = questions.map(normalizeQuestionItem).filter(Boolean)
        if (!normalized.length) throw new Error("AI returned no valid DSA questions")
        return normalized
    } catch (err) {
        clearTimeout(timeoutId)
        if (err.name === "AbortError") throw new Error("DSA question generation timed out")
        throw err
    }
}

module.exports = { generateAIReply, streamAIReply, generateDSAQuestions }
