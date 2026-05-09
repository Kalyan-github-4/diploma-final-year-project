const { env } = require("../config/env")

const OLLAMA_MODEL = () => env.ollamaModel || "qwen2.5:7b"
const DEFAULT_OLLAMA_BASES = ["http://localhost:11434", "http://host.docker.internal:11434", "http://ollama:11434"]
const DEFAULT_TTS_BASES = ["http://localhost:8880", "http://host.docker.internal:8880", "http://kokoro:8880"]

function getOllamaBaseCandidates() {
    const configured = [
        ...(Array.isArray(env.ollamaApiUrls) ? env.ollamaApiUrls : []),
        env.ollamaApiUrl,
    ]
        .filter((url) => typeof url === "string" && url.trim())
        .map((url) => url.replace(/\/+$/, ""))

    const merged = [...configured, ...DEFAULT_OLLAMA_BASES]
    return Array.from(new Set(merged))
}

async function requestOllama(path, body, signal) {
    const candidates = getOllamaBaseCandidates()
    // Streaming responses must not have a short timeout — the response body can take minutes.
    // For non-streaming calls the caller already supplies an AbortController signal.
    // We only add a per-candidate 5s connect timeout for non-streaming calls so that
    // unreachable hosts fail fast without blocking the candidate chain.
    const isStreaming = body?.stream === true
    let lastError = null

    for (const baseUrl of candidates) {
        const fetchSignal = isStreaming
            ? signal   // no extra timeout — let the stream run until done or caller aborts
            : signal
                ? AbortSignal.any([signal, AbortSignal.timeout(5000)])
                : AbortSignal.timeout(5000)

        try {
            const response = await fetch(`${baseUrl}${path}`, {
                method: "POST",
                signal: fetchSignal,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            })

            return { response, baseUrl }
        } catch (err) {
            // If the outer signal was aborted (user cancel / global timeout), stop immediately
            if (signal?.aborted) throw err
            lastError = err
        }
    }

    const details = lastError && typeof lastError.message === "string" ? lastError.message : "Unknown network error"
    throw new Error(`Cannot reach Ollama. Tried: ${candidates.join(", ")}. Last error: ${details}`)
}

function getTTSBaseCandidates() {
    const configured = [
        ...(Array.isArray(env.ttsApiUrls) ? env.ttsApiUrls : []),
        env.ttsApiUrl,
    ]
        .filter((url) => typeof url === "string" && url.trim())
        .map((url) => url.replace(/\/+$/, ""))

    const merged = [...configured, ...DEFAULT_TTS_BASES]
    return Array.from(new Set(merged))
}

async function requestTTS(path, body) {
    const candidates = getTTSBaseCandidates()
    let lastError = null

    for (const baseUrl of candidates) {
        try {
            const response = await fetch(`${baseUrl}${path}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            })

            return { response, baseUrl }
        } catch (err) {
            lastError = err
        }
    }

    const details = lastError && typeof lastError.message === "string" ? lastError.message : "Unknown network error"
    throw new Error(`Cannot reach TTS service. Tried: ${candidates.join(", ")}. Last error: ${details}`)
}

function buildSystemPrompt(module, topic) {
    const moduleContext = module && module !== "git" || topic && topic !== "general"
        ? `\nThe user is currently studying "${topic}" in the "${module}" module, so lean into that context when it's relevant.`
        : ""

    return `You are the AI Tutor on CodeKing. You MUST only describe features that actually exist. Never invent or hallucinate features.

WHAT IS CODEKING:
CodeKing is an open-source visual coding education platform. The core philosophy is "improve logic over coding" — students don't just write code, they VISUALIZE how code works through interactive visual engines. Instead of reading theory or typing syntax, learners see algorithms animate step-by-step, simulate Git operations in a visual terminal, and build CSS layouts with live feedback.

CodeKing is open-source and community-driven. Developers can contribute their own modules with custom visual engines for any programming concept. Contributors get credited on their module cards — their GitHub profile and avatar are displayed (similar to how 21st.dev credits component authors). This means anyone can build a visual learning experience for a topic they're passionate about and share it with the community.

Created by Kalyan Manna. It is NOT a forum, does NOT have eBooks, and is NOT a generic code editor.

CURRENT MODULES (contributed visual engines):
1. Git & GitHub (by Kalyan Manna) — Interactive Git terminal simulator. Learners visualize commits, branches, merging, rebasing, and GitHub workflows. Level-based progression with hands-on practice.
2. DSA - Data Structures & Algorithms (by Kalyan Manna) — Visual algorithm learning with step-by-step animations. Covers: Binary Search, Bubble Sort, BFS, Stack, Queue, Dijkstra. Features "predict mode" where users guess the next algorithm step before it executes. Includes challenge problems per algorithm.
3. CSS Layout (by Kalyan Manna) — Interactive CSS Flexbox and Grid challenges with live visual feedback.
More modules can be added by open-source contributors.

PLATFORM FEATURES:
- Dashboard: Overview of progress across all modules
- Modules page: Browse available visual learning modules (each shows contributor credit)
- Playground: Free-practice sandboxes for Git, DSA, and CSS
- Missions: Task-based challenges to earn XP
- Leaderboard: Rank among other learners
- Progress tracking: XP system, level progression per module
- Profile page: User stats and achievements
- AI Tutor (you): Context-aware assistant across the platform

RULES:
- If asked about CodeKing, ONLY mention what's listed above
- Emphasize the visual/interactive learning approach — that's what makes CodeKing unique
- If unsure whether a feature exists, say "I'm not sure if that's available yet"
- You can still answer general programming questions accurately
- Be concise and direct. Short answers for simple questions.
- Use markdown code blocks for code. Prefer bullet points for lists.${moduleContext}`
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
    const model = OLLAMA_MODEL()
    const timeoutMs = env.aiTimeoutMs || 60000

    const messages = buildMessages(message, module, topic, history)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

    try {
        const { response } = await requestOllama(
            "/api/chat",
            { model, messages, stream: false, options: { num_predict: 1024, temperature: 0.7 } },
            controller.signal
        )

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
        const { response } = await requestOllama(
            "/api/chat",
            { model, messages, stream: true, options: { num_predict: 1024, temperature: 0.7 } }
        )
        ollamaRes = response
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
        const { response } = await requestOllama(
            "/api/chat",
            { model, messages, stream: false, format: "json" },
            controller.signal
        )

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

async function synthesizeSpeech({ input, voice, model = "kokoro", response_format = "mp3" }) {
    const payload = { input, voice, model, response_format }
    const { response } = await requestTTS("/v1/audio/speech", payload)

    if (!response.ok) {
        const errText = await response.text().catch(() => "")
        throw new Error(`TTS error (${response.status}): ${errText}`)
    }

    const contentType = response.headers.get("content-type") || "audio/mpeg"
    const audioBuffer = Buffer.from(await response.arrayBuffer())
    return { contentType, audioBuffer }
}

module.exports = { generateAIReply, streamAIReply, generateDSAQuestions, synthesizeSpeech, getOllamaBaseCandidates }
