import { createBrowserRouter } from "react-router-dom"

import PageLayout from "./components/layout/page-layout"
import Dashboard from "./pages/dashboard/DashboardPage"
import ModulesPage from "./pages/modules/ModulesPage"
import ModuleDetailPage from "./pages/modules/ModuleDetailPage"
import LevelPage from "./pages/modules/LevelPage"
import ModuleCompletionPage from "./pages/modules/git/ModuleCompletionPage"
import LayoutEngineeringPage from "./pages/modules/layout-engineering/LayoutEngineeringPage"
import Playground from "./pages/playground/PlaygroundPage"
import ProfilePage from "./pages/profile/ProfilePage"
import Progress from "./pages/progress/ProgressPage"
import Missions from "./pages/missions/MissionsPage"
import Leaderboard from "./pages/leaderboard/LeaderboardPage"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PageLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "dashboard", element: <Dashboard /> },

      // ⭐ modules catalog
      { path: "modules", element: <ModulesPage /> },

      // ⭐ dedicated full-screen module experiences
      { path: "modules/layout-engineering", element: <LayoutEngineeringPage /> },

      // ⭐ module level map
      { path: "modules/:slug", element: <ModuleDetailPage /> },

      // ⭐ individual level (question set)
      { path: "modules/:slug/level/:levelId", element: <LevelPage /> },

      // ⭐ module completion summary
      { path: "modules/:slug/complete", element: <ModuleCompletionPage /> },

      { path: "playground", element: <Playground /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "progress", element: <Progress /> },
      { path: "missions", element: <Missions /> },
      { path: "leaderboard", element: <Leaderboard /> },
    ],
  },
])