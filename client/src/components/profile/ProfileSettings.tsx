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
    <section className="profile-section">
      <div className="profile-section__header">
        <h2>Settings</h2>
      </div>

      <div className="profile-settings-grid">
        <article className="profile-settings-card">
          <h3 className="profile-subheading">Account Settings</h3>

          <label>
            <span>Name</span>
            <Input value={name} onChange={(e) => onNameChange(e.target.value)} />
          </label>

          <label>
            <span>Email</span>
            <Input value={email} onChange={(e) => onEmailChange(e.target.value)} />
          </label>

          <div className="profile-settings-inline-actions">
            <button className="profile-btn profile-btn--outline">Send verification email</button>
            <button className="profile-btn profile-btn--outline" onClick={() => setChangePasswordOpen(true)}>
              Change Password
            </button>
          </div>

          <div className="profile-avatar-presets">
            <span>Avatar presets</span>
            <div className="profile-avatar-presets__grid">
              {AVATAR_PRESETS.map((preset) => (
                <button
                  key={preset}
                  className={`profile-avatar-preset ${avatarUrl === preset ? "profile-avatar-preset--active" : ""}`}
                  onClick={() => onAvatarPreset(preset)}
                >
                  <img src={preset} alt="avatar preset" />
                </button>
              ))}
            </div>
          </div>
        </article>

        <article className="profile-settings-card">
          <h3 className="profile-subheading">Preferences</h3>

          <div className="profile-settings-row">
            <span>Theme</span>
            <ThemeToggle />
          </div>

          <label>
            <span>Editor font</span>
            <select value={editorFont} onChange={(e) => setEditorFont(e.target.value)}>
              <option>JetBrains Mono</option>
              <option>Fira Code</option>
              <option>Cascadia Code</option>
            </select>
          </label>

          <div className="profile-settings-toggles">
            <label>
              <input
                type="checkbox"
                checked={missionReminders}
                onChange={(e) => setMissionReminders(e.target.checked)}
              />
              Mission reminders
            </label>
            <label>
              <input
                type="checkbox"
                checked={streakAlerts}
                onChange={(e) => setStreakAlerts(e.target.checked)}
              />
              Streak alerts
            </label>
            <label>
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
