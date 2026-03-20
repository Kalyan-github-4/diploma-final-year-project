// server/src/services/missionAI.service.js

import Anthropic from "@anthropic-ai/sdk"
import { db } from "../db/index.js"
import { 
  aiMissions, 
  commandStats, 
  userProgress,
  users
} from "../db/schema.js"
import { eq, and } from "drizzle-orm"

const client = new Anthropic()

// ─── 1. GET USER CONTEXT ─────────────────
async function getUserContext(userId, topicId) {

  // Get user basic info
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId)
  })

  // Get completed missions for this topic
  const completedMissions = await db
    .select()
    .from(aiMissions)
    .where(
      and(
        eq(aiMissions.userId, userId),
        eq(aiMissions.topicId, topicId),
        eq(aiMissions.completed, true)
      )
    )

  // Get session number (how many times 
  // they've done this topic)
  const sessionNumber = completedMissions.length + 1

  // Get command stats
  const stats = await db
    .select()
    .from(commandStats)
    .where(eq(commandStats.userId, userId))

  const weakCommands = stats
    .filter(s => s.failCount > s.successCount)
    .map(s => s.command)

  const masteredCommands = stats
    .filter(s => s.successCount >= 3 
             && s.failCount === 0)
    .map(s => s.command)

  // Get completed mission IDs to avoid repeats
  const completedIds = completedMissions
    .map(m => m.missionData.id)

  return {
    user,
    sessionNumber,
    weakCommands,
    masteredCommands,
    completedIds,
    level: user.level
  }
}

// ─── 2. CALCULATE DIFFICULTY ─────────────
function calculateDifficulty(sessionNumber, level) {
  if (sessionNumber <= 2) return "easy"
  if (sessionNumber <= 4) return "medium"
  return "hard"
}

// ─── 3. GET TOPIC FOCUS ──────────────────
function getTopicFocus(topicId, sessionNumber) {
  const focusMap = {
    "branching-deep-dive": [
      "creating and switching branches",
      "understanding HEAD movement",
      "committing on feature branches",
      "merging branches back to main",
      "complex multi-branch scenarios"
    ],
    "merge-vs-rebase": [
      "basic fast-forward merge",
      "3-way merge with merge commit",
      "basic rebase onto main",
      "interactive rebase squashing",
      "rebase vs merge decision making"
    ],
    "reset-revert-restore": [
      "git revert a bad commit safely",
      "git reset --soft to unstage",
      "git reset --mixed to undo commit",
      "git reset --hard with caution",
      "choosing the right undo strategy"
    ],
    "merge-conflicts": [
      "understanding conflict markers",
      "resolving a simple conflict",
      "aborting a bad merge",
      "resolving multiple file conflicts",
      "preventing conflicts with good workflow"
    ]
  }

  const focuses = focusMap[topicId] || [
    "basic workflow",
    "intermediate commands",
    "advanced scenarios"
  ]
  
  const index = Math.min(
    sessionNumber - 1,
    focuses.length - 1
  )
  return focuses[index]
}

// ─── 4. BUILD PROMPTS ────────────────────
const systemPrompt = `
You are a senior Git educator and learning experience designer for CodeKing, 
a visual, interactive platform that teaches developers through real-world struggle.

Your job is NOT to generate tasks.
Your job is to DESIGN a realistic learning mission based on how developers actually fail, get confused, and recover.

────────────────────
THINKING PROCESS (MANDATORY)
Before generating the mission, you MUST internally reason:

1. What exact confusion or mistake does a developer have in this topic?
2. What real-world scenario would naturally cause this mistake?
3. How would a developer fix this step-by-step using Git?
4. How will the Git graph visually change during this process?

Only after this, generate the mission.

────────────────────
MISSION FORMAT (STRICT JSON ONLY)

Return ONLY valid JSON. No explanation. No markdown. No backticks.

{
  "id": "kebab-case-unique-id",
  "title": "Short engaging title (max 5 words)",
  "topicId": "same-as-requested",
  "xp": number (100–1000),
  "difficulty": "easy" | "medium" | "hard",
  "description": "One realistic sentence describing what the user is doing",
  "steps": [
    {
      "id": "step-1",
      "instruction": "Clear single action instruction",
      "completedBy": "exact git command prefix",
      "alternates": ["optional alternate commands"],
      "hint": "Helpful hint without giving full answer"
    }
  ],
  "initialGraphState": {
    "commits": {
      "abc1234": {
        "message": "commit message",
        "parent": null
      }
    },
    "branches": {
      "main": "abc1234"
    },
    "HEAD": {
      "type": "branch",
      "ref": "main"
    }
  }
}

────────────────────
STRICT RULES

1. Return JSON only — no extra text whatsoever
2. Each step = exactly ONE git command action
3. completedBy must be a valid git command prefix
4. All branch refs must point to existing commits
5. All parent refs must point to existing commits
6. Commit hashes must be exactly 7 characters
7. Last step MUST be either "git log" or "git status"
8. Never reuse a mission id from the excluded list

────────────────────
DIFFICULTY DESIGN

easy:
- 3–4 steps
- linear flow
- beginner-friendly scenario

medium:
- 5–7 steps
- includes branching or switching context
- requires understanding of flow

hard:
- 8–10 steps
- multiple branches or recovery scenarios
- includes decision-making or fixing mistakes

────────────────────
QUALITY RULES (VERY IMPORTANT)

- Title must NOT be generic (avoid "Learn X", "Practice Y")
- Description must describe a REAL situation (bug, feature, team workflow)
- Scenario must feel like actual development work
- Avoid textbook-style instructions
- Steps must feel like real commands a developer would run
- Use meaningful commit messages (not "commit 1")

────────────────────
USER CONTEXT USAGE

- If weak commands are provided → include them in steps
- If commands are mastered → you can rely on them
- Avoid repeating previously completed missions

────────────────────
EXAMPLE (REFERENCE QUALITY)

{
  "id": "fix-login-branch",
  "title": "Fix Login Bug",
  "topicId": "branching-deep-dive",
  "xp": 200,
  "difficulty": "easy",
  "description": "Fix a login bug in a feature branch and merge it back to main",
  "steps": [
    {
      "id": "step-1",
      "instruction": "Create a new branch for fixing the login bug",
      "completedBy": "git checkout -b",
      "alternates": ["git switch -c"],
      "hint": "You need a separate branch for the fix"
    },
    {
      "id": "step-2",
      "instruction": "Commit the login bug fix",
      "completedBy": "git commit",
      "alternates": [],
      "hint": "Save your changes before merging"
    },
    {
      "id": "step-3",
      "instruction": "Merge the fix into main branch",
      "completedBy": "git merge",
      "alternates": [],
      "hint": "Switch to main before merging"
    },
    {
      "id": "step-4",
      "instruction": "Check commit history",
      "completedBy": "git log",
      "alternates": [],
      "hint": "Verify the fix is applied"
    }
  ],
  "initialGraphState": {
    "commits": {
      "a1b2c3d": {
        "message": "initial commit",
        "parent": null
      }
    },
    "branches": {
      "main": "a1b2c3d"
    },
    "HEAD": {
      "type": "branch",
      "ref": "main"
    }
  }
}
`
// USER PROMPT BUILDER
function buildUserPrompt(context, topicId, difficulty) {
  return `
Generate a Git mission.

Topic: ${topicId}
Difficulty: ${difficulty}
Focus area: ${getTopicFocus(topicId, context.sessionNumber)}

Session number: ${context.sessionNumber}
User level: ${context.level}

User weaknesses (prioritize these):
${context.weakCommands.join(", ") || "none"}

User mastered:
${context.masteredCommands.join(", ") || "none"}

Exclude these mission ids:
${context.completedIds.join(", ") || "none"}

Make the mission feel like:
- fixing a real bug
- building a feature
- handling team workflow
- resolving a real mistake

Avoid textbook-style tasks.
  `
}

// ─── 5. VALIDATE MISSION ─────────────────
function validateMission(mission) {
  const { commits, branches, HEAD } = 
    mission.initialGraphState

  // Check required fields
  if (!mission.id) throw new Error("Missing mission id")
  if (!mission.steps?.length) 
    throw new Error("Missing steps")
  if (!mission.initialGraphState) 
    throw new Error("Missing graph state")

  // Check branch refs exist
  for (const [name, hash] of Object.entries(branches)) {
    if (!commits[hash]) {
      throw new Error(
        `Branch '${name}' points to 
         missing commit '${hash}'`
      )
    }
  }

  // Check parent refs exist
  for (const [hash, commit] of Object.entries(commits)) {
    if (commit.parent && !commits[commit.parent]) {
      throw new Error(
        `Commit '${hash}' has missing 
         parent '${commit.parent}'`
      )
    }
  }

  // Check HEAD is valid
  if (HEAD.type === "branch" && !branches[HEAD.ref]) {
    throw new Error(
      `HEAD points to missing branch '${HEAD.ref}'`
    )
  }

  return true
}

// ─── 6. MAIN GENERATE FUNCTION ───────────
export async function generateMission(userId, topicId) {

  // Get user context from DB
  const context = await getUserContext(userId, topicId)

  // Calculate difficulty
  const difficulty = calculateDifficulty(
    context.sessionNumber,
    context.level
  )

  // Call Anthropic API
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1500,
    system: systemPrompt,
    messages: [
      {
        role: "user",
        content: buildUserPrompt(
          context, 
          topicId, 
          difficulty
        )
      }
    ]
  })

  // Parse JSON
  const raw = response.content[0].text.trim()
  let mission

  try {
    mission = JSON.parse(raw)
  } catch (err) {
    // Sometimes AI adds backticks despite instructions
    const cleaned = raw
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim()
    mission = JSON.parse(cleaned)
  }

  // Validate structure
  validateMission(mission)

  // Save to DB
  const [saved] = await db
    .insert(aiMissions)
    .values({
      userId,
      topicId,
      missionData: mission,
      difficulty,
      sessionNumber: context.sessionNumber,
    })
    .returning()

  return {
    mission,
    missionDbId: saved.id,
    sessionNumber: context.sessionNumber,
    difficulty
  }
}