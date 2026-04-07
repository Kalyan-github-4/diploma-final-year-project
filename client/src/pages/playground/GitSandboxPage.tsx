import { useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import GitSandbox from "./GitSandbox"

export default function GitSandboxPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col gap-3" style={{ height: "calc(100vh - 7rem)" }}>
      <button
        onClick={() => navigate("/playground")}
        className="inline-flex w-max items-center gap-1.5 rounded-lg px-2 py-1 text-[13px] text-(--text-secondary) transition hover:text-foreground"
      >
        <ArrowLeft size={14} />
        Back to Playground
      </button>

      <div className="flex min-h-0 flex-1 overflow-hidden rounded-[10px] border border-(--border-subtle)">
        <GitSandbox />
      </div>
    </div>
  )
}
