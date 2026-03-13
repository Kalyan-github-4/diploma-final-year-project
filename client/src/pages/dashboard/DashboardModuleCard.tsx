import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { modules } from "../modules/ModuleData"

const DashboardModuleCard = () => {
    return (
        <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 xl:gap-6">
                {modules.slice(0, 3).map((module, index) => (
                    <div
                        key={index}
                        className="bg-(--bg-elevated) border border-border 
                        rounded-2xl p-4 xl:p-5 flex flex-col justify-between gap-3 min-w-0"
                    >
                        {/* Top row */}
                        <div className="flex justify-between items-start">
                            <div
                                className="p-2 rounded-lg"
                                style={{
                                    backgroundColor: module.color + "15",
                                    color: module.color
                                }}
                            >
                                {module.icon}
                            </div>
                            <div className="text-xs font-medium rounded-xs px-2.5 py-0.5"
                                style={{
                                    backgroundColor: module.color + "15",
                                    color: module.color
                                }}>
                                {module.level}
                            </div>
                        </div>

                        {/* Title + description */}
                        <div className="min-w-0">
                            <h3 className="font-grotesk text-sm xl:text-base font-bold text-foreground truncate">
                                {module.title}
                            </h3>
                            <p className="text-xs text-(--text-secondary) font-sans line-clamp-2 mt-0.5 leading-relaxed">
                                {module.description}
                            </p>
                        </div>

                        {/* Progress + CTA */}
                        <div>
                            <div className="flex items-center justify-between text-xs font-sans text-(--text-secondary) mb-1.5">
                                <span>Progress</span>
                                <span className="font-medium text-foreground">{module.progress}%</span>
                            </div>
                            <Progress
                                value={module.progress}
                                className="h-1"
                                indicatorColor={module.color}
                            />
                            <div className="mt-4 flex items-center justify-between">
                                <p className="text-xs font-sans text-(--text-secondary)">+{module.xp}xp</p>
                                <Button size="sm" className="rounded-lg ">
                                    Continue
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default DashboardModuleCard