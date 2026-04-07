import { useRef, useState } from "react"
import { Sparkles } from "lucide-react"
import { ChatHeader } from "./ChatHeader"
import { ChatInput } from "./ChatInput"
import { MessageList, type Message } from "./MessageList"

// ─── Constants ────────────────────────────────────────────────────────────────

const API_BASE = import.meta.env.VITE_SERVER_URL || "http://localhost:4000"
const OLLAMA_MODEL = import.meta.env.VITE_OLLAMA_MODEL || "qwen2.5:7b"

const GREETINGS = [
  "Hey! Ask me anything and I'll help you out.",
  "Ready to chat? Drop your question below.",
  "Hello! I can explain concepts, review code, or just chat. What's up?",
  "Hi there! Ask me anything.",
]

let _counter = 0
const makeId = () => `msg-${Date.now()}-${++_counter}`
const randomGreeting = () => GREETINGS[Math.floor(Math.random() * GREETINGS.length)]

// ─── Component ────────────────────────────────────────────────────────────────

interface AIAssistantProps {
  module?: string
  topic?: string
}

export default function AIAssistant({ module = "git", topic = "general" }: AIAssistantProps) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const greetingRef = useRef(randomGreeting())
  const abortRef = useRef<AbortController | null>(null)

  // ── Open / close ─────────────────────────────────────────────────────────────

  const openChat = () => {
    setOpen(true)
    if (messages.length === 0) {
      setMessages([{ id: makeId(), role: "bot", text: greetingRef.current, timestamp: new Date() }])
    }
    setTimeout(() => textareaRef.current?.focus(), 120)
  }

  const closeChat = () => {
    setOpen(false)
    abortRef.current?.abort()
  }

  const clearChat = () => {
    abortRef.current?.abort()
    setIsLoading(false)
    setMessages([{ id: makeId(), role: "bot", text: greetingRef.current, timestamp: new Date() }])
  }

  // ── Input handlers ────────────────────────────────────────────────────────────

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    e.target.style.height = "auto"
    e.target.style.height = Math.min(e.target.scrollHeight, 140) + "px"
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      void sendMessage()
    }
  }

  // ── Send (streaming) ──────────────────────────────────────────────────────────

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || isLoading) return

    const history = messages.filter((m) => !m.isError && m.text !== greetingRef.current)

    setMessages((prev) => [...prev, { id: makeId(), role: "user", text, timestamp: new Date() }])
    setInput("")
    if (textareaRef.current) textareaRef.current.style.height = "auto"
    setIsLoading(true)

    const botMsgId = makeId()
    setMessages((prev) => [
      ...prev,
      { id: botMsgId, role: "bot", text: "", timestamp: new Date(), isStreaming: true },
    ])

    const ctrl = new AbortController()
    abortRef.current = ctrl

    try {
      const res = await fetch(`${API_BASE}/api/ai/chat/stream`, {
        method: "POST",
        signal: ctrl.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, module, topic, history }),
      })

      if (!res.ok || !res.body) {
        const payload = await res.json().catch(() => null)
        throw new Error(payload?.message || `Request failed (${res.status})`)
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buf = ""
      let streamDone = false

      while (!streamDone) {
        const { done, value } = await reader.read()
        if (done) break

        buf += decoder.decode(value, { stream: true })
        const lines = buf.split("\n")
        buf = lines.pop() ?? ""

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue
          const data = line.slice(6)

          if (data === "[DONE]") { streamDone = true; break }

          try {
            const chunk = JSON.parse(data)
            if (chunk.error) throw new Error(chunk.error)
            if (chunk.token) {
              setMessages((prev) =>
                prev.map((m) => m.id === botMsgId ? { ...m, text: m.text + chunk.token } : m)
              )
            }
          } catch (e) {
            if (e instanceof Error && e.message !== "JSON parse error") throw e
          }
        }
      }

      setMessages((prev) =>
        prev.map((m) => m.id === botMsgId ? { ...m, isStreaming: false } : m)
      )
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        // Keep any partial text; just stop the streaming cursor
        setMessages((prev) =>
          prev.map((m) => m.id === botMsgId ? { ...m, isStreaming: false } : m)
            .filter((m) => m.id !== botMsgId || m.text.length > 0)
        )
      } else {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === botMsgId
              ? { ...m, text: err instanceof Error ? err.message : "Something went wrong.", isError: true, isStreaming: false }
              : m
          )
        )
      }
    } finally {
      setIsLoading(false)
      abortRef.current = null
      setTimeout(() => textareaRef.current?.focus(), 50)
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Trigger button */}
      <button
        type="button"
        onClick={openChat}
        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg border border-[#2E2E3A] bg-linear-to-b from-[#1F1F28] to-[#16161D] text-[13px] font-medium text-[#E8E8EC] shadow-[0_1px_2px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)] hover:from-[#27272F] hover:to-[#1C1C24] hover:text-white transition-all duration-150 cursor-pointer"
        aria-label="Open AI assistant"
        aria-expanded={open}
      >
        <Sparkles size={13} className="text-[#6C47FF]" />
        <span className="hidden sm:inline">AI Tutor</span>
      </button>

      {/* Backdrop */}
      {open && (
        <div className="fixed inset-0 z-40 bg-[#111114]/60 backdrop-blur-[2px]" onClick={closeChat} aria-hidden="true" />
      )}

      {/* Panel */}
      <aside
        className={`fixed top-0 right-0 bottom-0 w-full max-w-130 z-50 flex flex-col bg-background border-l border-border shadow-[0_0_60px_rgba(0,0,0,0.4)] transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "translate-x-full"}`}
        role="dialog"
        aria-label="AI Tutor"
        aria-modal="true"
      >
        <ChatHeader
          model={OLLAMA_MODEL}
          isLoading={isLoading}
          onClear={clearChat}
          onClose={closeChat}
        />

        <MessageList messages={messages} />

        <ChatInput
          value={input}
          isLoading={isLoading}
          model={OLLAMA_MODEL}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onSend={() => void sendMessage()}
          onStop={() => abortRef.current?.abort()}
          textareaRef={textareaRef}
        />
      </aside>
    </>
  )
}
