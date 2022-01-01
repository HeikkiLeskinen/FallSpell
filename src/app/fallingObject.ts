import * as PIXI from 'pixi.js';
import { GameApp } from './app';
import { Loader } from './Loader'
import { GameContext } from './types';

export class FallingObject {
  #spriteContainer: PIXI.Container;
  #explosion: PIXI.AnimatedSprite;
  #hint: PIXI.Text;

  #answer: string;
  #isAlive: boolean;
  #hasCrashed: boolean;
  #hasHint: boolean;

  public constructor() {
    const spriteContext = Loader.GetFallingObjectSprite();
    const sprite = spriteContext.sprite;
    this.#spriteContainer = new PIXI.Container();

    //sprite.x = 300; // FIXME: make random but not overlapping. lanes?
    sprite.animationSpeed = 0.05;
    sprite.play();
    //sprite.anchor.set(0.5);
    sprite.scale.set(0.25);

    this.#spriteContainer.addChild(sprite);

    this.#spriteContainer.x = 300;
    this.#spriteContainer.pivot.x = this.#spriteContainer.width / 2;
    this.#spriteContainer.pivot.y = this.#spriteContainer.height / 2;

    this.#answer = spriteContext.solution;

    const explosion = Loader.GetExplosionSprite();
    explosion.anchor.x = 0.5;
		explosion.anchor.y = 0.5;
    explosion.loop = false;
    explosion.animationSpeed = 10/60;
    this.#explosion = explosion;

    this.#hint = new PIXI.Text(this.#answer, {fontFamily : 'Arial', fontSize: 24, fill : 0xffffff, align : 'center'});
    this.#hint.y = sprite.height;
    this.#hint.x = sprite.width / 2 - (this.#hint.width / 2);

    this.#isAlive = true;
    this.#hasHint = false;

    GameApp.Stage.addChild(this.#spriteContainer)
  }

  public Update(delta: number, context: GameContext) {
    if (this.isAlive){
      this.#spriteContainer.y += 0.3
      this.#spriteContainer.rotation += 0.02 * delta

      if (this.equals(context.word,this.#answer)){
        this.onDestroyed();
        GameApp.context.word = null; // FIXME: should be game logic & readonly
        GameApp.context.score.current += 1;
      }

      if (!this.#hasHint && this.#spriteContainer.y > 260){ // FIXME: hitting the player
        this.#hasHint = true;
        this.#spriteContainer.addChild(this.#hint);
      }

      if (!this.#hasCrashed && this.#spriteContainer.y > 440){ // FIXME: hitting the player
        this.onDestroyed();

        GameApp.context.word = null;
        GameApp.context.health.current -= 1;
      }
    }
  }

  private equals(a: string, b: string) {
    return typeof a === 'string' && typeof b === 'string'
        ? a.localeCompare(b, undefined, { sensitivity: 'accent' }) === 0
        : a === b;
  }

  onDestroyed() {
    this.#explosion.position.x = this.#spriteContainer.position.x;
    this.#explosion.position.y = this.#spriteContainer.position.y;
    GameApp.Stage.addChild(this.#explosion);
    this.#explosion.onComplete = () => this.remove();
    this.#explosion.play();
    this.#isAlive = false;
  }

  remove(){
    this.#explosion.destroy(); //FIXME: why???
    GameApp.Stage.removeChild(this.#hint);
    GameApp.Stage.removeChild(this.#explosion);
    GameApp.Stage.removeChild(this.#spriteContainer);
  }

  get isAlive()  {
    return this.#isAlive;
  }

}