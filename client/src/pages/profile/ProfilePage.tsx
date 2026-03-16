import { useMemo, useState } from "react"
import ProfileHeader from "@/components/profile/ProfileHeader"
import QuickStats, { type QuickStat } from "@/components/profile/QuickStats"
import SkillsSnapshot from "@/components/profile/SkillsSnapshot"
import BadgeGrid from "@/components/profile/BadgeGrid"
import type { Badge } from "@/components/profile/BadgeCard"
import ActivityHeatmap from "@/components/profile/ActivityHeatmap"
import ActivityFeed, { type ActivityItem } from "@/components/profile/ActivityFeed"
import ProfileSettings from "@/components/profile/ProfileSettings"
import "./Profile.css"

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

const ALL_BADGES: Badge[] = [
  {
    id: "branch-master",
    icon: "🌿",
    name: "Branch Master",
    description: "Complete all branching topics",
    earnedAt: "Feb 18, 2026",
  },
  {
    id: "merge-hero",
    icon: "⚔️",
    name: "Merge Hero",
    description: "Complete all merging topics",
    earnedAt: "Mar 03, 2026",
  },
  {
    id: "conflict-resolver",
    icon: "🧩",
    name: "Conflict Resolver",
    description: "Solve 5 merge conflicts",
    earnedAt: "Mar 08, 2026",
  },
  {
    id: "rebase-ninja",
    icon: "🥷",
    name: "Rebase Ninja",
    description: "Complete rebase topic",
    earnedAt: "Mar 10, 2026",
  },
  { id: "code-king", icon: "👑", name: "Code King 👑", description: "Reach LVL 40", unlockCondition: "Reach LVL 40" },
  {
    id: "streak-7",
    icon: "🔥",
    name: "7 Day Streak",
    description: "Maintain 7 day streak",
    earnedAt: "Jan 29, 2026",
  },
  { id: "streak-21", icon: "🔥", name: "21 Day Streak", description: "Maintain 21 day streak", unlockCondition: "Maintain 21 day streak" },
  {
    id: "perfect-score",
    icon: "💯",
    name: "Perfect Score",
    description: "Get 100% on any challenge",
    earnedAt: "Feb 11, 2026",
  },
  { id: "speed-runner", icon: "⏱️", name: "Speed Runner", description: "Complete challenge under 3 min", unlockCondition: "Complete challenge under 3 min" },
  {
    id: "css-wizard",
    icon: "🪄",
    name: "CSS Wizard",
    description: "Complete all CSS topics",
    unlockCondition: "Complete all CSS topics",
  },
  { id: "dsa-master", icon: "🧠", name: "DSA Master", description: "Complete all DSA topics", unlockCondition: "Complete all DSA topics" },
  { id: "streak-100", icon: "🔥", name: "100 Day Streak", description: "Maintain 100 day streak", unlockCondition: "Maintain 100 day streak" },
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

  const earnedBadges = ALL_BADGES.filter((badge) => Boolean(badge.earnedAt))
  const lockedBadges = ALL_BADGES.filter((badge) => !badge.earnedAt)

  return (
    <div className="profile-page font-sans">
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
      <BadgeGrid earned={earnedBadges} locked={lockedBadges} />

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
