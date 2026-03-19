import { Flame, Target, Trophy, Sparkles } from "lucide-react"

export interface QuickStat {
  id: string
  value: string
  label: string
  icon?: "flame" | "target" | "trophy" | "sparkles"
}

const ICON_MAP = {
  flame: Flame,
  target: Target,
  trophy: Trophy,
  sparkles: Sparkles,
}

interface QuickStatsProps {
  stats: QuickStat[]
}

export default function QuickStats({ stats }: QuickStatsProps) {
  return (
    <section className="rounded-xl border border-border p-4.5 [background:var(--bg-elevated,#141414)]">
      <div className="mb-3.5 flex items-center justify-between">
        <h2 className="font-grotesk text-[18px] font-bold text-foreground">
          Quick Stats
        </h2>
      </div>

      <div className="grid grid-cols-4 gap-2.5 max-[1100px]:grid-cols-2 max-[720px]:grid-cols-1">
        {stats.map((stat) => {
          const Icon = stat.icon ? ICON_MAP[stat.icon] : null
          return (
            <article
              key={stat.id}
              className="rounded-[10px] border border-border bg-[rgba(255,255,255,0.02)] p-3.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-grotesk text-[24px] font-extrabold leading-none">
                  {stat.value}
                </span>
                {Icon && <Icon size={16} className="text-(--accent,#6366f1)" />}
              </div>
              <p className="mt-1.5 text-[12px] text-(--text-tertiary)">{stat.label}</p>
            </article>
          )
        })}
      </div>
    </section>
  )
}
