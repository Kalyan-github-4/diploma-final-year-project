import {
  GitFork,
  Boxes,
  Network,
  Terminal,
  Bug
} from "lucide-react"
import type { ModuleCardProps } from "./ModuleCard"

export const modules: ModuleCardProps[] = [
  {
    title: "Git & GitHub",
    description:
      "Master version control, branching strategies, and collaboration.",
    progress: 60,
    topics: 12,
    xp: 500,
    level: "INTERMEDIATE",
    status: "in-progress",
    icon: <GitFork size={22} />,
    color: "#F97316"
  },
  {
    title: "CSS Flexbox",
    description:
      "Learn modern layout techniques and responsive design.",
    progress: 100,
    topics: 8,
    xp: 300,
    level: "BEGINNER",
    status: "completed",
    icon: <Boxes size={22} />,
    color: "#22C55E"
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
    progress: 0,
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