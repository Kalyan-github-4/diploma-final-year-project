const { env } = require("../config/env")

function missionId(prefix = "git-mission") {
  const suffix = Math.random().toString(36).slice(2, 10)
  return `${prefix}-${Date.now()}-${suffix}`
}

function levelToDifficultyBand(level) {
  if (level <= 3) return [1, 2, 3]
  if (level <= 6) return [2, 3, 4]
  if (level <= 9) return [3, 4, 5]
  return [4, 5, 6]
}

function baseTopicFromLevel(level) {
  if (level <= 3) return "git-basics"
  if (level <= 6) return "branching-workflows"
  if (level <= 9) return "merge-and-history"
  return "advanced-collaboration"
}

function buildGraphState(difficulty) {
  const root = "a1b2c3d"
  const mid = "b2c3d4e"
  const feature = "c3d4e5f"

  if (difficulty <= 2) {
    return {
      commits: {
        [root]: { message: "initial commit", parent: null },
        [mid]: { message: "setup project", parent: root },
      },
      branches: { main: mid },
      HEAD: { type: "branch", ref: "main" },
    }
  }

  return {
    commits: {
      [root]: { message: "initial commit", parent: null },
      [mid]: { message: "setup project", parent: root },
      [feature]: { message: "feature draft", parent: mid },
    },
    branches: { main: mid, "feature-login": feature },
    HEAD: { type: "branch", ref: difficulty >= 4 ? "feature-login" : "main" },
  }
}

function buildFallbackMission({ level, difficulty, orderIndex, topic }) {
  const prefix = topic || baseTopicFromLevel(level)
  const branchName = `feature-level-${level}-${orderIndex + 1}`

  const stepsByDifficulty = {
    1: [
      {
        instruction: "Initialize your repository with `git init`.",
        completedBy: "git init",
        alternates: [],
        hint: "Run git init to start a repository.",
      },
      {
        instruction: "Check repository status using `git status`.",
        completedBy: "git status",
        alternates: [],
        hint: "git status shows tracked and untracked changes.",
      },
      {
        instruction: "Stage all changes with `git add .`.",
        completedBy: "git add .",
        alternates: ["git add"],
        hint: "Use git add . to stage everything quickly.",
      },
    ],
    2: [
      {
        instruction: `Create and switch to branch \`${branchName}\` using \`git checkout -b\`.`,
        completedBy: `git checkout -b ${branchName}`,
        alternates: [`git switch -c ${branchName}`],
        hint: "Use checkout -b (or switch -c) to create and switch.",
      },
      {
        instruction: "Stage your work with `git add .`.",
        completedBy: "git add .",
        alternates: ["git add"],
        hint: "Stage files before committing.",
      },
      {
        instruction: "Commit with `git commit -m`.",
        completedBy: "git commit -m",
        alternates: [],
        hint: "Always write a clear commit message.",
      },
    ],
    3: [
      {
        instruction: `Create branch \`${branchName}\` from main.`,
        completedBy: `git checkout -b ${branchName}`,
        alternates: [`git switch -c ${branchName}`],
        hint: "Start isolated work in feature branches.",
      },
      {
        instruction: "Commit your branch changes.",
        completedBy: "git commit -m",
        alternates: [],
        hint: "Commit your staged changes to save progress.",
      },
      {
        instruction: "Switch back to `main`.",
        completedBy: "git checkout main",
        alternates: ["git switch main"],
        hint: "Return to main before merge.",
      },
      {
        instruction: `Merge \`${branchName}\` into main.`,
        completedBy: `git merge ${branchName}`,
        alternates: [],
        hint: "Use git merge to integrate branch history.",
      },
    ],
    4: [
      {
        instruction: "Inspect commit history with `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: ["git log"],
        hint: "Compact history is useful before branch operations.",
      },
      {
        instruction: "Create and switch to a new feature branch.",
        completedBy: `git checkout -b ${branchName}`,
        alternates: [`git switch -c ${branchName}`],
        hint: "Name branches by scope and intent.",
      },
      {
        instruction: "Commit your new changes.",
        completedBy: "git commit -m",
        alternates: [],
        hint: "Commit in small, descriptive units.",
      },
      {
        instruction: "Switch to `main` and merge your branch.",
        completedBy: `git merge ${branchName}`,
        alternates: [],
        hint: "After switching to main, merge the feature branch.",
      },
    ],
    5: [
      {
        instruction: "Switch to `main` before starting hotfix work.",
        completedBy: "git checkout main",
        alternates: ["git switch main"],
        hint: "Hotfixes typically branch from main.",
      },
      {
        instruction: "Create `hotfix-critical` branch.",
        completedBy: "git checkout -b hotfix-critical",
        alternates: ["git switch -c hotfix-critical"],
        hint: "Keep hotfix scope minimal and urgent.",
      },
      {
        instruction: "Commit the hotfix changes.",
        completedBy: "git commit -m",
        alternates: [],
        hint: "Use a message that describes the incident fix.",
      },
      {
        instruction: "Switch to `main` and merge `hotfix-critical`.",
        completedBy: "git merge hotfix-critical",
        alternates: [],
        hint: "Merge hotfix branch back to main quickly.",
      },
      {
        instruction: "Verify history with `git log --oneline`.",
        completedBy: "git log --oneline",
        alternates: ["git log"],
        hint: "Check that your merge path looks correct.",
      },
    ],
    6: [
      {
        instruction: "Create `feature-alpha` and commit changes there.",
        completedBy: "git checkout -b feature-alpha",
        alternates: ["git switch -c feature-alpha"],
        hint: "First branch should isolate one feature stream.",
      },
      {
        instruction: "Create `feature-beta` and commit changes there.",
        completedBy: "git checkout -b feature-beta",
        alternates: ["git switch -c feature-beta"],
        hint: "Second branch lets you practice multi-branch flow.",
      },
      {
        instruction: "Switch to `main`.",
        completedBy: "git checkout main",
        alternates: ["git switch main"],
        hint: "Return to integration branch.",
      },
      {
        instruction: "Merge `feature-alpha`.",
        completedBy: "git merge feature-alpha",
        alternates: [],
        hint: "Merge first feature stream.",
      },
      {
        instruction: "Merge `feature-beta`.",
        completedBy: "git merge feature-beta",
        alternates: [],
        hint: "Merge second feature stream and verify graph.",
      },
    ],
  }

  const selectedSteps = stepsByDifficulty[difficulty] || stepsByDifficulty[3]

  return {
    missionId: missionId("generated"),
    title: `Level ${level} Mission ${orderIndex + 1} • ${prefix}`,
    topicId: prefix,
    xp: 120 + difficulty * 70,
    difficulty,
    steps: selectedSteps.map((step, index) => ({
      id: `step-${index + 1}`,
      instruction: step.instruction,
      completedBy: step.completedBy,
      alternates: step.alternates,
      hint: step.hint,
    })),
    initialGraphState: buildGraphState(difficulty),
  }
}

async function tryOpenAiMissionBatch({ userId, level, topic, difficulties }) {
  if (!env.openAiApiKey) return null

  const schemaHint = {
    missions: [
      {
        missionId: "string",
        title: "string",
        topicId: "string",
        xp: 300,
        difficulty: 1,
        steps: [
          {
            id: "step-1",
            instruction: "Use markdown backticks for commands like `git status`.",
            completedBy: "git status",
            alternates: ["git status -sb"],
            hint: "short hint",
          },
        ],
        initialGraphState: {
          commits: {
            a1b2c3d: { message: "initial", parent: null },
          },
          branches: { main: "a1b2c3d" },
          HEAD: { type: "branch", ref: "main" },
        },
      },
    ],
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.openAiApiKey}`,
    },
    body: JSON.stringify({
      model: env.openAiModel,
      input: [
        {
          role: "system",
          content:
            "Generate Git practice missions as strict JSON only. No prose. Ensure missions are sorted from easiest to hardest by provided difficulty values and every step is executable in a git simulator.",
        },
        {
          role: "user",
          content: JSON.stringify({
            userId,
            level,
            topic,
            difficulties,
            outputSchema: schemaHint,
          }),
        },
      ],
      text: {
        format: { type: "json_object" },
      },
    }),
  })

  if (!response.ok) return null

  const data = await response.json()
  const raw = data?.output_text
  if (!raw) return null

  let parsed = null
  try {
    parsed = JSON.parse(raw)
  } catch {
    return null
  }

  const missions = Array.isArray(parsed?.missions) ? parsed.missions : null
  if (!missions || missions.length === 0) return null

  return missions
}

async function generateMissionSet({ userId, level, topic }) {
  const difficulties = levelToDifficultyBand(level)
  const aiMissions = await tryOpenAiMissionBatch({ userId, level, topic, difficulties })

  const normalized = (aiMissions || difficulties.map((difficulty, index) =>
    buildFallbackMission({ level, difficulty, orderIndex: index, topic })
  ))
    .slice(0, 3)
    .sort((a, b) => Number(a.difficulty) - Number(b.difficulty))
    .map((mission, index) => ({
      ...mission,
      difficulty: Number(mission.difficulty) || difficulties[index] || 3,
      orderIndex: index,
      missionId: mission.missionId || missionId("generated"),
      level,
    }))

  return normalized
}

module.exports = {
  generateMissionSet,
}
