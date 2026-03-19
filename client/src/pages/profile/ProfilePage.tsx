import { useMemo, useState } from "react"
import ProfileHeader from "@/pages/profile/components/ProfileHeader"
import QuickStats, { type QuickStat } from "@/pages/profile/components/QuickStats"
import SkillsSnapshot from "@/pages/profile/components/SkillsSnapshot"
import BadgeGrid from "@/pages/profile/components/BadgeGrid"
import type { Badge } from "@/pages/profile/components/BadgeCard"
import ActivityHeatmap from "@/pages/profile/components/ActivityHeatmap"
import ActivityFeed, { type ActivityItem } from "@/pages/profile/components/ActivityFeed"
import ProfileSettings from "@/pages/profile/components/ProfileSettings"

interface ProfileState {
  avatarUrl: string
  displayName: string
  title: string
  level: number
  bio: string
  memberSince: string
  email: string
}

const QUICK_STATS: QuickStat[] = [
  { id: "xp", value: "18,420", label: "Total XP earned" },
  { id: "lvl", value: "24", label: "Current Level" },
  { id: "topics", value: "37", label: "Topics completed" },
  { id: "challenges", value: "129", label: "Challenges solved", icon: "target" },
  { id: "streak", value: "14 🔥", label: "Current streak", icon: "flame" },
  { id: "perfect", value: "22", label: "Perfect scores", icon: "trophy" },
  { id: "hints", value: "48", label: "Total hints used" },
  { id: "missions", value: "64", label: "Missions completed", icon: "sparkles" },
]

const SKILLS = [
  { id: "git", moduleName: "Git & GitHub", progress: 82, completedTopics: 14, totalTopics: 17 },
  { id: "css", moduleName: "CSS Flexbox", progress: 58, completedTopics: 9, totalTopics: 15 },
  {
    id: "dsa",
    moduleName: "Data Structures",
    progress: 0,
    completedTopics: 0,
    totalTopics: 12,
    comingSoon: true,
  },
]

const PROFILE_BADGES: Badge[] = [
  { id: "badge-1", name: "Scripting Guru", image: "/badge-1.png" },
  { id: "badge-2", name: "Bug Hunter", image: "/badge-2.png" },
  { id: "badge-3", name: "Code Master", image: "/badge-3.png" },
]

function generateYearActivity() {
  const days: { date: string; xp: number; topics: number }[] = []
  const today = new Date()

  for (let i = 363; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)

    const signal = (i * 13 + 7) % 10
    const xp = signal < 3 ? 0 : signal < 5 ? 28 : signal < 7 ? 64 : signal < 9 ? 118 : 190
    const topics = xp === 0 ? 0 : xp < 60 ? 1 : xp < 120 ? 2 : 3

    days.push({
      date: date.toISOString(),
      xp,
      topics,
    })
  }

  return days
}

const RECENT_ACTIVITY: ActivityItem[] = Array.from({ length: 20 }).map((_, index) => {
  const types: ActivityItem["type"][] = ["topic", "challenge", "streak", "badge", "mission", "level"]
  const type = types[index % types.length]
  const labels: Record<ActivityItem["type"], string> = {
    topic: "Completed Git rebasing topic",
    challenge: "Solved Flexbox alignment challenge",
    streak: "Hit a streak milestone",
    badge: "Unlocked Merge Hero badge",
    mission: "Completed daily mission",
    level: "Leveled up to a new rank",
  }

  const date = new Date()
  date.setHours(date.getHours() - index * 3)

  return {
    id: `act-${index}`,
    type,
    description: labels[type],
    xp: 80 + ((index * 17) % 170),
    timestamp: date.toISOString(),
  }
})

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileState>({
    avatarUrl: "https://api.dicebear.com/9.x/shapes/svg?seed=Kalyan",
    displayName: "Kalyan",
    title: "Mid Developer",
    level: 24,
    bio: "Building cool stuff",
    memberSince: "January 2025",
    email: "kalyan@example.com",
  })
  const [isEditing, setIsEditing] = useState(false)

  const activityDays = useMemo(() => generateYearActivity(), [])
  const activeDays = activityDays.filter((d) => d.xp > 0).length

  return (
    <div className="flex flex-col gap-5 pb-10 font-sans">
      <ProfileHeader
        profile={profile}
        isEditing={isEditing}
        onToggleEdit={() => setIsEditing((v) => !v)}
        onSave={(next) => {
          setProfile((prev) => ({ ...prev, ...next }))
          setIsEditing(false)
        }}
        onAvatarChange={(file) => {
          const objectUrl = URL.createObjectURL(file)
          setProfile((prev) => ({ ...prev, avatarUrl: objectUrl }))
        }}
      />

      <QuickStats stats={QUICK_STATS} />
      <SkillsSnapshot modules={SKILLS} />
      <BadgeGrid badges={PROFILE_BADGES} />

      <ActivityHeatmap
        days={activityDays}
        currentStreak={14}
        bestStreak={31}
        activeDays={activeDays}
      />

      <ActivityFeed items={RECENT_ACTIVITY} />

      <ProfileSettings
        name={profile.displayName}
        email={profile.email}
        avatarUrl={profile.avatarUrl}
        onNameChange={(value) => setProfile((prev) => ({ ...prev, displayName: value }))}
        onEmailChange={(value) => setProfile((prev) => ({ ...prev, email: value }))}
        onAvatarPreset={(avatarUrl) => setProfile((prev) => ({ ...prev, avatarUrl }))}
      />
    </div>
  )
}
