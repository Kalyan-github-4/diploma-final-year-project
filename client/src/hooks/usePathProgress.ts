import { useLayoutEngineering } from './useLayoutEngineering'
import type { PathId } from '@/types/layout-engineering.types'

export function usePathProgress(pathId: PathId) {
  const { pathProgress } = useLayoutEngineering()
  return pathProgress[pathId]
}