import { useState, useCallback } from "react"

export interface VoiceOption {
  id: string
  label: string
  gender: "female" | "male"
  accent: "american" | "british"
  description: string
}

export const VOICE_OPTIONS: VoiceOption[] = [
  { id: "af_heart", label: "Heart", gender: "female", accent: "american", description: "Warm & natural" },
  { id: "af_bella", label: "Bella", gender: "female", accent: "american", description: "Expressive & clear" },
  { id: "af_nova", label: "Nova", gender: "female", accent: "american", description: "Bright & friendly" },
  { id: "af_sarah", label: "Sarah", gender: "female", accent: "american", description: "Calm & professional" },
  { id: "am_adam", label: "Adam", gender: "male", accent: "american", description: "Natural & steady" },
  { id: "am_michael", label: "Michael", gender: "male", accent: "american", description: "Deep & confident" },
  { id: "bf_emma", label: "Emma", gender: "female", accent: "british", description: "British & elegant" },
  { id: "bm_george", label: "George", gender: "male", accent: "british", description: "British & articulate" },
]

const STORAGE_KEY = "codeking_voice_preference"

export function useVoicePreference() {
  const [voiceId, setVoiceId] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || "af_heart"
    } catch {
      return "af_heart"
    }
  })

  const setVoice = useCallback((id: string) => {
    setVoiceId(id)
    try {
      localStorage.setItem(STORAGE_KEY, id)
    } catch {
      // ignore
    }
  }, [])

  return { voiceId, setVoice }
}

export function getStoredVoiceId(): string {
  try {
    return localStorage.getItem(STORAGE_KEY) || "af_heart"
  } catch {
    return "af_heart"
  }
}
