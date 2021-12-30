import * as PIXI from 'pixi.js';
import { GameApp } from './app';
import { Loader } from './Loader'
import { GameContext } from './types';

export class FallingObject {
  sprite: PIXI.AnimatedSprite
  explosion: PIXI.AnimatedSprite
  answer: string
  _isAlive: boolean
  _crashed: boolean

  public constructor() {
    const spriteContext = Loader.GetFallingObjectSprite();
    const sprite = spriteContext.sprite;

    sprite.x = 300;
    sprite.animationSpeed = 0.05;
    sprite.play();
    sprite.anchor.set(0.5);
    sprite.scale.set(0.25);

    this.sprite = sprite;
    this.answer = spriteContext.solution;

    const explosion = Loader.GetExplosionSprite();
    explosion.anchor.x = 0.5;
		explosion.anchor.y = 0.5;
    explosion.loop = false;
    explosion.animationSpeed = 10/60;
    this.explosion = explosion;

    this._isAlive = true;
    this._crashed = false;

    GameApp.Stage.addChild(this.sprite)
  }

  public Update(delta: number, context: GameContext) {
    if (this._isAlive){
      this.sprite.y += 0.2
      this.sprite.rotation += 0.02 * delta

      if (context.word === this.answer){
        this.onDestroyed();
      }

      if (this.sprite.y > 430){
        this._crashed = true;
      }
    }
  }

  onDestroyed() {
    GameApp.Stage.addChild(this.explosion);
    this.explosion.position.x = this.sprite.position.x;
    this.explosion.position.y = this.sprite.position.y;
    this.explosion.onComplete = () => this.remove();
    this.explosion.play();
  }

  remove(){
    this._isAlive = false;
    this.explosion.destroy(); //why???
    GameApp.Stage.removeChild(this.explosion);
    GameApp.Stage.removeChild(this.sprite);
  }

  get isAlive(): boolean {
    return this._isAlive;
  }

  get hasCrashed(): boolean {
    return this._crashed;
  }
}