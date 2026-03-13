import { useContext } from 'react'
import { LayoutEngineeringContext } from '../context/layout-engineering.context'

export function useLayoutEngineering() {
  const ctx = useContext(LayoutEngineeringContext)

  if (!ctx)
    throw new Error(
      'useLayoutEngineering must be used inside LayoutEngineeringProvider'
    )

  return ctx
}