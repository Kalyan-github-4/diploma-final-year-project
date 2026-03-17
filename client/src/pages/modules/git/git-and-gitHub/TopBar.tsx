import "./TopBar.css"
import AIAssistant from "@/components/layout/ai/ai-assistant"

interface TopBarProps {
  missionTitle: string
  timer: number
  onRunTest: () => void
  module?: string
  topic?: string
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0")
  const s = (seconds % 60).toString().padStart(2, "0")
  return `${m}:${s}`
}

export default function TopBar({ missionTitle, timer, onRunTest, module, topic }: TopBarProps) {
  return (
    <div className="git-topbar">
      {/* Left */}
      <div className="git-topbar__left">
        <span className="git-topbar__mission-label">Mission:</span>
        <span className="git-topbar__mission-title">{missionTitle}</span>
        <span className="git-topbar__live-badge">
          <span className="git-topbar__pulse" />
          Live Session
        </span>
      </div>

      {/* Center */}
      <div className="git-topbar__center">
        <span className="git-topbar__timer-label">Time:</span>
        {formatTime(timer)}
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <AIAssistant module={module} topic={topic} />
        <button className="git-topbar__run-btn" onClick={onRunTest}>
          Run Test
        </button>
      </div>
    </div>
  )
}
