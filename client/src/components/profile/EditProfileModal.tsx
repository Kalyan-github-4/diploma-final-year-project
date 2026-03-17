import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface ProfileForm {
  displayName: string
  title: string
  bio: string
}

interface EditProfileModalProps {
  open: boolean
  profile: ProfileForm
  onCancel: () => void
  onSave: (next: ProfileForm) => void
}

export default function EditProfileModal({
  open,
  profile,
  onCancel,
  onSave,
}: EditProfileModalProps) {
  const [draft, setDraft] = useState(profile)

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setDraft(profile)
    })
    return () => cancelAnimationFrame(frame)
  }, [profile, open])

  if (!open) return null

  return (
    <div className="profile-edit-inline">
      <div className="profile-edit-inline__fields">
        <label>
          <span>Name</span>
          <Input
            value={draft.displayName}
            onChange={(e) => setDraft((p) => ({ ...p, displayName: e.target.value }))}
          />
        </label>

        <label>
          <span>Title</span>
          <Input value={draft.title} onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))} />
        </label>

        <label>
          <span>Bio</span>
          <Textarea
            value={draft.bio}
            rows={2}
            onChange={(e) => setDraft((p) => ({ ...p, bio: e.target.value }))}
          />
        </label>
      </div>

      <div className="profile-edit-inline__actions">
        <button className="profile-btn profile-btn--outline" onClick={onCancel}>
          Cancel
        </button>
        <button className="profile-btn" onClick={() => onSave(draft)}>
          Save changes
        </button>
      </div>
    </div>
  )
}
