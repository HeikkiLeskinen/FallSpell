import { FallingObject } from "./fallingObject";
import { Player } from "./player";

export type WorldObjects = FallingObject | Player

export interface GameContext {
  word?: string
  respawnCounter: number
}