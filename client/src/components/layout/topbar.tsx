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
        <Notification className="h-8 w-8 rounded-lg border border-[#2E2E3A] bg-linear-to-b from-[#1F1F28] to-[#16161D] shadow-[0_1px_2px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)] hover:from-[#27272F] hover:to-[#1C1C24] hover:text-white" />
      </div>
    </div>
  );
};

export default Topbar;