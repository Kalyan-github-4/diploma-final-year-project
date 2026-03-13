import { useReducer, useEffect, type FC, type ReactNode } from 'react'
import { LayoutEngineeringContext } from './layout-engineering.context'
import { layoutEngineeringReducer, defaultInitialState } from './layout-engineering.state'
import type { PathId, LayoutEngineeringContextType, LayoutChallenge } from '@/types/layout-engineering.types'

export const LayoutEngineeringProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(layoutEngineeringReducer, defaultInitialState)

  useEffect(() => {
    const stored = localStorage.getItem('codeking-layout-progress')
    if (!stored) return

    const parsed = JSON.parse(stored)

    const unlockedPaths = new Set<PathId>(
      parsed.unlockedPaths || ['flexbox']
    )

    dispatch({
      type: 'LOAD_PROGRESS',
      payload: {
        ...parsed,
        unlockedPaths,
      },
    })
  }, [])

 const value: LayoutEngineeringContextType = {
  ...state,

  updateCssInput: (css: string) =>
    dispatch({ type: 'UPDATE_CSS_INPUT', payload: css }),

  updateValidationState: v =>
    dispatch({ type: 'UPDATE_VALIDATION_STATE', payload: v }),

  completeChallenge: r =>
    dispatch({ type: 'COMPLETE_CHALLENGE', payload: r }),

  moveToNextLevel: () =>
    dispatch({ type: 'MOVE_TO_NEXT_LEVEL' }),

  moveToPreviousLevel: () =>
    dispatch({ type: 'MOVE_TO_PREVIOUS_LEVEL' }),

  selectPath: id =>
    dispatch({ type: 'SELECT_PATH', payload: id }),

  selectLevel: i =>
    dispatch({ type: 'SELECT_LEVEL', payload: i }),

  unlockPath: id =>
    dispatch({ type: 'UNLOCK_PATH', payload: id }),

  toggleHint: () =>
    dispatch({ type: 'TOGGLE_HINT' }),

  resetChallenge: () =>
    dispatch({ type: 'RESET_CHALLENGE' }),

setCurrentChallenge: (c: LayoutChallenge) =>
  dispatch({ type: 'SET_CURRENT_CHALLENGE', payload: c }),

  loadProgress: () => {},

  saveProgress: () => {},
}

  return (
    <LayoutEngineeringContext.Provider value={value}>
      {children}
    </LayoutEngineeringContext.Provider>
  )
}