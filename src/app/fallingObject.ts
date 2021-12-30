import * as PIXI from 'pixi.js';
import { GameApp } from './app';
import { Loader } from './Loader'
import { GameContext } from './types';

export class FallingObject {
  #sprite: PIXI.AnimatedSprite
  #explosion: PIXI.AnimatedSprite
  #answer: string
  #isAlive: boolean
  #hasCrashed: boolean

  public constructor() {
    const spriteContext = Loader.GetFallingObjectSprite();
    const sprite = spriteContext.sprite;

    sprite.x = 300; // FIXME: make random but not overlapping. lanes?
    sprite.animationSpeed = 0.05;
    sprite.play();
    sprite.anchor.set(0.5);
    sprite.scale.set(0.25);

    this.#sprite = sprite;
    this.#answer = spriteContext.solution;

    const explosion = Loader.GetExplosionSprite();
    explosion.anchor.x = 0.5;
		explosion.anchor.y = 0.5;
    explosion.loop = false;
    explosion.animationSpeed = 10/60;
    this.#explosion = explosion;

    this.#isAlive = true;
    this.#hasCrashed = false;

    GameApp.Stage.addChild(this.#sprite)
  }

  public Update(delta: number, context: GameContext) {
    if (this.isAlive){
      this.#sprite.y += 0.2
      this.#sprite.rotation += 0.02 * delta

      if (context.word === this.#answer){
        this.onDestroyed();
        GameApp.context.word = null; // FIXME: should be game logic & readonly
      }

      if (this.#sprite.y > 430){ // FIXME: hitting the player
        this.#hasCrashed = true;
      }
    }
  }

  onDestroyed() {
    GameApp.Stage.addChild(this.#explosion);
    this.#explosion.position.x = this.#sprite.position.x;
    this.#explosion.position.y = this.#sprite.position.y;
    this.#explosion.onComplete = () => this.remove();
    this.#explosion.play();
    this.#isAlive = false;
  }

  remove(){
    this.#explosion.destroy(); //FIXME: why???
    GameApp.Stage.removeChild(this.#explosion);
    GameApp.Stage.removeChild(this.#sprite);
  }

  get isAlive()  {
    return this.#isAlive;
  }

  get hasCrashed()  {
    return this.#hasCrashed;
  }

}