import { useParams } from "react-router-dom"
import GitLearningPage from "@/pages/modules/git/GitLearningPage"
import DSALearningPage from "@/pages/modules/dsa/DSALearningPage"
import BinarySearchLevel from "@/pages/modules/dsa/components/BinarySearchLevel"
import BubbleSortLevel from "@/pages/modules/dsa/components/BubbleSortLevel"
import BFSLevel from "@/pages/modules/dsa/components/BFSLevel"
import StackLevel from "@/pages/modules/dsa/components/StackLevel"
import QueueLevel from "@/pages/modules/dsa/components/QueueLevel"
import DijkstraLevel from "@/pages/modules/dsa/components/DijkstraLevel"
import CssLevelPage from "@/pages/modules/css-layout/CssLevelPage"

/**
 * Route entry point for /modules/:slug/level/:levelId
 * Dispatches to the correct learning experience based on module slug.
 */

const DSA_LEVEL_COMPONENTS: Record<string, React.ComponentType> = {
  "1": BinarySearchLevel,
  "2": BubbleSortLevel,
  "3": BFSLevel,
  "4": StackLevel,
  "5": QueueLevel,
  "6": DijkstraLevel,
}

export default function LevelPage() {
  const { slug, levelId } = useParams<{ slug: string; levelId: string }>()

  if (slug === "git-github") {
    return <GitLearningPage />
  }

  if (slug === "dsa") {
    const LevelComponent = DSA_LEVEL_COMPONENTS[levelId ?? ""]
    if (LevelComponent) return <LevelComponent />
    return <DSALearningPage />
  }

  if (slug === "css-layout") {
    return <CssLevelPage />
  }

  // Other modules are not yet available
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 text-center p-8">
      <span className="text-5xl">🚧</span>
      <h2 className="text-xl font-bold font-grotesk text-foreground">
        Coming Soon
      </h2>
      <p className="text-sm text-muted-foreground max-w-xs">
        This module's interactive levels are being built. Check back soon!
      </p>
    </div>
  )
}
