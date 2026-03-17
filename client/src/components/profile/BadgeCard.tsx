export interface Badge {
  id: string
  name: string
  image: string
}

interface BadgeCardProps {
  badge: Badge
}

export default function BadgeCard({ badge }: BadgeCardProps) {
  return (
    <article className="profile-badge-card" title={badge.name}>
      <img src={badge.image} alt={badge.name} className="profile-badge-card__image" />
      <h4 className="profile-badge-card__name">{badge.name}</h4>
    </article>
  )
}
