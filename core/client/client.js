// @ts-check
import {model} from '../modules/data.js';
import {Screen} from '../modules/screen.js';
import {Renderer} from '../modules/renderer.js';
import {Interaction} from './interaction.js';
import {Selection} from './selection.js';

addEventListener('load', main, {once : true});



function main() {
  const root = document.querySelector('main');
  if (!root) return;

  const screen = new Screen();
  const renderer = new Renderer(screen, model);

  const interaction = new Interaction(root, screen, model);
  Selection(screen, renderer, interaction, model);

}