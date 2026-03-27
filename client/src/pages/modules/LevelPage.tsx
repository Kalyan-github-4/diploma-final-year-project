import { useParams } from "react-router-dom"
import GitLearningPage from "@/pages/modules/git/GitLearningPage"
import DSALearningPage from "@/pages/modules/dsa/DSALearningPage"
import CssLevelPage from "@/pages/modules/css-layout/CssLevelPage"

/**
 * Route entry point for /modules/:slug/level/:levelId
 * Dispatches to the correct learning experience based on module slug.
 */
export default function LevelPage() {
  const { slug } = useParams<{ slug: string }>()

  if (slug === "git-github") {
    return <GitLearningPage />
  }

  if (slug === "dsa") {
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
