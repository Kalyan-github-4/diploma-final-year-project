import { Button } from "@/components/ui/button"
import { ModuleCard } from "./ModuleCard"
import type { ModuleCardProps } from "./ModuleCard"
import { ModuleGridSkeleton } from "./ModuleGridSkeleton"
import { useState, useEffect } from "react"
import type { ModuleDTO } from "@/types/module"
import { getIcon } from "@/lib/getIcon"

const Module = () => {
  const [modulesData, setModulesData] = useState<ModuleCardProps[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const loadModules = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/modules`)
        const data = await res.json()


        const mappedModules = data.map((mod: ModuleDTO) => ({
          title: mod.title,
          description: mod.description,
          progress: 0,
          topics: mod.topicsCount,
          xp: mod.totalXp,
          level: mod.difficulty.toUpperCase(),
          status: "not-started" as const,
          icon: getIcon(mod.icon),
          color: mod.themeColor,
          link: `/modules/${mod.slug}`
        }))
        setModulesData(mappedModules)
      } catch (error) {
        console.error("Error fetching modules:", error)
      } finally {
        setLoading(false)
      }
    }
    loadModules()
  }, [])
  return (
    <div>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">

        <div className="space-y-1">
          <h1 className="text-3xl font-bold font-grotesk text-foreground">
            Modules
          </h1>

          <p className="text-sm text-foreground font-sans">
            Explore the various modules available in CodeKing.
          </p>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <Button variant="outline" size="lg" className="rounded-2xl px-4 py-2 cursor-pointer">
            Filter
          </Button>

          <Button size="lg" className="rounded-2xl px-4 py-2 cursor-pointer font-medium">
            View Roadmap
          </Button>
        </div>

      </div>

      {/* Modules Grid */}
      {loading ? (
        <ModuleGridSkeleton count={6} />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modulesData.map((m, i) => (
            <ModuleCard key={i} {...m} />
          ))}
        </div>
      )}


    </div>
  )
}

export default Module