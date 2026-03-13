import { useContext } from 'react'
import { LayoutEngineeringContext } from '../context/layout-engineering.context'
import type { LayoutEngineeringContextType } from '@/types/layout-engineering.types'


export function useLayoutEngineering(): LayoutEngineeringContextType {
  const context = useContext(LayoutEngineeringContext)
  if (!context) {
    throw new Error(
      'useLayoutEngineering must be used within LayoutEngineeringProvider'
    )
  }
  return context
}
