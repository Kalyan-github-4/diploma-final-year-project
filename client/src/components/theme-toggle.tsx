import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <button
          onClick={toggleTheme}
          className="relative p-2 rounded-md group"
          aria-label="Toggle theme"
        >
          <div className="relative w-5 h-5">
            <AnimatePresence mode="wait" initial={false}>
              {theme === "dark" ? (
                <motion.div
                  key="moon"
                  initial={{ rotate: -90, scale: 0, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: 90, scale: 0, opacity: 0 }}
                  transition={{ 
                    duration: 0.5,
                    ease: [0.68, -0.55, 0.265, 1.55] 
                  }}
                  className="absolute top-0 left-0"
                >
                  <Moon className="h-5 w-5 group-hover:text-blue-400 transition-colors" />
                </motion.div>
              ) : (
                <motion.div
                  key="sun"
                  initial={{ rotate: 90, scale: 0, opacity: 0 }}
                  animate={{ rotate: 0, scale: 1, opacity: 1 }}
                  exit={{ rotate: -90, scale: 0, opacity: 0 }}
                  transition={{ 
                    duration: 0.5,
                    ease: [0.68, -0.55, 0.265, 1.55] // Bounce effect
                  }}
                  className="absolute top-0 left-0"
                >
                  <Sun className="h-5 w-5 group-hover:text-yellow-500 transition-colors" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </button>
  );
}