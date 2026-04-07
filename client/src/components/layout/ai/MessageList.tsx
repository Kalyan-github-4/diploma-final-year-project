import { useEffect, useRef, useState } from "react"
import { Sparkles, Copy, Check, ChevronDown, Volume2, VolumeOff } from "lucide-react"
import { getStoredVoiceId } from "@/hooks/useVoicePreference"

export interface Message {
  id: string
  role: "user" | "bot"
  text: string
  timestamp: Date
  isError?: boolean
  isStreaming?: boolean
}

const fmtTime = (d: Date) => d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

// ─── Code block ───────────────────────────────────────────────────────────────

function CodeBlock({ lang, code }: { lang: string; code: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="rounded-xl border border-border overflow-hidden my-2">
      <div className="flex items-center justify-between px-3.5 py-2 bg-(--bg-surface) border-b border-border">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-(--text-tertiary) font-mono">
          {lang || "code"}
        </span>
        <button
          className="inline-flex items-center gap-1 text-[10px] text-(--text-tertiary) hover:text-(--text-secondary) rounded-md px-1.5 py-0.5 transition-colors"
          onClick={copy}
          title="Copy code"
        >
          {copied ? <Check size={11} className="text-green-500" /> : <Copy size={11} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="m-0 px-3.5 py-3 overflow-x-auto bg-[#0C0C0F]">
        <code className="font-mono text-[12px] leading-[1.7] text-(--text-secondary)">{code}</code>
      </pre>
    </div>
  )
}

// ─── Message body ─────────────────────────────────────────────────────────────

function MessageBody({ text, isError }: { text: string; isError?: boolean }) {
  if (isError) return <p className="m-0 whitespace-pre-wrap wrap-break-words text-red-400 text-[13px]">{text}</p>

  const segments = text.split(/(```[\s\S]*?```)/g)

  return (
    <div className="flex flex-col gap-0.5">
      {segments.map((seg, i) => {
        if (seg.startsWith("```") && seg.endsWith("```")) {
          const inner = seg.slice(3, -3)
          const nl = inner.indexOf("\n")
          const lang = nl > -1 ? inner.slice(0, nl).trim() : ""
          const code = nl > -1 ? inner.slice(nl + 1) : inner
          return <CodeBlock key={i} lang={lang} code={code} />
        }
        const parts = seg.split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
        return (
          <span key={i} className="whitespace-pre-wrap wrap-break-words text-[13px] leading-[1.7]">
            {parts.map((p, j) => {
              if (p.startsWith("**") && p.endsWith("**"))
                return <strong key={j} className="font-semibold text-foreground">{p.slice(2, -2)}</strong>
              if (p.startsWith("`") && p.endsWith("`"))
                return (
                  <code key={j} className="font-mono text-[11.5px] bg-[#6C47FF]/8 text-[#6C47FF] rounded-md px-1.5 py-px">
                    {p.slice(1, -1)}
                  </code>
                )
              return <span key={j}>{p}</span>
            })}
          </span>
        )
      })}
    </div>
  )
}

// ─── Typing dots ──────────────────────────────────────────────────────────────

function TypingDots() {
  return (
    <div className="flex gap-1 items-center h-5 px-1">
      <span className="w-1.5 h-1.5 rounded-full bg-[#6C47FF]/50 animate-bounce" style={{ animationDelay: "0s" }} />
      <span className="w-1.5 h-1.5 rounded-full bg-[#6C47FF]/50 animate-bounce" style={{ animationDelay: "0.15s" }} />
      <span className="w-1.5 h-1.5 rounded-full bg-[#6C47FF]/50 animate-bounce" style={{ animationDelay: "0.3s" }} />
    </div>
  )
}

// ─── Text-to-speech helper ───────────────────────────────────────────────────

function stripMarkdown(text: string) {
  return text
    .replace(/```[\s\S]*?```/g, " code block ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/[#\-*>]/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

const KOKORO_URL = "http://localhost:8880"

function SpeakButton({ text }: { text: string }) {
  const [speaking, setSpeaking] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      URL.revokeObjectURL(audioRef.current.src)
      audioRef.current = null
    }
    setSpeaking(false)
  }

  const toggle = async () => {
    if (speaking) {
      stop()
      return
    }

    setSpeaking(true)

    try {
      const res = await fetch(`${KOKORO_URL}/v1/audio/speech`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: stripMarkdown(text),
          voice: getStoredVoiceId(),
          model: "kokoro",
          response_format: "mp3",
        }),
      })

      if (!res.ok) throw new Error("Kokoro unavailable")

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const audio = new Audio(url)
      audioRef.current = audio
      audio.onended = () => {
        URL.revokeObjectURL(url)
        audioRef.current = null
        setSpeaking(false)
      }
      audio.onerror = () => stop()
      audio.play()
    } catch {
      // Fallback to browser TTS if Kokoro is down
      const utter = new SpeechSynthesisUtterance(stripMarkdown(text))
      utter.rate = 1
      utter.pitch = 1
      utter.onend = () => setSpeaking(false)
      utter.onerror = () => setSpeaking(false)
      speechSynthesis.speak(utter)
    }
  }

  useEffect(() => {
    return () => { stop(); speechSynthesis.cancel() }
  }, [])

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex items-center justify-center w-5 h-5 rounded-md text-(--text-tertiary) hover:text-[#6C47FF] transition-colors"
      title={speaking ? "Stop reading" : "Read aloud"}
      aria-label={speaking ? "Stop reading" : "Read aloud"}
    >
      {speaking ? <VolumeOff size={12} /> : <Volume2 size={12} />}
    </button>
  )
}

// ─── Message bubble ───────────────────────────────────────────────────────────

function MessageBubble({ msg }: { msg: Message }) {
  const isUser = msg.role === "user"

  return (
    <div className={`flex items-start gap-2.5 ${isUser ? "flex-row-reverse" : ""}`}>
      {!isUser && (
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#6C47FF]/10 mt-0.5">
          <Sparkles size={12} className="text-[#6C47FF]" />
        </div>
      )}
      <div
        className={[
          "max-w-[82%] rounded-2xl px-4 py-3",
          isUser
            ? "bg-linear-to-b from-[#6C47FF] to-[#5639CC] text-white shadow-[0_1px_3px_rgba(108,71,255,0.2),inset_0_1px_0_rgba(255,255,255,0.12)]"
            : "bg-(--bg-surface) border border-border text-(--text-secondary)",
          msg.isError ? "bg-red-500/5 border-red-500/20 text-red-400" : "",
        ].join(" ")}
      >
        {msg.isStreaming && msg.text === "" ? (
          <TypingDots />
        ) : (
          <>
            <MessageBody text={msg.text} isError={msg.isError} />
            {msg.isStreaming && (
              <span className="inline-block w-0.5 h-3.5 bg-[#6C47FF] rounded-sm ml-0.5 align-text-bottom animate-pulse" />
            )}
            <div className={`flex items-center mt-2 ${isUser ? "justify-end" : "justify-between"}`}>
              {!isUser && !msg.isStreaming && !msg.isError && msg.text && (
                <SpeakButton text={msg.text} />
              )}
              <time className={`text-[10px] select-none ${isUser ? "text-white/40" : "text-(--text-tertiary)/60"}`}>
                {fmtTime(msg.timestamp)}
              </time>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ─── Message list ─────────────────────────────────────────────────────────────

interface MessageListProps {
  messages: Message[]
}

export function MessageList({ messages }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showScrollBtn, setShowScrollBtn] = useState(false)

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    bottomRef.current?.scrollIntoView({ behavior })
  }

  const handleScroll = () => {
    const el = scrollRef.current
    if (!el) return
    setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 100)
  }

  useEffect(() => {
    if (!showScrollBtn) scrollToBottom()
  }, [messages, showScrollBtn])

  return (
    <div className="relative flex-1 min-h-0">
      <div
        ref={scrollRef}
        className="h-full overflow-y-auto px-5 py-5 flex flex-col gap-4"
        onScroll={handleScroll}
        role="log"
        aria-live="polite"
        style={{ scrollbarWidth: "thin", scrollbarColor: "var(--border-subtle) transparent" }}
      >
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}
        <div ref={bottomRef} />
      </div>

      {showScrollBtn && (
        <button
          type="button"
          className="absolute bottom-4 right-4 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-(--bg-elevated) text-(--text-tertiary) shadow-lg hover:bg-(--bg-surface) hover:text-(--text-secondary) transition-colors"
          onClick={() => scrollToBottom()}
          aria-label="Scroll to latest"
        >
          <ChevronDown size={14} />
        </button>
      )}
    </div>
  )
}
