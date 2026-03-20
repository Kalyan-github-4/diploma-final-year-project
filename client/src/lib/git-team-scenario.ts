export type TeamActor = "user" | "teammate" | "ci" | "system"

export interface TeamRepoSnapshot {
  localBranches: Record<string, string>
  remoteBranches: Record<string, string>
  headBranch: string
  aheadBy: number
  behindBy: number
}

export interface TeamScenarioEvent {
  id: string
  order: number
  actor: TeamActor
  type:
    | "teammate-commit"
    | "teammate-push"
    | "user-push-rejected"
    | "ci-check-pending"
    | "ci-check-failed"
    | "ci-check-passed"
    | "review-requested-changes"
    | "review-approved"
    | "merge-conflict-opened"
  message: string
  branch?: string
  fileHints?: string[]
}

export interface TeamScenarioDefinition {
  id: string
  topicId: string
  title: string
  seed: string
  snapshot: TeamRepoSnapshot
  events: TeamScenarioEvent[]
}

export interface TeamScenarioBuildInput {
  topicId: string
  title: string
  seed: string
}

export function buildDeterministicTeamScenario(input: TeamScenarioBuildInput): TeamScenarioDefinition {
  return {
    id: `scenario-${input.topicId}-${input.seed}`,
    topicId: input.topicId,
    title: input.title,
    seed: input.seed,
    snapshot: {
      localBranches: {
        main: "f3a1b2c",
        "feature/auth": "a1d4e6f",
      },
      remoteBranches: {
        "origin/main": "f3a1b2c",
        "origin/feature/auth": "a1d4e6f",
        "teammate/feature/login": "b3e4f7a",
      },
      headBranch: "feature/auth",
      aheadBy: 1,
      behindBy: 0,
    },
    events: [
      {
        id: "evt-1",
        order: 1,
        actor: "teammate",
        type: "teammate-push",
        branch: "origin/main",
        message: "Sarah pushed a hotfix to main.",
      },
      {
        id: "evt-2",
        order: 2,
        actor: "system",
        type: "user-push-rejected",
        branch: "origin/feature/auth",
        message: "Push rejected. Your branch is behind origin/main.",
      },
      {
        id: "evt-3",
        order: 3,
        actor: "ci",
        type: "ci-check-pending",
        message: "CI checks are running for your updated branch.",
      },
    ],
  }
}
