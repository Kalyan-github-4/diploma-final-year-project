import { z } from "zod"

/** The three PlayZone game modes */
export const gameModes = ["flexbox", "monster", "coin"] as const
export type GameMode = (typeof gameModes)[number]

/** POST body – save / update progress */
export const saveProgressSchema = z.object({
  mode: z.enum(gameModes),
  level: z.number().int().positive(),
  cssInput: z.string().optional(),
  isCompleted: z.boolean(),
  score: z.number().int().min(0).optional(),
  stars: z.number().int().min(0).max(3).optional(),
})

export type SaveProgressInput = z.infer<typeof saveProgressSchema>

/** GET query – user progress */
export const getProgressQuerySchema = z.object({
  mode: z.enum(gameModes).optional(),
})

/** GET query – leaderboard */
export const leaderboardQuerySchema = z.object({
  mode: z.enum(gameModes),
})
