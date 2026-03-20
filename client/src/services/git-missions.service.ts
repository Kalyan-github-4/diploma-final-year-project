import type { Mission } from "@/lib/mission.utils"

interface GenerateMissionPayload {
  userId: string
  level: number
  topic?: string
  generationNonce?: string
}

interface MissionApiResponse {
  missions: Mission[]
}

const API_BASE = import.meta.env.VITE_SERVER_URL || "http://localhost:4000"

export async function generateGitMissions(
  payload: GenerateMissionPayload
): Promise<Mission[]> {
  const response = await fetch(`${API_BASE}/api/git/missions/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`Mission generation failed (${response.status})`)
  }

  const data = (await response.json()) as MissionApiResponse
  return Array.isArray(data.missions) ? data.missions : []
}
