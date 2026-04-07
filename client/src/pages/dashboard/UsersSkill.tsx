import { Progress } from "@/components/ui/progress"



const UsersSkill = () => {
    return (
        <div className="space-y-6 bg-(--bg-elevated) p-6 rounded-2xl border border-border">

            <div className="space-y-2">
                <div className="flex justify-between">
                    <h5 className="text-sm text-foreground font-medium">Git & Github</h5>
                    <p className="text-xs text-[#F97316]">Elite</p>
                </div>
                <Progress value={80} className="w-full" indicatorColor="#F97316" />
            </div>

            <div className="space-y-2">
                <div className="flex justify-between">
                    <h5 className="text-sm text-foreground font-medium">Terminal Basics</h5>
                    <p className="text-xs text-[#8B5CF6]">Intermediate</p>
                </div>
                <Progress value={40} className="w-full" indicatorColor="#8B5CF6" />
            </div>

            <div className="space-y-2">
                <div className="flex justify-between">
                    <h5 className="text-sm text-foreground font-medium">Data Structure & Algo</h5>
                    <p className="text-xs text-[#3B82F6]">Learning</p>
                </div>
                <Progress value={60} className="w-full" indicatorColor="#3B82F6" />
            </div>
        </div>
    )
}

export default UsersSkill