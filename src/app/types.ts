import { FallingObject } from "./fallingObject";
import { Player } from "./player";

export type WorldObjects = FallingObject | Player

export interface GameContext {
  word?: string
  score: Score,
  health: Score,
  respawnCounter: number
}

interface Score {
  max: number,
  current: number
}