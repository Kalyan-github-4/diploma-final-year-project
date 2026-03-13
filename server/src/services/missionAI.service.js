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
You are a Git mission generator for CodeKing,
a visual learning platform for intermediate developers.

Generate a Git learning mission as valid JSON only.
No explanation. No markdown. No backticks. JSON only.

The mission must follow this EXACT structure:
{
  "id": "kebab-case-unique-id",
  "title": "Short engaging title (max 5 words)",
  "topicId": "same-as-requested",
  "xp": 100-1000,
  "difficulty": "easy" | "medium" | "hard",
  "description": "One sentence what user practices",
  "steps": [
    {
      "id": "step-1",
      "instruction": "Clear single action instruction",
      "completedBy": "exact git command prefix",
      "alternates": ["optional", "alternate commands"],
      "hint": "Helpful nudge without giving answer"
    }
  ],
  "initialGraphState": {
    "commits": {
      "7charha": {
        "message": "commit message",
        "parent": null
      }
    },
    "branches": { "main": "7charha" },
    "HEAD": { "type": "branch", "ref": "main" }
  }
}

STRICT RULES:
1. Return JSON only — no extra text whatsoever
2. Each step = exactly ONE git command action
3. completedBy = valid git command prefix
4. All branch refs must point to existing commits
5. All parent refs must point to existing commits
6. Commit hashes must be exactly 7 characters
7. easy   = 3-4 steps, linear graph (1-2 commits)
8. medium = 5-7 steps, branched graph (3-4 commits)
9. hard   = 8-10 steps, complex graph (4-6 commits)
10. Use realistic dev scenarios (real app features)
11. Last step should always be git log or git status
12. Never reuse a mission id from the excluded list
`

function buildUserPrompt(context, topicId, difficulty) {
  return `
Generate a Git mission with these requirements:

Topic: ${topicId}
Difficulty: ${difficulty}
Focus area: ${getTopicFocus(topicId, context.sessionNumber)}
Session number: ${context.sessionNumber}
User level: ${context.level}

User context:
- Weak commands (use these for practice): 
  ${context.weakCommands.join(", ") || "none yet"}
- Mastered commands (can rely on these): 
  ${context.masteredCommands.join(", ") || "none yet"}

Exclude these mission ids (already completed):
${context.completedIds.join(", ") || "none"}

Make the scenario realistic — like building 
a real product feature, fixing a real bug, 
or handling a real team workflow situation.
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