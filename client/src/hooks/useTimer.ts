import { useState, useEffect, useRef, useCallback } from "react"

export function useTimer() {
  const [elapsed, setElapsed] = useState(0) // seconds
  const [running, setRunning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setElapsed((s) => s + 1), 1000)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [running])

  const start = useCallback(() => setRunning(true), [])
  const stop = useCallback(() => setRunning(false), [])
  const reset = useCallback(() => {
    setRunning(false)
    setElapsed(0)
  }, [])

  const formatted = `${Math.floor(elapsed / 60)
    .toString()
    .padStart(2, "0")}:${(elapsed % 60).toString().padStart(2, "0")}`

  return { elapsed, formatted, running, start, stop, reset }
}
