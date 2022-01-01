import * as PIXI from 'pixi.js';
import { FallingObject } from './fallingObject';
import { Loader } from './Loader'
import { Player } from './player';
import { GameContext, WorldObjects } from './types';
import { gameOverLostText, gameOverWinText } from './utils';
export class GameApp {

  static app: PIXI.Application // TODO: is the static the way to go?
  static Stage: PIXI.Container
  static ActiveEntities: Array<WorldObjects> = []
  static context: GameContext
  static GameOver: boolean;

  constructor(parent: HTMLElement, width: number, height: number) {
      GameApp.app = new PIXI.Application({width, height, backgroundColor : 0x000000})
      parent.replaceChild(GameApp.app.view, parent.lastElementChild)
      Loader.Load()
  }

  public initialize(): void {
    this.setup();
    GameApp.app.ticker.add(this.update)
  }

  private setup(): void {
    GameApp.Stage = GameApp.app.stage
    GameApp.GameOver = false;
    GameApp.ActiveEntities.push(new Player())
    GameApp.context = {
      score: { max: 10, current: 0 },
      health: { max: 3, current: 3 },
      respawnCounter: 200
    }
  }

  private update(delta: number) {

      if (!GameApp.GameOver){ //FIXME: should be a game phase?
        for (const currentEntity of GameApp.ActiveEntities) {
          GameApp.ActiveEntities = GameApp.ActiveEntities.filter(obj => obj.isAlive);
          currentEntity.Update(delta, GameApp.context)
        }

        if (GameApp.ShouldAddAnotherObject(delta)){
          GameApp.ActiveEntities.push(new FallingObject())
        }
      }

      if (GameApp.shouldStopTheGame()){
        GameApp.EndGame();
      }
  }

  static shouldStopTheGame() {
    return GameApp.context.score.current >= GameApp.context.score.max ||
    GameApp.context.health.current <= 0
  }

  static ShouldAddAnotherObject(delta: number) {
    if (GameApp.ActiveEntities.length <= 1){
      if (GameApp.context.respawnCounter < 0){
        GameApp.context.respawnCounter = 200; // TODO: make nicer?
        return true;
      } else {
        GameApp.context.respawnCounter -= delta;
      }
    }
    return false;
  }

  static EndGame(){
    if (GameApp.context.score.current >= GameApp.context.score.max){
      GameApp.Stage.addChild(gameOverWinText);
    } else {
      GameApp.Stage.addChild(gameOverLostText);
    }
    GameApp.GameOver = true;
  }
}
