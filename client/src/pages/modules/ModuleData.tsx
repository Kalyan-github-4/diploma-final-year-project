import {
  GitFork,
  Network,
  Terminal,
  Bug,
  LayoutGrid
} from "lucide-react"

// import { GitBranch } from "@phosphor-icons/react"
import type { ModuleCardProps } from "./ModuleCard"

export const modules: ModuleCardProps[] = [
  {
    title: "Git & GitHub",
    description:
      "Master version control, branching strategies, and collaboration.",
    progress: 60,
    topics: 12,
    xp: 3500,
    level: "INTERMEDIATE",
    status: "in-progress",
    icon: <GitFork size={22} />,
    color: "#F97316",
    link: "/modules/git"
  },
  {
    title: "CSS Layout",
    description:
      "Master Flexbox and Grid by visualizing real-time layout changes as you code. 12 interactive challenges.",
    progress: 0,
    topics: 12,
    xp: 1230,
    level: "INTERMEDIATE",
    status: "not-started",
    icon: <LayoutGrid size={22} />,
    color: "#06B6D4",
    link: "/modules/css-layout"
  },
  {
    title: "Data Structures & Algos",
    description:
      "In-depth study of algorithms, complexity, and optimized data structures.",
    progress: 15,
    topics: 24,
    xp: 1000,
    level: "ADVANCED",
    status: "in-progress",
    icon: <Network size={22} />,
    color: "#3B82F6"
  },

  {
    title: "Terminal Basics",
    description:
      "Learn to navigate and manipulate your system using CLI.",
    progress: 30,
    topics: 5,
    xp: 200,
    level: "BEGINNER",
    status: "not-started",
    icon: <Terminal size={22} />,
    color: "#8B5CF6"
  },
  {
    title: "JavaScript Debugging",
    description:
      "Advanced techniques for tracking bugs and memory leaks.",
    progress: 0,
    topics: 10,
    xp: 450,
    level: "ADVANCED",
    status: "locked",
    icon: <Bug size={22} />,
    color: "#64748B"
  }
]