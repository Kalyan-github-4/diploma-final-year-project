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
    <article
      className="flex flex-col items-center gap-3 rounded-2xl border border-border bg-[rgba(255,255,255,0.02)] px-3 pb-3 pt-4"
      title={badge.name}
    >
      <img src={badge.image} alt={badge.name} className="h-auto w-full max-w-33 object-contain" />
      <h4 className="font-grotesk text-center text-[14px] font-bold">{badge.name}</h4>
    </article>
  )
}
