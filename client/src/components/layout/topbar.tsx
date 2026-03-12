import { Bell } from "lucide-react";
import SearchCommand from "../ui/SearchCommand";
import { ThemeToggle } from "../theme-toggle";

const Topbar = () => {

  return (
    <div className="w-full bg-(--bg-primary) h-16 flex items-center justify-between px-6 border-b border-(--border-subtle)">

      {/* Left */}
      <div className="text-[18px] font-medium">
        Welcome back, Kalyan 👋
      </div>

      {/* Right */}
      <div className="flex items-center justify-around gap-4">

        {/* Search Button (shadcn style) */}
        <div>
          <SearchCommand/>
        </div>

        {/* Notification */}
        <div className="relative p-2 rounded-md hover:bg-(--bg-elevated) cursor-pointer">
          <Bell className="w-5 h-5" />

          {/* Notification Dot */}
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </div>

        {/* Avatar */}
        {/* <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gray-400"></div>
        </div> */}

        {/* Theme Toggle Placeholder */}
        <ThemeToggle/>
      </div>
    </div>
  );
};

export default Topbar;