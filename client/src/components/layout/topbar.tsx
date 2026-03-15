import SearchCommand from "../ui/SearchCommand";
import { ThemeToggle } from "../theme-toggle";
import { Notification } from "./notification";

const Topbar = () => {

  return (
    <div className="w-full bg-background h-16 flex items-center justify-between px-6 border-b border-border">

      {/* Left */}
      <div className="text-[18px] font-medium">
        Welcome back, Kalyan 👋
      </div>

      {/* Right */}
      <div className="flex items-center justify-around gap-4">

        {/* Search Button (shadcn style) */}
        <SearchCommand />

        {/* Notification */}
        <Notification />
        <div className="h-6 w-px bg-[#3D3D3D] opacity-60"></div>
        {/* Theme Toggle Placeholder */}
        <ThemeToggle />
      </div>
    </div>
  );
};

export default Topbar;