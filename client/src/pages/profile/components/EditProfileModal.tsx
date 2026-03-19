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
    <div className="mt-3.5 rounded-[10px] border border-border bg-[rgba(255,255,255,0.02)] p-3">
      <div className="grid grid-cols-2 gap-2.5 max-[720px]:grid-cols-1">
        <label className="flex flex-col gap-1.5 text-[12px] text-(--text-secondary)">
          <span>Name</span>
          <Input
            value={draft.displayName}
            onChange={(e) => setDraft((p) => ({ ...p, displayName: e.target.value }))}
          />
        </label>

        <label className="flex flex-col gap-1.5 text-[12px] text-(--text-secondary)">
          <span>Title</span>
          <Input value={draft.title} onChange={(e) => setDraft((p) => ({ ...p, title: e.target.value }))} />
        </label>

        <label className="col-span-2 flex flex-col gap-1.5 text-[12px] text-(--text-secondary) max-[720px]:col-span-1">
          <span>Bio</span>
          <Textarea
            value={draft.bio}
            rows={2}
            onChange={(e) => setDraft((p) => ({ ...p, bio: e.target.value }))}
          />
        </label>
      </div>

      <div className="mt-2.5 flex justify-end gap-2">
        <button
          type="button"
          className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-border bg-transparent px-3 py-2 text-[13px] font-semibold text-(--text-secondary)"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="button"
          className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-(--accent,#6366F1) bg-(--accent,#6366F1) px-3 py-2 text-[13px] font-semibold text-white"
          onClick={() => onSave(draft)}
        >
          Save changes
        </button>
      </div>
    </div>
  )
}
