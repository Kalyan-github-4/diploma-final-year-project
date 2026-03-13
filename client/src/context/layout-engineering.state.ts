import type {
    LayoutEngineeringState,
    LayoutChallenge,
    ChallengeResult,
    ValidationState,
    PathId,
} from '@/types/layout-engineering.types'

export const defaultInitialState: LayoutEngineeringState = {
    currentPathId: 'flexbox',
    currentLevelIndex: 0,
    currentChallenge: null,
    cssInput: '',
    debugEditHistory: [],
    pathProgress: {
        flexbox: {
            pathId: 'flexbox',
            completedLevels: new Set(),
            xpEarned: 0,
            streakCount: 0,
            badgesEarned: [],
            lastCompletedAt: null,
        },
        grid: {
            pathId: 'grid',
            completedLevels: new Set(),
            xpEarned: 0,
            streakCount: 0,
            badgesEarned: [],
            lastCompletedAt: null,
        },
        'layout-pro': {
            pathId: 'layout-pro',
            completedLevels: new Set(),
            xpEarned: 0,
            streakCount: 0,
            badgesEarned: [],
            lastCompletedAt: null,
        },
    },
    unlockedPaths: new Set<PathId>(['flexbox', 'grid', 'layout-pro']),
    userResults: {},
    validationState: 'incomplete',
    liveMetrics: {
        cssMatchCount: 0,
        cssTargetCount: 0,
    },
    showHint: false,
    currentResult: null,
    isLoading: false,
    error: null,
}

export type LayoutEngineeringAction =
    | { type: 'UPDATE_CSS_INPUT'; payload: string }
    | { type: 'UPDATE_VALIDATION_STATE'; payload: ValidationState }
    | { type: 'MOVE_TO_NEXT_LEVEL' }
    | { type: 'MOVE_TO_PREVIOUS_LEVEL' }
    | { type: 'SELECT_PATH'; payload: PathId }
    | { type: 'SELECT_LEVEL'; payload: number }
    | { type: 'UNLOCK_PATH'; payload: PathId }
    | { type: 'SET_CURRENT_CHALLENGE'; payload: LayoutChallenge }
    | { type: 'COMPLETE_CHALLENGE'; payload: ChallengeResult }
    | { type: 'RESET_CHALLENGE' }
    | { type: 'LOAD_PROGRESS'; payload: Partial<LayoutEngineeringState> }
    | { type: 'TOGGLE_HINT' }

export function layoutEngineeringReducer(
    state: LayoutEngineeringState,
    action: LayoutEngineeringAction
): LayoutEngineeringState {
    switch (action.type) {
        case 'UPDATE_CSS_INPUT':
            return { ...state, cssInput: action.payload }

        case 'UPDATE_VALIDATION_STATE':
            return { ...state, validationState: action.payload }

        case 'MOVE_TO_NEXT_LEVEL':
            return {
                ...state,
                currentLevelIndex: Math.min(state.currentLevelIndex + 1, 5),
                cssInput: '',
                validationState: 'incomplete',
            }

        case 'MOVE_TO_PREVIOUS_LEVEL':
            return {
                ...state,
                currentLevelIndex: Math.max(state.currentLevelIndex - 1, 0),
                cssInput: '',
                validationState: 'incomplete',
            }

        case 'SELECT_PATH':
            return {
                ...state,
                currentPathId: action.payload,
                currentLevelIndex: 0,
            }

        case 'SELECT_LEVEL':
            return {
                ...state,
                currentLevelIndex: Math.max(0, Math.min(5, action.payload)),
            }

        case 'UNLOCK_PATH':
            return {
                ...state,
                unlockedPaths: new Set([...state.unlockedPaths, action.payload]),
            }

        case 'SET_CURRENT_CHALLENGE':
            return { ...state, currentChallenge: action.payload }

        case 'COMPLETE_CHALLENGE': {
            const r = action.payload
            const progress = state.pathProgress[r.pathId]
            const newCompleted = new Set(progress.completedLevels)
            newCompleted.add(r.level)

            return {
                ...state,
                pathProgress: {
                    ...state.pathProgress,
                    [r.pathId]: {
                        ...progress,
                        completedLevels: newCompleted,
                        xpEarned: progress.xpEarned + r.xpEarned,
                        lastCompletedAt: r.completedAt,
                    },
                },
                currentResult: r,
                validationState: 'complete',
                cssInput: '',
            }
        }

        case 'RESET_CHALLENGE':
            return {
                ...state,
                cssInput: '',
                validationState: 'incomplete',
            }

        case 'LOAD_PROGRESS':
            return { ...state, ...action.payload }
            
        case 'TOGGLE_HINT':
            return {
                ...state,
                showHint: !state.showHint,
            }

        default:
            return state
    }
}