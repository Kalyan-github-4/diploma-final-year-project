import { useState } from "react"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import DangerZone from "./DangerZone"
import ChangePasswordModal from "./ChangePasswordModal"

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
  const [editorFont, setEditorFont] = useState("JetBrains Mono")
  const [missionReminders, setMissionReminders] = useState(true)
  const [streakAlerts, setStreakAlerts] = useState(true)
  const [newModuleAlerts, setNewModuleAlerts] = useState(false)

  return (
    <section className="rounded-xl border border-border p-4.5 [background:var(--bg-elevated,#141414)]">
      <div className="mb-3.5 flex items-center justify-between">
        <h2 className="font-gortesk text-[18px] font-bold text-foreground">
          Settings
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3 max-[720px]:grid-cols-1">
        <article className="flex flex-col gap-2.5 rounded-[10px] border border-border p-3">
          <h3 className="mb-2.5 font-gortesk text-[14px] font-semibold text-foreground">
            Account Settings
          </h3>

          <label className="flex flex-col gap-1.5 text-[12px] text-(--text-secondary)">
            <span>Name</span>
            <Input value={name} onChange={(e) => onNameChange(e.target.value)} />
          </label>

          <label className="flex flex-col gap-1.5 text-[12px] text-(--text-secondary)">
            <span>Email</span>
            <Input value={email} onChange={(e) => onEmailChange(e.target.value)} />
          </label>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-border bg-transparent px-3 py-2 text-[13px] font-semibold text-(--text-secondary)"
            >
              Send verification email
            </button>
            <button
              type="button"
              className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-border bg-transparent px-3 py-2 text-[13px] font-semibold text-(--text-secondary)"
              onClick={() => setChangePasswordOpen(true)}
            >
              Change Password
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <span>Avatar presets</span>
            <div className="flex gap-2">
              {AVATAR_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className={`h-11 w-11 cursor-pointer overflow-hidden rounded-[9999px] border ${avatarUrl === preset ? "border-(--accent,#6366f1)" : "border-border"}`}
                  onClick={() => onAvatarPreset(preset)}
                >
                  <img src={preset} alt="avatar preset" className="h-full w-full" />
                </button>
              ))}
            </div>
          </div>
        </article>

        <article className="flex flex-col gap-2.5 rounded-[10px] border border-border p-3">
          <h3 className="mb-2.5 font-gortesk text-[14px] font-semibold text-foreground">
            Preferences
          </h3>

          <div className="flex items-center justify-between">
            <span>Theme</span>
            <ThemeToggle />
          </div>

          <label className="flex flex-col gap-1.5 text-[12px] text-(--text-secondary)">
            <span>Editor font</span>
            <select
              value={editorFont}
              onChange={(e) => setEditorFont(e.target.value)}
              className="h-8.5 w-full rounded-lg border border-border bg-transparent px-2.5 text-foreground"
            >
              <option>JetBrains Mono</option>
              <option>Fira Code</option>
              <option>Cascadia Code</option>
            </select>
          </label>

          <div className="flex flex-col gap-1.5">
            <label className="inline-flex items-center gap-2 text-[13px] text-(--text-secondary)">
              <input
                type="checkbox"
                checked={missionReminders}
                onChange={(e) => setMissionReminders(e.target.checked)}
              />
              Mission reminders
            </label>
            <label className="inline-flex items-center gap-2 text-[13px] text-(--text-secondary)">
              <input
                type="checkbox"
                checked={streakAlerts}
                onChange={(e) => setStreakAlerts(e.target.checked)}
              />
              Streak alerts
            </label>
            <label className="inline-flex items-center gap-2 text-[13px] text-(--text-secondary)">
              <input
                type="checkbox"
                checked={newModuleAlerts}
                onChange={(e) => setNewModuleAlerts(e.target.checked)}
              />
              New module alerts
            </label>
          </div>
        </article>
      </div>

      <DangerZone />

      <ChangePasswordModal open={changePasswordOpen} onOpenChange={setChangePasswordOpen} />
    </section>
  )
}
