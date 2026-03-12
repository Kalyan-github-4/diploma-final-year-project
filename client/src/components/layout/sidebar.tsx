import {
  LayoutDashboard,
  BookOpen,
  Terminal,
  Target,
  TrendingUp,
  Trophy,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";

const navigationItems = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { title: "Modules", icon: BookOpen, path: "/modules" },
  { title: "Playground", icon: Terminal, path: "/playground" },
  { title: "Missions", icon: Target, path: "/missions" },
  { title: "Progress", icon: TrendingUp, path: "/progress" },
  { title: "Leaderboard", icon: Trophy, path: "/leaderboard" },
];

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [logoHovered, setLogoHovered] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.div
      animate={{ width: collapsed ? "80px" : "239px" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="h-full flex flex-col bg-(--bg-surface) border-r border-(--border-subtle) overflow-hidden"
    >
      {/* Logo */}
      <div className="h-20 flex items-center px-4 gap-3 shrink-0">
        <div
          className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold text-sm shrink-0 cursor-ew-resize" onMouseEnter={() => collapsed && setLogoHovered(true)}
          onMouseLeave={() => setLogoHovered(false)}
          onClick={() => collapsed && setCollapsed(false)}>
          {collapsed && logoHovered
            ? <PanelLeftOpen className="w-4 h-4" />
            : <span>CK</span>
          }
        </div>

        {!collapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="font-semibold text-lg whitespace-nowrap flex-1 font-grotesk"
          >
            CodeKing
          </motion.span>
        )}

        {/* Collapse button — only visible when expanded */}
        {!collapsed && (
          <button
            onClick={() => setCollapsed(true)}
            className="p-1 rounded hover:bg-(--bg-elevated) text-(--text-secondary) shrink-0 ml-auto cursor-ew-resize"
          >
            <PanelLeftClose className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="px-3 flex flex-col gap-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link to={item.path} key={item.path} className="relative block">
              {active && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 bg-(--accent-active)/30 rounded-lg"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <motion.div
                className={`flex items-center gap-3 px-3 py-2 rounded-lg relative z-10
                  ${collapsed ? "justify-center" : "justify-start"}
                  ${active ? "text-(--text-primary)" : "text-(--text-secondary) hover:bg-(--bg-elevated)"}`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="whitespace-nowrap font-grotesk text-base"
                  >
                    {item.title}
                  </motion.span>
                )}
              </motion.div>
            </Link>
          );
        })}
      </div>

      {/* Profile */}
      <div className="mt-auto p-4 border-t border-(--border-subtle)">
        <motion.div
          className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer ${collapsed ? "justify-center" : ""}`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold text-sm shrink-0">
            K
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm"
            >
              <div className="font-medium">Kalyan</div>
              <div className="text-xs opacity-60">Student</div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Sidebar;