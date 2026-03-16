
import { useState } from "react"
import { GitBranch, Code2, Binary } from "lucide-react"
import GitSandbox from "./GitSandbox"
import "./PlaygroundPage.css"

type Env = "git" | "css" | "dsa"

const ENVS: { id: Env; label: string; icon: React.ElementType; available: boolean }[] = [
  { id: "git", label: "Git Sandbox", icon: GitBranch, available: true },
  { id: "css", label: "CSS Sandbox", icon: Code2, available: false },
  { id: "dsa", label: "DSA Sandbox", icon: Binary, available: false },
]

export default function PlaygroundPage() {
  const [activeEnv, setActiveEnv] = useState<Env>("git")

  return (
    <div className="playground">
      {/* Header */}
      <div className="playground__header">
        <h1 className="playground__title">Playground</h1>
        <p className="playground__tagline">"Experiment freely. Nothing breaks."</p>
      </div>

      {/* Environment selector */}
      <div className="playground__env-selector">
        <span className="playground__env-label">Select Environment:</span>
        <div className="playground__env-tabs">
          {ENVS.map(({ id, label, icon: Icon, available }) => (
            <button
              key={id}
              className={[
                "playground__env-tab",
                activeEnv === id ? "playground__env-tab--active" : "",
                !available ? "playground__env-tab--disabled" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => available && setActiveEnv(id)}
              disabled={!available}
            >
              <Icon size={15} />
              {label}
              {!available && <span className="playground__env-badge">Soon</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Arena */}
      <div className="playground__arena">
        {activeEnv === "git" && <GitSandbox />}
        {activeEnv === "css" && (
          <div className="playground__coming-soon">
            <Code2 size={32} className="playground__coming-soon-icon" />
            <p>CSS Sandbox — coming soon</p>
          </div>
        )}
        {activeEnv === "dsa" && (
          <div className="playground__coming-soon">
            <Binary size={32} className="playground__coming-soon-icon" />
            <p>DSA Sandbox — coming soon</p>
          </div>
        )}
      </div>
    </div>
  )
}