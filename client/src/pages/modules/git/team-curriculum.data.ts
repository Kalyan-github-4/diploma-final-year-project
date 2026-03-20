export type TeamMissionMode = "scenario" | "pr-simulator" | "review" | "conflict-lab"

export interface TeamLearningObjective {
  id: string
  title: string
  measurableOutcome: string
}

export interface TeamTopic {
  id: string
  title: string
  summary: string
  mode: TeamMissionMode
  difficulty: "beginner" | "intermediate" | "advanced"
  estimatedMinutes: number
  objectives: TeamLearningObjective[]
}

export interface TeamCurriculumPhase {
  id: string
  title: string
  releaseOrder: number
  mvp: boolean
  topics: TeamTopic[]
}

export const gitTeamCurriculum: TeamCurriculumPhase[] = [
  {
    id: "phase-1-remote-basics",
    title: "Remote Team Basics",
    releaseOrder: 1,
    mvp: true,
    topics: [
      {
        id: "remote-repositories",
        title: "Remote Repositories",
        summary: "Understand local vs origin and track divergence safely.",
        mode: "scenario",
        difficulty: "beginner",
        estimatedMinutes: 20,
        objectives: [
          {
            id: "obj-remote-1",
            title: "Identify local vs remote refs",
            measurableOutcome: "Learner correctly explains main vs origin/main in mission debrief.",
          },
          {
            id: "obj-remote-2",
            title: "Use fetch before integrating",
            measurableOutcome: "Learner runs fetch and inspects divergence before merge/rebase.",
          },
        ],
      },
      {
        id: "working-with-remotes",
        title: "Working With Remotes",
        summary: "Practice push/pull/fetch flows and upstream setup.",
        mode: "scenario",
        difficulty: "beginner",
        estimatedMinutes: 25,
        objectives: [
          {
            id: "obj-remote-3",
            title: "Set upstream branch",
            measurableOutcome: "Learner uses push --set-upstream correctly in at least one mission.",
          },
          {
            id: "obj-remote-4",
            title: "Recover from non-fast-forward push",
            measurableOutcome: "Learner resolves rejected push by syncing and retrying successfully.",
          },
        ],
      },
      {
        id: "fork-clone-workflow",
        title: "Fork & Clone Workflow",
        summary: "Contribute like open-source teams: fork sync and upstream PR prep.",
        mode: "scenario",
        difficulty: "intermediate",
        estimatedMinutes: 30,
        objectives: [
          {
            id: "obj-remote-5",
            title: "Sync fork from upstream",
            measurableOutcome: "Learner updates fork branch from upstream without losing local commits.",
          },
        ],
      },
    ],
  },
  {
    id: "phase-2-pr-simulator",
    title: "PR & Review Simulator",
    releaseOrder: 2,
    mvp: true,
    topics: [
      {
        id: "pull-request-flow",
        title: "Pull Request Flow",
        summary: "Create PRs, pass checks, and merge with the right strategy.",
        mode: "pr-simulator",
        difficulty: "intermediate",
        estimatedMinutes: 35,
        objectives: [
          {
            id: "obj-pr-1",
            title: "Open complete PR",
            measurableOutcome: "Learner submits PR with valid title, summary, and linked branch.",
          },
          {
            id: "obj-pr-2",
            title: "Choose merge strategy",
            measurableOutcome: "Learner selects merge type that matches branch policy constraints.",
          },
        ],
      },
      {
        id: "code-review-workflow",
        title: "Code Review Workflow",
        summary: "Handle review feedback, revise commits, and re-request review.",
        mode: "review",
        difficulty: "intermediate",
        estimatedMinutes: 30,
        objectives: [
          {
            id: "obj-pr-3",
            title: "Address requested changes",
            measurableOutcome: "Learner applies fixes and updates PR without breaking checks.",
          },
        ],
      },
      {
        id: "branch-protection-rules",
        title: "Branch Protection Rules",
        summary: "Understand required checks/reviews and blocked direct pushes.",
        mode: "pr-simulator",
        difficulty: "intermediate",
        estimatedMinutes: 25,
        objectives: [
          {
            id: "obj-pr-4",
            title: "Respect protection policies",
            measurableOutcome: "Learner resolves blocked merge by satisfying policy gates.",
          },
        ],
      },
    ],
  },
]

export function getTeamCurriculumPhase(phaseId: string): TeamCurriculumPhase | undefined {
  return gitTeamCurriculum.find((phase) => phase.id === phaseId)
}
