import SearchCommand from "../ui/SearchCommand";
import { Notification } from "./notification";
import AIAssistant from "./ai/ai-assistant";

const Topbar = () => {

  return (
    <div className="w-full bg-background h-16 flex items-center justify-between px-6 border-b border-border">

      {/* Left */}
      <div className="text-[18px] font-medium">
        Welcome back, Kalyan 👋
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">

        {/* Search Button (shadcn style) */}
        <SearchCommand />

        <AIAssistant />
        <div className="h-6 w-px bg-[#3D3D3D] opacity-60"></div>
        <Notification className="h-10 w-10 rounded-xl border border-border bg-(--bg-elevated)" />
      </div>
    </div>
  );
};

export default Topbar;