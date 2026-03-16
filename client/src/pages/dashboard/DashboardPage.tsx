import { Button } from "@/components/ui/button"
import DashboardModuleCard from "./DashboardModuleCard"
import { useNavigate } from "react-router-dom"
import UsersSkill from "./UsersSkill"
import DailyMission from "./DailyMission"
import Achivement from "./Achievement"
import LeaderboardCard from "./LeaderboardCard"
const Dashboard = () => {

  const navigate = useNavigate()
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between mb-2">
        <div className="text-xl font-bold font-grotesk text-foreground">Continue Learning</div>
        <Button variant="link" onClick={() => navigate("/modules")} className="font-medium">View Roadmap</Button>
      </div>

      {/* Placeholder for ongoing modules or courses */}
      <DashboardModuleCard />
      <div className="grid grid-cols-3 gap-6">

        <div className="col-span-2 space-y-5">
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-grotesk text-foreground">Your Skills</h3>
            <div><UsersSkill /></div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold font-grotesk text-foreground">Daily Mission</h3>
            <div><DailyMission /></div>
          </div>
        </div>

        <div className="col-span-1">
          <div className="col-span-2 space-y-5">
          <div className="space-y-4">
            <h3 className="text-xl font-bold font-grotesk text-foreground">Achivements</h3>
            <div><Achivement /></div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold font-grotesk text-foreground">Weekly Leaderboard</h3>
            <div><LeaderboardCard /></div>
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard