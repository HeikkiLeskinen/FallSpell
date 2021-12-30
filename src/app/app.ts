import * as PIXI from 'pixi.js';
import { FallingObject } from './fallingObject';
import { Loader } from './Loader'
import { Player } from './player';
import { GameContext, WorldObjects } from './types';
import { gameOverText } from './utils';
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
        respawnCounter: 200
      }
    }

    private update(delta: number) {

        if (GameApp.ActiveEntities.find(obj => obj.hasCrashed)){
          GameApp.EndGame();
        }

        if (!GameApp.GameOver){ //FIXME: should be a game phase?
          for (const currentEntity of GameApp.ActiveEntities) {
            GameApp.ActiveEntities = GameApp.ActiveEntities.filter(obj => obj.isAlive);
            currentEntity.Update(delta, GameApp.context)
          }

          if (GameApp.ShouldAddAnotherObject(delta)){
            GameApp.ActiveEntities.push(new FallingObject())
          }
        }
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
    GameApp.Stage.addChild(gameOverText);
    GameApp.GameOver = true;
  }
}
