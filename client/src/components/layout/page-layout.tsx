import { Outlet } from "react-router-dom"
import Sidebar from "./sidebar"
import Topbar from "./topbar"

const PageLayout = () => {
  return (
    <div className="flex h-screen">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex flex-col flex-1">

        <Topbar />

        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>

      </div>
    </div>
  )
}

export default PageLayout