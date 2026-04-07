import { useState } from "react"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import DangerZone from "./DangerZone"
import ChangePasswordModal from "./ChangePasswordModal"
import { Button } from "@/components/ui/button"
import { Volume2 } from "lucide-react"
import { useVoicePreference, VOICE_OPTIONS } from "@/hooks/useVoicePreference"

interface ProfileSettingsProps {
  name: string
  email: string
  avatarUrl: string
  onNameChange: (value: string) => void
  onEmailChange: (value: string) => void
  onAvatarPreset: (url: string) => void
}

const AVATAR_PRESETS = [
  "https://api.dicebear.com/9.x/shapes/svg?seed=Kalyan",
  "https://api.dicebear.com/9.x/shapes/svg?seed=CodeKing",
  "https://api.dicebear.com/9.x/shapes/svg?seed=Builder",
]

export default function ProfileSettings({
  name,
  email,
  avatarUrl,
  onNameChange,
  onEmailChange,
  onAvatarPreset,
}: ProfileSettingsProps) {
  const [changePasswordOpen, setChangePasswordOpen] = useState(false)
  const { voiceId, setVoice } = useVoicePreference()
  const [previewLoading, setPreviewLoading] = useState<string | null>(null)

  const previewVoice = async (id: string) => {
    setPreviewLoading(id)
    try {
      const res = await fetch("http://localhost:8880/v1/audio/speech", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: "Hey! I'm your AI tutor on CodeKing. Let's learn something awesome today!",
          voice: id,
          model: "kokoro",
          response_format: "mp3",
        }),
      })
      if (!res.ok) throw new Error()
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const audio = new Audio(url)
      audio.onended = () => URL.revokeObjectURL(url)
      audio.play()
    } catch {
      // Fallback browser preview
      const utter = new SpeechSynthesisUtterance("Hey! I'm your AI tutor on CodeKing.")
      speechSynthesis.speak(utter)
    } finally {
      setPreviewLoading(null)
    }
  }

  return (
    <section className="rounded-xl border border-border p-4.5 [background:var(--bg-elevated,#141414)]">
      <div className="mb-3.5 flex items-center justify-between">
        <h2 className="font-gortesk text-[18px] font-bold text-foreground">
          Settings
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-3 max-[900px]:grid-cols-2 max-[600px]:grid-cols-1">
        <article className="flex flex-col gap-2.5 rounded-[10px] border border-border p-3">
          <div className="flex items-center justify-between">
            <h3 className="mb-2.5 font-gortesk text-[14px] font-semibold text-foreground">
              Account Settings
            </h3>
            <ThemeToggle />
          </div>

          <label className="flex flex-col gap-1.5 text-[12px] text-(--text-secondary)">
            <span>Name</span>
            <Input value={name} onChange={(e) => onNameChange(e.target.value)} />
          </label>

          <label className="flex flex-col gap-1.5 text-[12px] text-(--text-secondary)">
            <span>Email</span>
            <Input value={email} onChange={(e) => onEmailChange(e.target.value)} />
          </label>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-border bg-transparent px-3 py-2 text-[13px] font-semibold text-(--text-secondary)"
            >
              Send verification email
            </Button>
            <Button
              type="button"
              className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-border bg-transparent px-3 py-2 text-[13px] font-semibold text-(--text-secondary)"
              onClick={() => setChangePasswordOpen(true)}
            >
              Change Password
            </Button>
          </div>

          <div className="flex flex-col gap-2">
            <span>Avatar presets</span>
            <div className="flex gap-2">
              {AVATAR_PRESETS.map((preset) => (
                <div
                  key={preset}
                  className={`h-11 w-11 cursor-pointer overflow-hidden rounded-[9999px] border-2 ${avatarUrl === preset ? "border-(--accent)" : "border-border"}`}
                  onClick={() => onAvatarPreset(preset)}
                >
                  <img src={preset} alt="avatar preset" className="h-full w-full" />
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className="flex flex-col gap-3 rounded-[10px] border border-border p-3">
          <h3 className="font-gortesk text-[14px] font-semibold text-foreground">
            AI Voice
          </h3>
          <p className="text-[11px] text-(--text-tertiary) -mt-1">
            Choose how the AI Tutor sounds when reading responses aloud.
          </p>

          <div className="grid grid-cols-2 gap-2">
            {VOICE_OPTIONS.map((voice) => (
              <button
                key={voice.id}
                type="button"
                onClick={() => setVoice(voice.id)}
                className={`flex items-center gap-2.5 rounded-lg border p-2.5 text-left transition-all cursor-pointer ${
                  voiceId === voice.id
                    ? "border-[#6C47FF] bg-[#6C47FF]/5"
                    : "border-border hover:border-(--border-hover)"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12px] font-semibold text-foreground">{voice.label}</span>
                    <span className="text-[10px] text-(--text-tertiary) capitalize">{voice.gender}</span>
                    {voice.accent === "british" && (
                      <span className="text-[9px] bg-(--bg-surface) border border-border rounded px-1 py-px text-(--text-tertiary)">UK</span>
                    )}
                  </div>
                  <p className="text-[10px] text-(--text-tertiary) mt-0.5">{voice.description}</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    previewVoice(voice.id)
                  }}
                  disabled={previewLoading === voice.id}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-border text-(--text-tertiary) hover:text-[#6C47FF] hover:border-[#6C47FF]/30 transition-colors disabled:opacity-40"
                  title="Preview voice"
                >
                  {previewLoading === voice.id ? (
                    <span className="w-3 h-3 border-2 border-(--text-tertiary) border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Volume2 size={12} />
                  )}
                </button>
              </button>
            ))}
          </div>
        </article>

        <article className="flex flex-col gap-4 rounded-[10px] border border-border p-4">
  <h3 className="font-gortesk text-[14px] font-semibold text-foreground">
    Profile Overview
  </h3>

  {/* Avatar + Name */}
  <div className="flex items-center gap-3">
    <div className="h-14 w-14 overflow-hidden rounded-full border border-border">
      <img src={avatarUrl} alt="avatar" className="h-full w-full" />
    </div>

    <div className="flex flex-col">
      <span className="text-[14px] font-semibold text-foreground">
        {name}
      </span>
      <span className="text-[12px] text-(--text-secondary)">
        {email}
      </span>
    </div>
  </div>

  {/* Divider */}
  <div className="h-px bg-border" />

  {/* Stats */}
  <div className="grid grid-cols-2 gap-3">
    <div className="flex flex-col">
      <span className="text-[11px] text-muted-foreground">Streak</span>
      <span className="text-[16px] font-semibold">5 🔥</span>
    </div>

    <div className="flex flex-col">
      <span className="text-[11px] text-muted-foreground">Missions</span>
      <span className="text-[16px] font-semibold">12</span>
    </div>
  </div>

  {/* Small motivation text */}
  <div className="rounded-md bg-muted/30 p-2 text-[12px] text-(--text-secondary)">
    Keep going. You're building consistency 🚀
  </div>
</article>
      </div>

      <DangerZone />

      <ChangePasswordModal open={changePasswordOpen} onOpenChange={setChangePasswordOpen} />
    </section>
  )
}
