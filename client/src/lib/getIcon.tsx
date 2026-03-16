import { GitFork, Network, Terminal, Bug, LayoutGrid } from "lucide-react"

export function getIcon(name: string) {
  switch (name) {
    case "gitFork":
      return <GitFork size={22} />
    case "network":
      return <Network size={22} />
    case "terminal":
      return <Terminal size={22} />
    case "bug":
      return <Bug size={22} />
    case "layoutGrid":
      return <LayoutGrid size={22} />
    default:
      return <LayoutGrid size={22} />
  }
}