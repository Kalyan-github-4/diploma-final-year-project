import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import type { ModuleDTO } from "@/types/module"
import { ModuleGridSkeleton } from "../modules/ModuleGridSkeleton"
import { ArrowRight } from "lucide-react"

const MODULE_IMAGES: Record<string, string> = {
    "git-github": "/github.png",
    "dsa": "/dsa.png",
    "css-layout": "/css layout.png",
}

interface DashboardModule {
    title: string
    description: string
    progress: number
    topics: number
    xp: number
    image: string
    color: string
    slug: string
}

const DashboardModuleCard = () => {
    const [modules, setModules] = useState<DashboardModule[]>([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
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
                    image: MODULE_IMAGES[mod.slug] || `/modules/${mod.slug}.png`,
                    color: mod.themeColor,
                    slug: mod.slug,
                }))
                setModules(mappedModules)
            } catch (error) {
                console.error("Error fetching modules:", error)
            } finally {
                setLoading(false)
            }
        }
        loadModules()
    }, [])

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 xl:gap-6">
                {loading ? (
                    <ModuleGridSkeleton count={3} />
                ) : (
                    modules.slice(0, 3).map((module, index) => (
                        <div
                            key={index}
                            className="bg-(--bg-elevated) border border-border rounded-xl p-4 xl:p-5 flex flex-col justify-between gap-3 min-w-0 cursor-pointer transition-all duration-200 hover:border-(--border-hover) hover:shadow-[0_2px_12px_rgba(0,0,0,0.15)]"
                            onClick={() => navigate(`/modules/${module.slug}`)}
                        >
                        {/* Top row */}
                        <div className="flex justify-between items-start">
                            <img
                                src={module.image}
                                alt={module.title}
                                className="h-10 w-10 rounded-lg object-contain"
                            />
                            <span className="rounded-md bg-[#F59E0B]/12 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-[#F59E0B]">
                                +{module.xp} XP
                            </span>
                        </div>

                        {/* Title + description */}
                        <div className="min-w-0">
                            <h3 className="font-grotesk text-sm xl:text-[15px] font-semibold text-foreground truncate">
                                {module.title}
                            </h3>
                            <p className="text-xs text-(--text-secondary) font-sans line-clamp-2 mt-0.5 leading-relaxed">
                                {module.description}
                            </p>
                        </div>

                        {/* Progress + CTA */}
                        <div>
                            {module.progress > 0 && (
                                <>
                                    <div className="flex items-center justify-between text-xs font-sans text-(--text-secondary) mb-1.5">
                                        <span>Progress</span>
                                        <span className="font-medium text-foreground">{module.progress}%</span>
                                    </div>
                                    <Progress
                                        value={module.progress}
                                        className="h-1"
                                        indicatorColor={module.color}
                                    />
                                </>
                            )}
                            <div className={`flex items-center justify-between ${module.progress > 0 ? "mt-4" : ""}`}>
                                <p className="text-[11px] font-sans text-(--text-tertiary)">{module.topics} topics</p>
                                <Button
                                    size="xs"
                                    className="rounded-lg"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        navigate(`/modules/${module.slug}`)
                                    }}
                                >
                                    {module.progress > 0 ? "Continue" : "Start"} <ArrowRight className="transition-transform group-hover:translate-x-0.5"/>
                                </Button>
                            </div>
                        </div>
                    </div>
                )))}
            </div>
        </div>
    )
}

export default DashboardModuleCard