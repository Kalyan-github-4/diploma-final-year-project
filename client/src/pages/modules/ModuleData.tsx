import type { ModuleCardProps } from "./ModuleCard"

export const modules: ModuleCardProps[] = [
  {
    title: "Git & GitHub",
    description:
      "Master version control, branching strategies, and collaboration.",
    progress: 60,
    topics: 12,
    xp: 3500,
    status: "in-progress",
    image: "/vite.svg",
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
    status: "not-started",
    image: "/vite.svg",
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
    status: "in-progress",
    image: "/vite.svg",
    color: "#3B82F6"
  },

  {
    title: "Terminal Basics",
    description:
      "Learn to navigate and manipulate your system using CLI.",
    progress: 30,
    topics: 5,
    xp: 200,
    status: "not-started",
    image: "/vite.svg",
    color: "#8B5CF6"
  },
  {
    title: "JavaScript Debugging",
    description:
      "Advanced techniques for tracking bugs and memory leaks.",
    progress: 0,
    topics: 10,
    xp: 450,
    status: "locked",
    image: "/vite.svg",
    color: "#64748B"
  }
]