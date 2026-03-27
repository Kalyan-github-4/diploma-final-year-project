export type CssTopic = "flexbox" | "grid"
export type ChallengeDifficulty = "beginner" | "intermediate" | "advanced"

export interface RequiredProperty {
  selector: string
  property: string
  /** Single value or array of accepted alternatives */
  value: string | string[]
}

export interface CssChallenge {
  id: string
  title: string
  topic: CssTopic
  difficulty: ChallengeDifficulty
  xp: number
  description: string
  hint: string
  /** HTML rendered in both previews */
  htmlTemplate: string
  /** Skeleton CSS loaded into the editor at start */
  startingCss: string
  /** Solution CSS applied to the goal preview on the right */
  goalCss: string
  /** Which properties must match for the challenge to be complete */
  requiredProperties: RequiredProperty[]
}

export interface ChallengeProgress {
  challengeId: string
  completed: boolean
  xpEarned: number
}
