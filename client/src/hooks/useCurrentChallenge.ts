import { useLayoutEngineering } from './useLayoutEngineering'
import type { LayoutChallenge } from '@/types/layout-engineering.types'

export function useCurrentChallenge(): LayoutChallenge | null {
  const { currentChallenge } = useLayoutEngineering()
  return currentChallenge
}
