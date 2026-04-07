import { useNavigate } from "react-router-dom"
import { GitBranch, Binary, Code2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const SANDBOXES = [
  {
    id: "git",
    title: "Git & GitHub",
    subtitle: "Interactive command sandbox",
    description: "Run git commands, visualize branches, commits, and merges in real time.",
    icon: GitBranch,
    color: "#F97316",
    link: "/playground/git",
    available: true,
  },
  {
    id: "dsa",
    title: "DSA Sandbox",
    subtitle: "6 algorithm topics",
    description: "Visualize Binary Search, Bubble Sort, BFS, Stack, Queue, and Dijkstra with your own inputs.",
    icon: Binary,
    color: "#8B5CF6",
    link: "/playground/dsa",
    available: true,
  },
  {
    id: "css",
    title: "CSS Layout",
    subtitle: "Flexbox & Grid sandbox",
    description: "Experiment with CSS layouts, test properties, and see results live.",
    icon: Code2,
    color: "#06B6D4",
    link: "/playground/css",
    available: true,
  },
] as const

export default function PlaygroundPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-0">
      <div className="pb-6">
        <h1 className="text-[26px] font-bold tracking-[-0.02em] text-foreground font-grotesk">Playground</h1>
        <p className="mt-1 text-[13px] italic text-(--text-secondary)">
          "Experiment freely. Nothing breaks."
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SANDBOXES.map(({ id, title, subtitle, description, icon: Icon, color, link, available }) => (
          <div
            key={id}
            className={[
              "flex flex-col justify-between rounded-2xl border border-border bg-(--bg-elevated) p-6 transition",
              available ? "hover:shadow-md" : "opacity-55",
            ].join(" ")}
          >
            <div>
              <div className="flex items-start justify-between">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: `${color}1A`, color }}
                >
                  <Icon size={24} />
                </div>

                {!available && (
                  <span
                    className="rounded-sm px-2 py-1 text-[10px] font-medium"
                    style={{ backgroundColor: `${color}1A`, color }}
                  >
                    Coming Soon
                  </span>
                )}
              </div>

              <div className="mt-4 space-y-1">
                <h3 className="text-lg font-bold text-foreground font-grotesk">{title}</h3>
                <p className="text-[12px] font-medium text-(--text-tertiary)">{subtitle}</p>
                <p className="text-sm text-(--text-secondary)">{description}</p>
              </div>
            </div>

            <div className="mt-5">
              <Button
                className="w-full rounded-lg"
                disabled={!available}
                onClick={() => navigate(link)}
              >
                {available ? "Enter Sandbox" : "Locked"}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
