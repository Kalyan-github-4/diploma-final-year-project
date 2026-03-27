import { useRef } from "react"
import { Camera } from "lucide-react"
import EditProfileModal from "./EditProfileModal"
import { Button } from "@/components/ui/button"
import { Pencil, X } from "lucide-react"

interface ProfileState {
  avatarUrl: string
  displayName: string
  title: string
  level: number
  bio: string
  memberSince: string
}

interface ProfileEditorValues {
  displayName: string
  title: string
  bio: string
}

interface ProfileHeaderProps {
  profile: ProfileState
  isEditing: boolean
  onToggleEdit: () => void
  onSave: (next: ProfileEditorValues) => void
  onAvatarChange: (file: File) => void
}

export default function ProfileHeader({
  profile,
  isEditing,
  onToggleEdit,
  onSave,
  onAvatarChange,
}: ProfileHeaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <section className="rounded-xl border border-border p-4.5 [background:var(--bg-elevated,#141414)]">
      <div className="flex justify-end">
        <Button
          type="button"
          className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-border bg-transparent px-3 py-2 text-[13px] font-semibold text-(--text-secondary) hover:text-white transition-colors"
          onClick={onToggleEdit}
        >
          {isEditing ? <X /> : <Pencil />}
        </Button>
      </div>

      <div className="flex items-center gap-4.5 max-[720px]:flex-col max-[720px]:items-start">
        <button
          type="button"
          className="group relative h-24 w-24 shrink-0 cursor-pointer overflow-hidden rounded-full border border-border"
          onClick={() => fileInputRef.current?.click()}
          title="Change avatar"
        >
          <img src={profile.avatarUrl} alt={`${profile.displayName} avatar`} className="h-full w-full" />
          <span className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100">
            <Camera size={18} />
          </span>
        </button>

        <div className="flex flex-col gap-1.25">
          <h1 className="text-[30px] font-extrabold leading-[1.1] tracking-[-0.02em] font-['Space_Grotesk',sans-serif]">
            {profile.displayName}
          </h1>
          <p className="font-medium text-(--text-secondary)">{profile.title}</p>
          <span className="inline-flex items-center rounded-[9999px] border border-[rgba(99,102,241,0.45)] px-2.5 py-1 text-[12px] font-semibold text-(--accent,#6366f1)">
            LVL {profile.level}
          </span>
          <p className="text-foreground">{profile.bio.trim() ? profile.bio : "No bio yet"}</p>
          <p className="text-[12px] text-(--text-tertiary)">Member since {profile.memberSince}</p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onAvatarChange(file)
        }}
      />

      <EditProfileModal
        open={isEditing}
        profile={{
          displayName: profile.displayName,
          title: profile.title,
          bio: profile.bio,
        }}
        onCancel={onToggleEdit}
        onSave={onSave}
      />
    </section>
  )
}
