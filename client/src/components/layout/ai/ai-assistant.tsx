import { useState, useEffect, useRef } from "react"
import { Bot, X } from "lucide-react"

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
  // Start with empty messages — greeting only lives in the bubble, not duplicated in chat
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([])
  const [showGreetingBubble, setShowGreetingBubble] = useState(false)
  const [input, setInput] = useState("")
  const panelRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const hasInteractedRef = useRef(false)
  const sendingRef = useRef(false)
  const openChat = () => {
    setOpen(true)
    setShowGreetingBubble(false)
    hasInteractedRef.current = true
    // On first open, seed the chat with the greeting so it doesn't feel empty
    setMessages(prev =>
      prev.length === 0 ? [{ role: "bot", text: bubbleGreeting }] : prev
    )
  }

  const sendMessage = async () => {
    if (!open) return
    if (!input.trim()) return
    if (sendingRef.current) return // Prevent multiple sends
    const userText = input

    const userMessage = { role: "user", text: input }
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

  // Close panel on outside click or Escape key
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false)
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Show greeting bubble a few seconds after page load
  useEffect(() => {
    if (hasInteractedRef.current) return // Don't show if user has already interacted
    const timer = setTimeout(() => setShowGreetingBubble(true), 4000)
    return () => clearTimeout(timer)
  }, [])

  // Auto hide greeting bubble after it becomes visible
  useEffect(() => {
    if (!showGreetingBubble) return

    const hideTimer = setTimeout(() => {
      setShowGreetingBubble(false)
    }, 7000) // bubble visible for 7 sec

    return () => clearTimeout(hideTimer)
  }, [showGreetingBubble])


  const toggleChat = () => {
    const next = !open
    setOpen(next)
    if (next) {
      setShowGreetingBubble(false)
      setMessages(m => m.length === 0 ? [{ role: "bot", text: bubbleGreeting }] : m)
    }
  }
  return (
    <>
      {/* Chat Panel */}
      {open && (
        <div
          className="fixed bottom-24 right-6 w-80 h-96 bg-(--bg-elevated) border border-border rounded-xl shadow-lg flex flex-col z-50"
          ref={panelRef}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Bot size={18} />
              <span className="text-sm font-medium">AI Assistant</span>
            </div>
            <button onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
          </div>

          {/* Chat Area */}
          <div className="flex-1 p-3 overflow-y-auto text-sm space-y-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`max-w-[75%] px-3 py-2 rounded-lg ${msg.role === "user"
                  ? "ml-auto bg-(--accent) text-white"
                  : "bg-(--bg-surface)"
                  }`}
              >
                {msg.text}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-2 border-t border-border">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask something..."
              className="w-full bg-(--bg-surface) rounded-md px-3 py-2 text-sm outline-none"
            />
          </div>
        </div>
      )}

      {/* Greeting Bubble — sits above the FAB, no position conflict with the panel */}
      {showGreetingBubble && !open && (
        <div className="fixed bottom-24 right-6 z-50 flex flex-col items-end gap-1 animate-fade-in">
          <div
            onClick={openChat}
            className="max-w-55 bg-(--bg-elevated) border border-border shadow-lg rounded-xl px-3 py-2 text-sm cursor-pointer"
          >
            🤖 {bubbleGreeting}
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-(--accent) hover:bg-(--accent-hover) text-white flex items-center justify-center shadow-lg z-50 cursor-pointer"
      >
        <Bot size={24} />
      </button>
    </>
  )
}