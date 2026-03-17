import { useEffect, useRef, useState } from "react"
import { Bot, SendHorizontal } from "lucide-react"
import { Drawer } from "@/components/ui/drawer"

type AIAssistantProp = {
  module?: string
  topic?: string
}

const API_BASE = import.meta.env.VITE_SERVER_URL || "http://localhost:4000"

const greetings = [
  "Hey coder 👋 Need help with this mission?",
  "Hi there 🚀 Ready to conquer Git today?",
  "Hello 👨‍💻 Stuck somewhere? I can help.",
  "Yo developer 😄 Want a quick hint?",
  "Welcome back 🔥 Let's complete this challenge."
]

export default function AIAssistant({ module, topic }: AIAssistantProp) {
  const [open, setOpen] = useState(false)
  const [bubbleGreeting] = useState(
    () => greetings[Math.floor(Math.random() * greetings.length)]
  )
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([])
  const [input, setInput] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)
  const sendingRef = useRef(false)

  const openChat = () => {
    setOpen(true)
    setMessages(prev =>
      prev.length === 0 ? [{ role: "bot", text: bubbleGreeting }] : prev
    )
  }

  const sendMessage = async () => {
    if (!open) return
    if (!input.trim()) return
    if (sendingRef.current) return
    sendingRef.current = true
    const userText = input.trim()

    const userMessage = { role: "user", text: userText }
    setInput("")
    const thinkingMsg = { role: "bot", text: "Thinking... 🤖" }
    setMessages(prev => [...prev, userMessage, thinkingMsg])

    try {
      const response = await fetch(`${API_BASE}/api/ai/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userText,
          module: module || "git",
          topic: topic || "branching"
        })
      })

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => null)
        throw new Error(errorPayload?.message || errorPayload?.error || `AI request failed (${response.status})`)
      }

      const data = await response.json()
      setMessages(prev => [
        ...prev.slice(0, -1),
        { role: "bot", text: data.reply }
      ])
    } catch (error) {
      console.error("AI API error:", error)
      setMessages(prev => [
        ...prev.slice(0, -1),
        { role: "bot", text: error instanceof Error ? error.message : "AI server error 😢" }
      ])
    } finally {
      sendingRef.current = false
    }
  }

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <>
      <button
        type="button"
        onClick={openChat}
        className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-(--bg-elevated) px-3 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-(--bg-surface)"
        aria-label="Open AI assistant"
      >
        <Bot size={18} />
        <span className="hidden sm:inline">AI Assistant</span>
      </button>

      <Drawer
        isOpen={open}
        onClose={() => setOpen(false)}
        title="AI Assistant"
        position="right"
        size="lg"
        className="border-l border-border bg-(--bg-elevated)"
      >
        <div className="flex h-full flex-col">
          <div className="border-b border-border px-6 py-4">
            <p className="text-sm font-medium text-foreground">Ask about {topic || "this topic"}</p>
            <p className="mt-1 text-xs text-(--text-secondary)">Context: {module || "git"}</p>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto px-6 py-5 text-sm">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 leading-6 ${msg.role === "user"
                    ? "bg-(--accent) text-white"
                    : "border border-border bg-(--bg-surface) text-foreground"
                    }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border bg-(--bg-surface) px-4 py-5 text-(--text-secondary)">
                Ask for hints, explanations, debugging help, or a step-by-step breakdown of the current lesson.
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="border-t border-border px-5 py-4">
            <div className="flex items-end gap-3 rounded-2xl border border-border bg-(--bg-surface) p-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    void sendMessage()
                  }
                }}
                rows={1}
                placeholder="Ask something..."
                className="max-h-32 min-h-10 flex-1 resize-none bg-transparent text-sm outline-none placeholder:text-(--text-secondary)"
              />
              <button
                type="button"
                onClick={() => void sendMessage()}
                disabled={!input.trim() || sendingRef.current}
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-(--accent) text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="Send message"
              >
                <SendHorizontal size={18} />
              </button>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  )
}