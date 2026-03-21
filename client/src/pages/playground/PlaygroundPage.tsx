
import { useState } from "react"
import { GitBranch, Code2, Binary } from "lucide-react"
import GitSandbox from "./GitSandbox"

type Env = "git" | "css" | "dsa"

const ENVS: { id: Env; label: string; icon: React.ElementType; available: boolean }[] = [
  { id: "git", label: "Git Sandbox", icon: GitBranch, available: true },
  { id: "css", label: "CSS Sandbox", icon: Code2, available: false },
  { id: "dsa", label: "DSA Sandbox", icon: Binary, available: false },
]

export default function PlaygroundPage() {
  const [activeEnv, setActiveEnv] = useState<Env>("git")

  return (
    <div className="flex flex-col gap-0">
      {/* Header */}
      <div className="pb-5">
        <h1 className="text-[26px] font-bold tracking-[-0.02em] text-[var(--text-primary)]">Playground</h1>
        <p className="mt-1 text-[13px] italic text-[var(--text-secondary)]">"Experiment freely. Nothing breaks."</p>
      </div>

      {/* Environment selector */}
      <div className="flex flex-wrap items-center gap-4 pb-5">
        <span className="whitespace-nowrap text-[13px] font-medium text-[var(--text-secondary)]">Select Environment:</span>
        <div className="flex flex-wrap gap-2">
          {ENVS.map(({ id, label, icon: Icon, available }) => (
            <button
              key={id}
              className={[
                "inline-flex items-center gap-[7px] rounded-lg border border-[var(--border-subtle)] bg-([var(--bg-elevated,#141414)]) px-4 py-2 text-[13px] font-medium transition-colors",
                activeEnv === id
                  ? "border-(--accent,#6366F1) bg-(--accent,#6366F1) text-white"
                  : "text-(--text-secondary) hover:border-(--accent,#6366F1) hover:text-(--text-primary)",
                !available ? "cursor-not-allowed opacity-45" : "cursor-pointer",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => available && setActiveEnv(id)}
              disabled={!available}
            >
              <Icon size={15} />
              {label}
              {!available && <span className="rounded-full bg-white/10 px-1.5 py-px text-[10px] font-bold uppercase tracking-[0.06em] text-(--text-tertiary)">Soon</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Arena */}
      <div className="flex h-[calc(100vh-280px)] min-h-[520px] flex-col overflow-hidden rounded-[10px] border border-[var(--border-subtle)]">
        {activeEnv === "git" && <GitSandbox />}
        {activeEnv === "css" && (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-(--bg-elevated,#141414) text-sm text-[var(--text-tertiary)]">
            <Code2 size={32} className="opacity-30" />
            <p>CSS Sandbox — coming soon</p>
          </div>
        )}
        {activeEnv === "dsa" && (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 bg-[var(--bg-elevated,#141414)] text-sm text-[var(--text-tertiary)]">
            <Binary size={32} className="opacity-30" />
            <p>DSA Sandbox — coming soon</p>
          </div>
        )}
      </div>
    </div>
  )
}