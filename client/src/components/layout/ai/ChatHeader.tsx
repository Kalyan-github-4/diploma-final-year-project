import { useEffect, useRef, useState } from "react"
import { Sparkles, Trash2, X, AudioLines, Check } from "lucide-react"
import { useVoicePreference, VOICE_OPTIONS } from "@/hooks/useVoicePreference"

interface ChatHeaderProps {
  model: string
  isLoading: boolean
  autoSpeak: boolean
  onClear: () => void
  onClose: () => void
  onToggleAutoSpeak: () => void
}

// ─── Voice Picker Popover ─────────────────────────────────────────────────────

function VoicePicker() {
  const { voiceId, setVoice } = useVoicePreference()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const current = VOICE_OPTIONS.find((v) => v.id === voiceId) ?? VOICE_OPTIONS[0]

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  const females = VOICE_OPTIONS.filter((v) => v.gender === "female")
  const males = VOICE_OPTIONS.filter((v) => v.gender === "male")

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className={[
          "flex h-7 items-center gap-1.5 rounded-md px-2 text-[11px] font-medium transition-colors",
          open
            ? "bg-[#6C47FF]/15 text-[#6C47FF]"
            : "text-(--text-tertiary) hover:text-(--text-secondary) hover:bg-(--bg-surface)",
        ].join(" ")}
        title="Change voice"
        aria-label="Voice settings"
        aria-expanded={open}
      >
        <AudioLines size={12} />
        <span className="hidden sm:inline max-w-18 truncate">{current.label}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1.5 z-50 w-72 rounded-xl border border-border bg-(--bg-elevated) shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden">
          {/* Header */}
          <div className="px-3.5 pt-3 pb-2 border-b border-border">
            <p className="text-[11px] font-semibold text-foreground">Voice</p>
            <p className="text-[10px] text-(--text-tertiary) mt-0.5">
              Used when you click the speak button on any message
            </p>
          </div>

          <div className="p-2 flex flex-col gap-3 max-h-72 overflow-y-auto">
            {/* Female voices */}
            <div>
              <p className="px-1.5 mb-1 text-[10px] font-semibold uppercase tracking-wider text-(--text-tertiary)">Female</p>
              <div className="flex flex-col gap-0.5">
                {females.map((v) => (
                  <VoiceRow
                    key={v.id}
                    voice={v}
                    selected={voiceId === v.id}
                    onSelect={() => { setVoice(v.id); setOpen(false) }}
                  />
                ))}
              </div>
            </div>

            {/* Male voices */}
            <div>
              <p className="px-1.5 mb-1 text-[10px] font-semibold uppercase tracking-wider text-(--text-tertiary)">Male</p>
              <div className="flex flex-col gap-0.5">
                {males.map((v) => (
                  <VoiceRow
                    key={v.id}
                    voice={v}
                    selected={voiceId === v.id}
                    onSelect={() => { setVoice(v.id); setOpen(false) }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div className="px-3.5 py-2 border-t border-border bg-(--bg-surface)/50">
            <p className="text-[10px] text-(--text-tertiary)">
              Powered by Kokoro TTS · falls back to browser speech if unavailable
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function VoiceRow({
  voice,
  selected,
  onSelect,
}: {
  voice: (typeof VOICE_OPTIONS)[number]
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        "flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg text-left transition-colors",
        selected
          ? "bg-[#6C47FF]/10 text-foreground"
          : "hover:bg-(--bg-surface) text-(--text-secondary)",
      ].join(" ")}
    >
      {/* Avatar */}
      <div
        className={[
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
          selected
            ? "bg-[#6C47FF]/20 text-[#6C47FF]"
            : "bg-(--bg-surface) text-(--text-tertiary)",
        ].join(" ")}
      >
        {voice.label[0]}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-[12px] font-medium truncate">{voice.label}</span>
          <span className="shrink-0 rounded-full border border-border px-1.5 py-px text-[9px] text-(--text-tertiary) uppercase tracking-wide">
            {voice.accent === "british" ? "UK" : "US"}
          </span>
        </div>
        <span className="text-[10px] text-(--text-tertiary) truncate block">{voice.description}</span>
      </div>

      {/* Check */}
      {selected && <Check size={12} className="shrink-0 text-[#6C47FF]" />}
    </button>
  )
}

// ─── Chat Header ──────────────────────────────────────────────────────────────

export function ChatHeader({
  model,
  isLoading,
  autoSpeak,
  onClear,
  onClose,
  onToggleAutoSpeak,
}: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-(--bg-elevated) shrink-0 gap-2">
      {/* Left: identity */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#6C47FF]/10">
          <Sparkles size={15} className="text-[#6C47FF]" />
        </div>
        <div className="min-w-0">
          <h2 className="text-[13px] font-semibold text-foreground leading-none">AI Assistant</h2>
          <p className="text-[11px] text-(--text-tertiary) font-mono flex items-center gap-1.5 mt-0.5">
            <span
              className={`w-1.5 h-1.5 rounded-full inline-block shrink-0 ${
                isLoading ? "bg-[#F59E0B] animate-pulse" : "bg-green-500"
              }`}
            />
            <span className="truncate">{model}</span>
          </p>
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-0.5 shrink-0">
        {/* Voice picker */}
        <VoicePicker />

        {/* Auto-speak toggle */}
        <button
          type="button"
          onClick={onToggleAutoSpeak}
          className={[
            "flex h-7 w-7 items-center justify-center rounded-md transition-colors",
            autoSpeak
              ? "text-[#6C47FF] bg-[#6C47FF]/10"
              : "text-(--text-tertiary) hover:text-(--text-secondary) hover:bg-(--bg-surface)",
          ].join(" ")}
          title={autoSpeak ? "Auto-speak on (click to disable)" : "Auto-speak off (click to enable)"}
          aria-label={autoSpeak ? "Disable auto-speak" : "Enable auto-speak"}
          aria-pressed={autoSpeak}
        >
          <AudioLines size={13} />
        </button>

        {/* Clear */}
        <button
          type="button"
          onClick={onClear}
          disabled={isLoading}
          className="flex h-7 w-7 items-center justify-center rounded-md text-(--text-tertiary) hover:text-(--text-secondary) hover:bg-(--bg-surface) transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          title="Clear conversation"
          aria-label="Clear chat"
        >
          <Trash2 size={13} />
        </button>

        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="flex h-7 w-7 items-center justify-center rounded-md text-(--text-tertiary) hover:text-(--text-secondary) hover:bg-(--bg-surface) transition-colors"
          aria-label="Close"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}
