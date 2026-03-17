import { useRef } from "react"
import { Camera } from "lucide-react"
import EditProfileModal from "./EditProfileModal"

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
    <section className="profile-section profile-header">
      <div className="profile-header__top">
        <button className="profile-btn profile-btn--outline" onClick={onToggleEdit}>
          {isEditing ? "Close Edit" : "Edit Profile"}
        </button>
      </div>

      <div className="profile-header__content">
        <button
          className="profile-header__avatar-wrap"
          onClick={() => fileInputRef.current?.click()}
          title="Change avatar"
        >
          <img src={profile.avatarUrl} alt={`${profile.displayName} avatar`} className="profile-header__avatar" />
          <span className="profile-header__avatar-overlay">
            <Camera size={18} />
          </span>
        </button>

        <div className="profile-header__identity">
          <h1>{profile.displayName}</h1>
          <p className="profile-header__title">{profile.title}</p>
          <span className="profile-pill">LVL {profile.level}</span>
          <p className="profile-header__bio">{profile.bio.trim() ? profile.bio : "No bio yet"}</p>
          <p className="profile-header__member">Member since {profile.memberSince}</p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="profile-hidden-input"
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
