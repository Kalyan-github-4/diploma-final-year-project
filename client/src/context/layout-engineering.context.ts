import { createContext } from 'react'
import type { LayoutEngineeringContextType } from '@/types/layout-engineering.types'

export const LayoutEngineeringContext =
  createContext<LayoutEngineeringContextType | undefined>(undefined)