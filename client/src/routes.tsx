import { createBrowserRouter } from "react-router-dom"

import PageLayout from "./components/layout/page-layout"

import Dashboard from "./pages/dashboard/dashboard"
import Modules from "./pages/modules/modules"
import Playground from "./pages/playground/playground"
import Progress from "./pages/progress/progress"
import Missions from "./pages/missions/missions"
import Leaderboard from "./pages/leaderboard/leaderboard"
import FlexmonArena from "./components/CSS Flexbox/FlexmonArena"
import GitLearningPage from "./pages/modules/git/GitLearningPage"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PageLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
        {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "modules",
        element: <Modules />,
      },
      {
        path: "playground",
        element: <Playground />,
      },
      {
        path: "progress",
        element: <Progress />,
      },
      {
        path: "missions",
        element: <Missions />,
      },
      {
        path: "leaderboard",
        element: <Leaderboard />,
      },
      {
        path: "modules/css-flexbox",
        element: <FlexmonArena />,
      },
      {
        path: "modules/git",
        element: <GitLearningPage />,
      },
    ],
  },
])