import type { LevelDifficulty } from "../git/levels.data";

/* ── Difficulty config ────────────────────────────────────── */
const difficultyConfig: Record<
  LevelDifficulty,
  { label: string; color: string; bg: string }
> = {
  beginner: {
    label: "Beginner",
    color: "var(--success)",
    bg: "rgba(34,197,94,0.08)",
  },
  intermediate: {
    label: "Intermediate",
    color: "var(--warning)",
    bg: "rgba(245,158,11,0.08)",
  },
  advanced: {
    label: "Advanced",
    color: "var(--danger)",
    bg: "rgba(239,68,68,0.08)",
  },
}

export default difficultyConfig