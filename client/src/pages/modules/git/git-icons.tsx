import {
  BookOpen,
  Bug,
  Compass,
  Crown,
  GitBranch,
  GitCommitHorizontal,
  GitMerge,
  GitPullRequest,
  LayoutGrid,
  Network,
  RefreshCcw,
  Search,
  Settings,
  ShieldCheck,
  Undo2,
  Wrench,
  type LucideIcon,
} from "lucide-react"

const iconMap: Record<string, LucideIcon> = {
  "repo-kickoff": BookOpen,
  "commit-hygiene": GitCommitHorizontal,
  "staging-mastery": LayoutGrid,
  "debug-log": Search,
  "safe-undo": Undo2,
  "team-ready": Wrench,
  "feature-branch": GitBranch,
  "parallel-workstreams": Compass,
  "fast-forward-merge": GitMerge,
  "release-drill": Network,
  "branch-policy": Settings,
  "integration-readiness": RefreshCcw,
  "rebase-control": RefreshCcw,
  "conflict-surgery": Bug,
  "recovery-toolkit": ShieldCheck,
  "remote-sync": Network,
  "pr-command-center": GitPullRequest,
  king: Crown,

  "badge-foundation": BookOpen,
  "badge-branching": GitBranch,
  "badge-history": RefreshCcw,
  "badge-king": Crown,
}

export function renderGitIcon(iconName: string, size = 20, className?: string) {
  const Icon = iconMap[iconName]

  if (!Icon) {
    if (iconName.length <= 2) {
      return <span className={className}>{iconName}</span>
    }
    return <LayoutGrid size={size} className={className ?? "text-(--accent)"} />
  }

  return <Icon size={size} strokeWidth={2.1} className={className ?? "text-(--accent)"} />
}
