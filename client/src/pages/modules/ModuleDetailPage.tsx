import { useParams, useNavigate, Link } from "react-router-dom"
import { useEffect, useState } from "react"
import { ArrowLeft, Zap, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getIcon } from "@/lib/getIcon"
import type { ModuleDTO } from "@/types/module"
import { getModuleLevels, loadModuleProgress } from "./git/levels.data"
import type {  LevelDifficulty, ModuleProgress } from "./git/levels.data"
import { DifficultySection } from "./moduleDetails/DifficultySection"




/* ── Level Card ───────────────────────────────────────────── */

/* ── Difficulty Section ───────────────────────────────────── */

/* ── Main Page ────────────────────────────────────────────── */
const ModuleDetailPage = () => {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()

  const [module, setModule] = useState<ModuleDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [showNotFound, setShowNotFound] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState<ModuleProgress>({
    completedLevels: [],
    totalXpEarned: 0,
  })

  const levels = getModuleLevels(slug ?? "")
  const hasBuildableLevels = levels.length > 0

  useEffect(() => {
    if (!slug) return
    const ctrl = new AbortController()
    let resolved = false

    setLoading(true)
    setShowNotFound(false)
    setError(null)
    setModule(null)

    const timeoutId = setTimeout(() => {
      if (resolved) return
      setShowNotFound(true)
      setLoading(false)
      ctrl.abort()
    }, 10_000)

    const load = async () => {
      try {
        const res = await fetch(`/api/modules/${slug}`, { signal: ctrl.signal })
        if (!res.ok) {
          if (res.status !== 404) {
            resolved = true
            clearTimeout(timeoutId)
            setError("Failed to load module.")
            setLoading(false)
          }
          return
        }
        resolved = true
        clearTimeout(timeoutId)
        setModule(await res.json())
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== "AbortError") {
          resolved = true
          clearTimeout(timeoutId)
          setError("Failed to load module.")
          setLoading(false)
        }
      } finally {
        if (resolved) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      clearTimeout(timeoutId)
      ctrl.abort()
    }
  }, [slug])

  useEffect(() => {
    if (slug) setProgress(loadModuleProgress(slug))
  }, [slug])

  const handleAutoStart = () => {
    if (!slug || !hasBuildableLevels) return
    const nextLevelId = Math.min(progress.completedLevels.length + 1, levels.length)
    navigate(`/modules/${slug}/level/${nextLevelId}`)
  }

  const completedCount = progress.completedLevels.length
  const totalLevels = levels.length
  const progressPercent = totalLevels > 0 ? Math.round((completedCount / totalLevels) * 100) : 0
  const nextLevelId = completedCount + 1
  const allDone = completedCount >= totalLevels
  const difficulties: LevelDifficulty[] = ["beginner", "intermediate", "advanced"]

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="h-8 w-28 rounded-lg bg-(--bg-elevated)" />
        <div className="h-40 rounded-2xl bg-(--bg-elevated)" />
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-36 rounded-2xl bg-(--bg-elevated)" />
          ))}
        </div>
      </div>
    )
  }

  if (error || showNotFound || !module) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <span className="text-4xl">😕</span>
        <p className="text-muted-foreground">{error ?? "Module not found."}</p>
        <Button variant="outline" onClick={() => navigate("/modules")}>
          Back to Modules
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">

      {/* ── Back nav ── */}
      <Link
        to="/modules"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft size={14} />
        All Modules
      </Link>

      {/* ── Module Hero Card ── */}
      <div className="bg-(--bg-elevated) border border-border rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start gap-6">

          {/* Icon */}
          <div className="flex items-center justify-center h-14 w-14 rounded-2xl shrink-0"
          style={{
            backgroundColor: module.themeColor + "10",
            color: module.themeColor
          }}>
            {getIcon(module.icon)}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h1 className="text-2xl font-bold font-grotesk text-foreground">
                {module.title}
              </h1>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-(--bg-surface) text-muted-foreground uppercase tracking-wider border border-border">
                {module.difficulty}
              </span>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {module.description}
            </p>

            <div className="flex flex-wrap gap-5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Zap size={12} className="text-orange-400" />
                {module.totalXp} total XP
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen size={12} />
                {module.topicsCount} topics
              </span>
              {hasBuildableLevels && (
                <span>{completedCount}/{totalLevels} levels complete</span>
              )}
            </div>
          </div>

          {/* CTA */}
          {hasBuildableLevels && (
            <div className="shrink-0 self-start">
              <Button className="rounded-xl px-6 font-semibold" onClick={handleAutoStart}>
                {allDone ? "Practice Again" : completedCount === 0 ? "Start Learning" : "Continue"}
              </Button>
            </div>
          )}
        </div>

        {/* Progress bar */}
        {hasBuildableLevels && (
          <div className="mt-6 pt-5 border-t border-border">
            <div className="flex justify-between text-xs text-muted-foreground mb-2">
              <span>Overall Progress</span>
              <span>{completedCount} / {totalLevels} levels</span>
            </div>
            <div className="w-full h-1.5 bg-(--bg-surface) rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Level Map ── */}
      {hasBuildableLevels ? (
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-grotesk text-foreground">
              Learning Path
            </h2>
            {allDone ? (
              <Button
                variant="outline"
                size="sm"
                className="rounded-lg text-xs"
                onClick={() => navigate(`/modules/${slug}/complete`)}
              >
                View Summary 🏆
              </Button>
            ) : nextLevelId <= totalLevels ? (
              <span className="text-xs text-muted-foreground">
                Next: Level {nextLevelId}
              </span>
            ) : null}
          </div>

          {difficulties.map((diff) => {
            const group = levels.filter((l) => l.difficulty === diff)
            if (!group.length) return null
            return (
              <DifficultySection
                key={diff}
                difficulty={diff}
                levels={group}
                progress={progress}
                slug={slug ?? ""}
              />
            )
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 py-16 text-center border border-dashed border-border rounded-2xl">
          <span className="text-4xl">🚧</span>
          <p className="text-muted-foreground text-sm max-w-xs">
            Interactive levels for this module are coming soon!
          </p>
        </div>
      )}

    </div>
  )
}

export default ModuleDetailPage