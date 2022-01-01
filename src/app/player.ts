
import * as PIXI from 'pixi.js';
import { TextInput } from "pixi-textinput-v5"
import { GameApp } from './app';
import { GameContext } from './types';

export class Player {

  #input: TextInput;
  #healthBar: PIXI.Container;
  #scoreBar: PIXI.Container;

  public constructor() {

    const input = new TextInput({
      input: {
        fontSize: '36px',
        padding: '12px',
        width: '500px',
        color: '#26272E'
      },
      box: {
        default: {fill: 0xE8E9F3, rounded: 12, stroke: {color: 0xCBCEE0, width: 3}},
        focused: {fill: 0xE1E3EE, rounded: 12, stroke: {color: 0xABAFC6, width: 3}},
        disabled: {fill: 0xDBDBDB, rounded: 12}
      }
    })

    input.x = 400
    input.y = 500
    input.pivot.x = input.width / 2
    input.pivot.y = input.height / 2

    // @ts-ignore
    input.on('keydown', (keyCode: number) => this.onKeyPress(keyCode))
    this.#input = input

    GameApp.Stage.addChild(this.#input)

    this.#healthBar = this.createBar(GameApp.Stage.width, 4, 128, 0xFF3300);
    this.#scoreBar = this.createBar(100, 4, 128, 0x33FF00);
  }

  private createBar(x: number, y:number, value: number, color: number): PIXI.Container {
    const mainBar = new PIXI.Container();
    mainBar.position.set(x ,y);

    const innerBar = new PIXI.Graphics();
    innerBar.beginFill(0x666666);
    innerBar.drawRect(0, 0, 128, 8);
    innerBar.endFill();
    mainBar.addChild(innerBar);

    const outerBar = new PIXI.Graphics();
    outerBar.beginFill(color);
    outerBar.drawRect(0, 0, value, 8);
    outerBar.endFill();
    mainBar.addChild(outerBar);

    GameApp.Stage.addChild(mainBar);
    return outerBar;
  }

  private onKeyPress(keyCode: number){
    if (keyCode === 13){
      // @ts-ignore
      GameApp.context.word = this.#input.text.trim();
      // @ts-ignore
      this.#input.text = '';
    }
  }

  public Update(delta: number, context: GameContext) {
    this.#healthBar.width = (context.health.current * 128 / context.health.max);
    this.#scoreBar.width= (context.score.current * 128 / context.score.max);
  }

  get isAlive(): boolean {
    return true;
  }
}
