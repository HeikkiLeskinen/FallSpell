
import * as PIXI from 'pixi.js';
import { TextInput } from "pixi-textinput-v5"
import { GameApp } from './app';
import { GameContext } from './types';

export class Player {
  sprite: PIXI.Sprite;
  input: TextInput;

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
    this.input = input

    GameApp.Stage.addChild(this.input)
  }

  private onKeyPress(keyCode: number){
    if (keyCode === 13){
      // @ts-ignore
      GameApp.context.word = this.input.text
    }
  }

  public Update(delta: number, context: GameContext) {

  }

  get isAlive(): boolean {
    return true;
  }

  get hasCrashed(): boolean {
    return false;
  }
}