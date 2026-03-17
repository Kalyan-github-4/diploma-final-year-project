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
    <section className="profile-section">
      <div className="profile-section__header">
        <h2>Skills Snapshot</h2>
      </div>

      <div className="profile-skills-list">
        {modules.map((item) => (
          <article key={item.id} className="profile-skill-row">
            <div className="profile-skill-row__top">
              <h4>{item.moduleName}</h4>
              {item.comingSoon ? (
                <span className="profile-pill profile-pill--muted">Coming Soon</span>
              ) : (
                <span className="profile-pill">{getSkillLabel(item.progress)}</span>
              )}
            </div>
            <div className="profile-skill-row__progress-track" aria-hidden>
              <div
                className="profile-skill-row__progress-fill"
                style={{ width: `${item.progress}%` }}
              />
            </div>
            <p className="profile-skill-row__meta">
              {item.completedTopics} / {item.totalTopics} topics
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
