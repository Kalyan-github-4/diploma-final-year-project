const { getDb } = require("./client")
const { modulesTable } = require("./schema")
const { db } = getDb()

async function seedModules() {
  try {
    console.log("🌱 Seeding modules...")

    await db.insert(modulesTable).values([
      {
        slug: "git-github",
        title: "Git & GitHub",
        description:
          "Master version control, branching strategies, and collaboration.",
        category: "tools",
        difficulty: "intermediate",
        topicsCount: 12,
        totalXp: 3500,
        icon: "gitFork",
        themeColor: "#F97316",
        orderIndex: 1,
      },
      {
        slug: "layout-engineering",
        title: "Layout Engineering",
        description:
          "Master Flexbox, Grid and modern responsive UI architecture.",
        category: "frontend",
        difficulty: "intermediate",
        topicsCount: 18,
        totalXp: 2700,
        icon: "layoutGrid",
        themeColor: "#06B6D4",
        orderIndex: 2,
      },
      {
        slug: "dsa",
        title: "Data Structures & Algorithms",
        description:
          "Deep dive into problem solving, complexity and optimisation.",
        category: "cs-fundamentals",
        difficulty: "advanced",
        topicsCount: 24,
        totalXp: 8000,
        icon: "network",
        themeColor: "#3B82F6",
        orderIndex: 3,
      },
      {
        slug: "terminal-basics",
        title: "Terminal Basics",
        description:
          "Navigate and control your system using powerful CLI tools.",
        category: "tools",
        difficulty: "beginner",
        topicsCount: 5,
        totalXp: 500,
        icon: "terminal",
        themeColor: "#8B5CF6",
        orderIndex: 4,
      },
      {
        slug: "js-debugging",
        title: "JavaScript Debugging",
        description:
          "Learn advanced debugging strategies and memory issue tracking.",
        category: "programming",
        difficulty: "advanced",
        topicsCount: 10,
        totalXp: 1500,
        icon: "bug",
        themeColor: "#64748B",
        orderIndex: 5,
      },
    ])

    console.log("✅ Modules seeded successfully")
    process.exit()
  } catch (err) {
    console.error("❌ Seed failed:", err)
    process.exit(1)
  }
}

seedModules()