import { Outlet, useLocation } from "react-router-dom"
import Sidebar from "./sidebar"
import Topbar from "./topbar"
import AIAssistant from "./ai/ai-assistant.tsx"

const hideTopbarRoutes = ["/modules/css-flexbox", "/modules/git", "/modules/layout-engineering"]

const PageLayout = () => {
  const { pathname } = useLocation()
  const showTopbar = !hideTopbarRoutes.includes(pathname)

  return (
    <div className="flex h-screen">

      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex flex-col flex-1">

        {showTopbar && <Topbar />}

        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
        <AIAssistant />
      </div>
    </div>
  )
}

export default PageLayout