import * as PIXI from 'pixi.js'
import data from "../assets/sprites/data.json"
import { App } from '../main'

export interface SpriteContext {
  sprite: PIXI.AnimatedSprite
  solution: string
}

export enum SpriteType {
  FALLING_OBJECT = "FALLING_OBJECT",
  PLAYER = "PLAYER",
  EXPLOSION = "EXPLOSION"
}

export class Loader {

  public static textures: { string?: PIXI.Texture[] } = {};

  public static GetPlayerSprite(): PIXI.AnimatedSprite {
    const player = data.sprites.find(sprite => sprite.type === SpriteType.PLAYER);
    const playerTextures = Loader.textures[player.key];
    return new PIXI.AnimatedSprite(playerTextures);
  }

  public static GetExplosionSprite(): PIXI.AnimatedSprite {
    const player = data.sprites.find(sprite => sprite.type === SpriteType.EXPLOSION);
    const playerTextures = Loader.textures[player.key];
    return new PIXI.AnimatedSprite(playerTextures);
  }

  public static GetFallingObjectSprite(): SpriteContext {
    const fallingObjects = data.sprites.filter(sprite => sprite.type === SpriteType.FALLING_OBJECT);
    const randomObject = fallingObjects[Math.floor(Math.random() * fallingObjects.length)];

    const objectTextures = Loader.textures[randomObject.key];

    return {
      sprite: new PIXI.AnimatedSprite(objectTextures),
      solution: randomObject.solution
    }
  }

  public static Load(){
      const loader = PIXI.Loader.shared;
      loader.baseUrl = 'assets';

      data.sprites.forEach((element: any) => {
        loader.add(element.key, `sprites/${element.path}`);
      })

      loader.load(this.loading);
      loader.onComplete.add(this.loadingComplete);
  }

  private static loadingComplete(){
      App.initialize();
  }

  private static loading(loader, resources){
      data.sprites.forEach((element: any) => {
        const sheet = resources[element.key];

        if (sheet.error){
          throw new Error(sheet.error);
        }

        const frames = sheet.data.frames;
        const textures = Object.keys(frames).map(key => PIXI.Texture.from(key));
        Loader.textures[element.key] = (Loader.textures[element.key] || []).concat(textures);
      })
  }
}

