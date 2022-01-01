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

  private static textures: { string?: PIXI.Texture[] } = {};
  private static fallingObjRepo: any[] = [];

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
    const randomObject = Loader.fallingObjRepo[Math.floor(Math.random() * Loader.fallingObjRepo.length)];
    let index = Loader.fallingObjRepo.findIndex(d => d.key === randomObject.key);
    Loader.fallingObjRepo.splice(index, 1);

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

      //FIXME: isolate to a class
    let fallingObjRepo = data.sprites.filter(sprite => sprite.type === SpriteType.FALLING_OBJECT);
    fallingObjRepo = fallingObjRepo.concat(fallingObjRepo).concat(fallingObjRepo);
    shuffleArray(fallingObjRepo)
    Loader.fallingObjRepo = fallingObjRepo;
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}
