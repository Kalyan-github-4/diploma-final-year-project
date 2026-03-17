import type { DSAAlgorithm, LearningMode } from "@/types/dsa.types"

type DSAEventName = "started" | "completed" | "predict_hit" | "predict_miss" | "replay"

interface DSAEventPayload {
  algorithm: DSAAlgorithm
  mode: LearningMode
  step?: number
  totalSteps?: number
  details?: string
  timestamp: string
}

const EVENT_STORAGE_KEY = "codeking_dsa_events"

export function trackDSAEvent(name: DSAEventName, payload: Omit<DSAEventPayload, "timestamp">) {
  const entry = {
    name,
    ...payload,
    timestamp: new Date().toISOString(),
  }

  try {
    const existingRaw = localStorage.getItem(EVENT_STORAGE_KEY)
    const existing = existingRaw ? (JSON.parse(existingRaw) as unknown[]) : []
    const next = [...existing, entry].slice(-500)
    localStorage.setItem(EVENT_STORAGE_KEY, JSON.stringify(next))
  } catch {
    return
  }
}
