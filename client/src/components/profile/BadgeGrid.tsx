import BadgeCard, { type Badge } from "./BadgeCard"

interface BadgeGridProps {
  badges: Badge[]
}

export default function BadgeGrid({ badges }: BadgeGridProps) {
  return (
    <section className="profile-section">
      <div className="profile-section__header">
        <h2>Badges</h2>
      </div>

      <div className="profile-badge-grid">
        {badges.map((badge) => (
          <BadgeCard key={badge.id} badge={badge} />
        ))}
      </div>
    </section>
  )
}
