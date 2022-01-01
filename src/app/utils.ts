import * as PIXI from 'pixi.js';

const style = new PIXI.TextStyle({
  fontFamily: 'Arial',
  fontSize: 36,
  fontStyle: 'italic',
  fontWeight: 'bold',
  fill: ['#ffffff', '#00ff99'],
  stroke: '#4a1850',
  strokeThickness: 5,
  dropShadow: true,
  dropShadowColor: '#000000',
  dropShadowBlur: 4,
  dropShadowAngle: Math.PI / 6,
  dropShadowDistance: 6,
  wordWrap: true,
  wordWrapWidth: 440,
  lineJoin: 'round',
});

export const gameOverLostText = new PIXI.Text('Spelet över! Du fölorare!', style);
gameOverLostText.x = 250;
gameOverLostText.y = 300;

export const gameOverWinText = new PIXI.Text('Krattis Pro! Du vann!', style);
gameOverWinText.x = 250;
gameOverWinText.y = 300;

