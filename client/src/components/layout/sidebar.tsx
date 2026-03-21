import {
  LayoutDashboard,
  BookOpen,
  Terminal,
  Target,
  TrendingUp,
  Trophy,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const navigationItems = [
  { title: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { title: "Modules", icon: BookOpen, path: "/modules" },
  { title: "Playground", icon: Terminal, path: "/playground" },
  { title: "Missions", icon: Target, path: "/missions" },
  { title: "Progress", icon: TrendingUp, path: "/progress" },
  { title: "Leaderboard", icon: Trophy, path: "/leaderboard" },
];

export default function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.aside
      animate={{ width: collapsed ? 78 : 248 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="relative h-screen bg-(--bg-surface) border-r border-border flex flex-col"
    >
      {/* LOGO */}
      {/* LOGO */}
      <div
        className={`h-24 shrink-0 ${collapsed
          ? "flex items-center justify-center"
          : "flex items-center gap-3 px-4"
          }`}
      >
        <div
          className="w-9 h-9 rounded-xl bg-linear-to-br from-indigo-500 to-violet-500 
          flex items-center justify-center text-white font-bold text-sm shadow-sm"
        >
          CK
        </div>

        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -6 }}
              transition={{ duration: 0.15 }}
              className="font-semibold text-[17px] tracking-tight"
            >
              CodeKing
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* NAV */}
      <nav className="px-3 flex flex-col gap-1.5">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link key={item.path} to={item.path} className="relative block">
              {active && (
                <motion.div
                  layoutId="activeRail"
                  className="absolute -left-3 top-1/2 h-10 w-0.75 -translate-y-1/2 rounded-r-full bg-(--accent)"
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                />
              )}
              <motion.div
                whileTap={{ scale: 0.985, opacity: 0.96 }}
                transition={{ duration: 0.14, ease: "easeOut" }}
                className={`
                  h-10 rounded-xl flex items-center
                  transition-all duration-200
                  ${collapsed ? "justify-center px-0" : "gap-3 px-3"}
                  ${active
                    ? "bg-(--bg-elevated) text-foreground shadow-sm"
                    : "text-(--text-secondary) hover:bg-(--bg-elevated) hover:text-foreground"
                  }
                `}
              >
                <div
                  className={`
                    w-8 h-8 shrink-0 rounded-lg flex items-center justify-center
                    ${active ? "text-(--accent)" : ""}
                  `}
                >
                  <Icon size={17} />
                </div>

                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className={`flex-1 text-[15px] leading-none ${active ? "font-semibold" : "font-medium"

                        } ${active ? "text-(--accent)" : ""}`}
                    >
                      {item.title}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          );
        })}
      </nav>





      <div className="mt-auto border-t border-border">

        {/* COLLAPSE BUTTON */}
        <div className="px-3 pt-2">
          <motion.button
            onClick={() => setCollapsed(!collapsed)}
            whileTap={{ scale: 0.985, opacity: 0.96 }}
            transition={{ duration: 0.14, ease: "easeOut" }}
            className={`
              w-full h-10 rounded-xl flex items-center
              text-(--text-secondary) hover:bg-(--bg-elevated) hover:text-foreground
              transition-colors duration-200
              ${collapsed ? "justify-center px-0" : "gap-3 px-3"}
            `}
          >
            <div className="w-8 h-8 shrink-0 rounded-lg flex items-center justify-center">
              {collapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
            </div>

            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="text-[15px] font-medium font-grotesk"
                >
                  Collapse
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* PROFILE */}
        <div className="p-3 flex">
          <Link to="/profile" className="w-full">
            <motion.div
              whileTap={{ scale: 0.985, opacity: 0.96 }}
              transition={{ duration: 0.14, ease: "easeOut" }}
              className={`w-full rounded-xl transition-colors duration-200
              ${isActive("/profile")
                  ? "bg-(--bg-elevated)"
                  : "cursor-pointer hover:bg-(--bg-elevated)"
                }
              ${collapsed ? "flex justify-center px-0 py-2" : "flex items-center gap-3 px-2 py-2"}`}
            >
              <div className="w-9 h-9 shrink-0 rounded-full overflow-hidden border border-border">
                <img src="https://api.dicebear.com/9.x/shapes/svg?seed=Kalyan" alt="avatar" className="h-full w-full"/>
              </div>

              <AnimatePresence>
                {!collapsed && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="leading-tight min-w-0"
                  >
                    <div className="text-sm font-medium text-foreground font-grotesk">Kalyan</div>
                    <div className="text-xs text-(--text-secondary)">Mid developer</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </Link>
        </div>
      </div>
    </motion.aside>
  );
}