import type { DSAAlgorithm, StepQuestion } from "@/types/dsa.types"

interface DSAQuestionStepPayload {
  stepId: string
  type: string
  description: string
  codeLine: number
  snapshot: Record<string, unknown>
}

interface GenerateDSAQuestionsPayload {
  algorithm: DSAAlgorithm
  context: {
    array: number[]
    target?: number
  }
  steps: DSAQuestionStepPayload[]
}

interface DSAQuestionResponseItem extends StepQuestion {
  stepId: string
}

interface DSAQuestionsResponse {
  questions: DSAQuestionResponseItem[]
}

const API_BASE = import.meta.env.VITE_SERVER_URL || "http://localhost:4000"

export async function generateAIDSAQuestions(
  payload: GenerateDSAQuestionsPayload
): Promise<DSAQuestionResponseItem[]> {
  const response = await fetch(`${API_BASE}/api/ai/dsa/questions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`DSA AI question generation failed (${response.status})`)
  }

  const data = (await response.json()) as DSAQuestionsResponse
  return Array.isArray(data.questions) ? data.questions : []
}
