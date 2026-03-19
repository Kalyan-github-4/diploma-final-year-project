import BadgeCard, { type Badge } from "./BadgeCard"

interface BadgeGridProps {
  badges: Badge[]
}

export default function BadgeGrid({ badges }: BadgeGridProps) {
  return (
    <section className="rounded-xl border border-border p-4.5 [background:var(--bg-elevated,#141414)]">
      <div className="mb-3.5 flex items-center justify-between">
        <h2 className="font-grotesk text-[18px] font-bold text-foreground">
          Badges
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-3.5 max-[1100px]:grid-cols-2 max-[720px]:grid-cols-1">
        {badges.map((badge) => (
          <BadgeCard key={badge.id} badge={badge} />
        ))}
      </div>
    </section>
  )
}
