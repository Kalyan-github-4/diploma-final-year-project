import { useState, useEffect, useCallback, useRef } from "react"

const SERVER = import.meta.env.VITE_SERVER_URL || "http://localhost:4000"
const USER_ID = "default-user" // replace with auth later

export interface ModuleProgress {
  completedLevels: number[]
  levelXp: Record<string, number>
  totalXpEarned: number
  timeSpent: Record<string, number>
}

const EMPTY: ModuleProgress = {
  completedLevels: [],
  levelXp: {},
  totalXpEarned: 0,
  timeSpent: {},
}

function lsKey(slug: string) {
  return `codeking_module_progress_${slug}`
}

function loadLocal(slug: string): ModuleProgress {
  try {
    const raw = localStorage.getItem(lsKey(slug))
    if (!raw) return { ...EMPTY }
    const parsed = JSON.parse(raw)
    // Migrate old format (just completedLevels + totalXpEarned) to new format
    return {
      completedLevels: parsed.completedLevels ?? [],
      levelXp: parsed.levelXp ?? {},
      totalXpEarned: parsed.totalXpEarned ?? 0,
      timeSpent: parsed.timeSpent ?? {},
    }
  } catch {
    return { ...EMPTY }
  }
}

function saveLocal(slug: string, progress: ModuleProgress) {
  localStorage.setItem(lsKey(slug), JSON.stringify(progress))
}

async function fetchRemote(slug: string): Promise<ModuleProgress | null> {
  try {
    const res = await fetch(`${SERVER}/api/progress?userId=${USER_ID}&slug=${slug}`)
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

async function pushRemote(slug: string, progress: ModuleProgress): Promise<boolean> {
  try {
    const res = await fetch(`${SERVER}/api/progress`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: USER_ID, slug, ...progress }),
    })
    return res.ok
  } catch {
    return false
  }
}

function merge(local: ModuleProgress, remote: ModuleProgress): ModuleProgress {
  const completedSet = new Set([...local.completedLevels, ...remote.completedLevels])
  const levelXp: Record<string, number> = { ...remote.levelXp }
  for (const [k, v] of Object.entries(local.levelXp)) {
    levelXp[k] = Math.max(levelXp[k] ?? 0, v)
  }
  const timeSpent: Record<string, number> = { ...remote.timeSpent }
  for (const [k, v] of Object.entries(local.timeSpent)) {
    timeSpent[k] = Math.max(timeSpent[k] ?? 0, v)
  }
  const totalXpEarned = Object.values(levelXp).reduce((s, v) => s + v, 0)

  return {
    completedLevels: [...completedSet].sort((a, b) => a - b),
    levelXp,
    totalXpEarned,
    timeSpent,
  }
}

export function useProgressSync(slug: string) {
  const [progress, setProgress] = useState<ModuleProgress>(() => loadLocal(slug))
  const [synced, setSynced] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // On mount: fetch from DB, merge with localStorage
  useEffect(() => {
    let cancelled = false
    fetchRemote(slug).then((remote) => {
      if (cancelled) return
      if (remote) {
        const local = loadLocal(slug)
        const merged = merge(local, remote)
        setProgress(merged)
        saveLocal(slug, merged)
        pushRemote(slug, merged) // sync merged back
      }
      setSynced(true)
    })
    return () => { cancelled = true }
  }, [slug])

  // Debounced save to DB + localStorage on every change
  useEffect(() => {
    if (!synced) return // don't save during initial load
    saveLocal(slug, progress)

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      pushRemote(slug, progress)
    }, 1500)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [progress, slug, synced])

  const completeLevel = useCallback((levelId: number, xp: number, timeSeconds?: number) => {
    setProgress((prev) => {
      if (prev.completedLevels.includes(levelId)) return prev
      const levelXp = { ...prev.levelXp, [String(levelId)]: xp }
      const totalXpEarned = Object.values(levelXp).reduce((s, v) => s + v, 0)
      const timeSpent = timeSeconds
        ? { ...prev.timeSpent, [String(levelId)]: timeSeconds }
        : prev.timeSpent
      return {
        completedLevels: [...prev.completedLevels, levelId].sort((a, b) => a - b),
        levelXp,
        totalXpEarned,
        timeSpent,
      }
    })
  }, [])

  const updateLevelXp = useCallback((levelId: number, xp: number) => {
    setProgress((prev) => {
      const current = prev.levelXp[String(levelId)] ?? 0
      if (xp <= current) return prev
      const levelXp = { ...prev.levelXp, [String(levelId)]: xp }
      const totalXpEarned = Object.values(levelXp).reduce((s, v) => s + v, 0)
      return { ...prev, levelXp, totalXpEarned }
    })
  }, [])

  return { progress, synced, completeLevel, updateLevelXp }
}
