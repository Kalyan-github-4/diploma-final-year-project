const { env } = require("../config/env")

function missionId(prefix = "git-mission") {
  const suffix = Math.random().toString(36).slice(2, 10)
  return `${prefix}-${Date.now()}-${suffix}`
}

function sanitizeSeed(value) {
  const raw = String(value || Date.now())
  return raw.replace(/[^a-zA-Z0-9]/g, "").slice(0, 10) || "seed"
}

const LEVEL_GENERATION_PROFILE = {
  1: { focus: "Initialize repository and inspect working tree", requiredCommands: ["git init", "git status", "git add ."] },
  2: { focus: "Commit hygiene and readable history", requiredCommands: ["git status", "git add .", "git commit -m", "git log --oneline"] },
  3: { focus: "Staging and restoring safely", requiredCommands: ["git add .", "git status", "git restore"] },
  4: { focus: "Investigate changes with log and diff", requiredCommands: ["git log --oneline", "git diff", "git status"] },
  5: { focus: "Undo local mistakes safely", requiredCommands: ["git status", "git restore", "git reset --soft"] },
  6: { focus: "Produce clean team-ready commits", requiredCommands: ["git add .", "git commit -m", "git log --oneline"] },
  7: { focus: "Start isolated feature development", requiredCommands: ["git checkout -b", "git add .", "git commit -m"] },
  8: { focus: "Switch between parallel branches", requiredCommands: ["git checkout -b", "git checkout", "git status"] },
  9: { focus: "Fast-forward merge workflows", requiredCommands: ["git checkout main", "git merge", "git log --oneline"] },
  10: { focus: "Release and hotfix branch workflow", requiredCommands: ["git checkout -b hotfix", "git commit -m", "git merge"] },
  11: { focus: "Branch policy and review prep", requiredCommands: ["git checkout -b", "git commit -m", "git log --oneline"] },
  12: { focus: "Integration readiness before merge", requiredCommands: ["git checkout main", "git merge", "git status"] },
  13: { focus: "Linear history with rebase", requiredCommands: ["git rebase", "git log --oneline", "git checkout main"] },
  14: { focus: "Resolve merge conflicts correctly", requiredCommands: ["git merge", "git status", "git merge --abort"] },
  15: { focus: "Recovery toolkit for production safety", requiredCommands: ["git revert", "git reflog", "git log --oneline"] },
  16: { focus: "Remote synchronization and tracking", requiredCommands: ["git fetch origin", "git pull origin main", "git push -u origin"] },
  17: { focus: "End-to-end pull request lifecycle", requiredCommands: ["git pr create", "git pr checks", "git pr review approve", "git pr merge --squash"] },
  18: { focus: "Full incident response workflow", requiredCommands: ["git fetch origin", "git rebase", "git pr create", "git pr merge --squash"] },
}

function getLevelProfile(level) {
  return LEVEL_GENERATION_PROFILE[level] || {
    focus: "General Git mission flow",
    requiredCommands: ["git status", "git add .", "git commit -m"],
  }
}

function levelToDifficultyBand(level) {
  const map = {
    1: [1, 1, 2],
    2: [1, 2, 2],
    3: [1, 2, 3],
    4: [2, 2, 3],
    5: [2, 3, 3],
    6: [2, 3, 4],
    7: [2, 3, 4],
    8: [3, 3, 4],
    9: [3, 4, 4],
    10: [3, 4, 5],
    11: [3, 4, 5],
    12: [4, 4, 5],
    13: [4, 5, 5],
    14: [4, 5, 6],
    15: [5, 5, 6],
    16: [5, 6, 6],
    17: [5, 6, 6],
    18: [6, 6, 6],
  }
  return map[level] || [3, 4, 5]
}

function baseTopicFromLevel(level) {
  if (level <= 6) return "git-basics"
  if (level <= 12) return "branching-workflows"
  if (level <= 15) return "merge-and-history"
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

function buildFallbackMission({ level, difficulty, orderIndex, topic, seed }) {
  const prefix = topic || baseTopicFromLevel(level)
  const branchName = `feature-${sanitizeSeed(seed)}-l${level}-${orderIndex + 1}`
  const scenarioLabel = `Scenario ${String(seed || "A").slice(0, 6)}`

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
    title: `Level ${level} Mission ${orderIndex + 1} • ${prefix} • ${scenarioLabel}`,
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

function parseJsonFromText(text) {
  if (!text || typeof text !== "string") return null

  const cleaned = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/, "")
    .trim()

  try {
    return JSON.parse(cleaned)
  } catch {
    return null
  }
}

async function tryOpenAIMissionBatch({ userId, level, topic, difficulties, generationNonce, previousMissions }) {
  if (!env.openAiApiKey) return null;
  const levelProfile = getLevelProfile(level);

  const previousMissionHints = (previousMissions || []).slice(-5).map((mission) => ({
    title: mission?.title,
    firstStep: mission?.steps?.[0]?.instruction,
  }));

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
  };

  const systemPrompt =
    "Generate Git practice missions as strict JSON only (no prose). Ensure missions are level-specific, sorted easiest to hardest by provided difficulty values, and each mission includes commands aligned to levelProfile.requiredCommands. Do not repeat previous mission titles or same first-step pattern. Output must be valid JSON matching this schema: " + JSON.stringify(schemaHint);

  const requestPayload = {
    userId,
    level,
    topic,
    levelProfile,
    difficulties,
    generationNonce,
    avoidRepeatingPatternsFrom: previousMissionHints,
    constraints: {
      uniqueTitles: true,
      variedBranchNames: true,
      newScenarioContextPerMission: true,
    },
    outputSchema: schemaHint,
  };

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${env.openAiApiKey}`,
    },
    body: JSON.stringify({
      model: env.openAiModel || "gpt-4.1-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: JSON.stringify(requestPayload) },
      ],
      temperature: 0.2,
      response_format: { type: "json_object" },
    }),
  });

  if (!response.ok) return null;

  const data = await response.json();
  let parsed = null;
  if (data.choices && data.choices[0]?.message?.content) {
    parsed = parseJsonFromText(data.choices[0].message.content);
  }
  if (!parsed) return null;

  const missions = Array.isArray(parsed?.missions) ? parsed.missions : null;
  if (!missions || missions.length === 0) return null;

  return missions;
}

async function generateMissionSet({ userId, level, topic, generationNonce, previousMissions }) {
  const difficulties = levelToDifficultyBand(level)
  const levelProfile = getLevelProfile(level)
  const aiMissions = await tryOpenAIMissionBatch({
    userId,
    level,
    topic,
    difficulties,
    generationNonce,
    previousMissions,
  })
  const seed = sanitizeSeed(generationNonce)
  const previousTitleSet = new Set(
    (previousMissions || [])
      .map((mission) => String(mission?.title || "").trim().toLowerCase())
      .filter(Boolean)
  )

  const normalized = (aiMissions || difficulties.map((difficulty, index) =>
    buildFallbackMission({ level, difficulty, orderIndex: index, topic, seed: `${seed}${index}` })
  ))
    .slice(0, 3)
    .sort((a, b) => Number(a.difficulty) - Number(b.difficulty))
    .map((mission, index) => ({
      ...mission,
      difficulty: Number(mission.difficulty) || difficulties[index] || 3,
      orderIndex: index,
      missionId: mission.missionId || missionId("generated"),
      title: mission.title || `Level ${level} • ${levelProfile.focus}`,
      level,
    }))

  const nonRepeating = normalized.filter((mission) => {
    const key = String(mission?.title || "").trim().toLowerCase()
    return key ? !previousTitleSet.has(key) : true
  })

  if (nonRepeating.length >= 2) {
    return nonRepeating.slice(0, 3)
  }

  return normalized
}

module.exports = {
  generateMissionSet,
}
