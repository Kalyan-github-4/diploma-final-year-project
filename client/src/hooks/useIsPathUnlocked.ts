import { useLayoutEngineering } from './useLayoutEngineering'
import type { PathId } from '@/types/layout-engineering.types'

export function useIsPathUnlocked(pathId: PathId): boolean {
  const { unlockedPaths } = useLayoutEngineering()
  return unlockedPaths.has(pathId)
}