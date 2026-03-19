import { Progress } from "@/components/ui/progress"

interface ModuleSkill {
  id: string
  moduleName: string
  progress: number
  completedTopics: number
  totalTopics: number
  comingSoon?: boolean
}

interface SkillsSnapshotProps {
  modules: ModuleSkill[]
}

function getSkillLabel(progress: number) {
  if (progress >= 95) return "Elite"
  if (progress >= 75) return "Advanced"
  if (progress >= 50) return "Intermediate"
  if (progress >= 25) return "Beginner"
  return "Learning"
}

export default function SkillsSnapshot({ modules }: SkillsSnapshotProps) {
  return (
    <section className="rounded-xl border border-border p-4.5 [background:var(--bg-elevated,#141414)]">
      <div className="mb-3.5 flex items-center justify-between">
        <h2 className="font-grotesk text-[18px] font-bold text-foreground">
          Skills Snapshot
        </h2>
      </div>

      <div className="flex flex-col gap-2.5">
        {modules.map((item) => (
          <article key={item.id} className="flex flex-col gap-2 rounded-[10px] border border-border p-3">
            <div className="flex items-center justify-between">
              <h4>{item.moduleName}</h4>
              {item.comingSoon ? (
                <span className="inline-flex items-center rounded-[9999px] border border-border px-2.5 py-1 text-[12px] font-semibold text-(--text-tertiary)">
                  Coming Soon
                </span>
              ) : (
                <span className="inline-flex items-center rounded-[9999px] border border-[rgba(99,102,241,0.45)] px-2.5 py-1 text-[12px] font-semibold text-(--accent,#6366f1)">
                  {getSkillLabel(item.progress)}
                </span>
              )}
            </div>
            <Progress
              value={item.progress}
              className="h-2 rounded-[999px] bg-[rgba(255,255,255,0.08)]"
              indicatorColor="var(--accent, #6366f1)"
              aria-hidden
            />
            <p className="text-[12px] text-(--text-tertiary)">
              {item.completedTopics} / {item.totalTopics} topics
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
