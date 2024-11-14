// @ts-check
import {Screen} from '../modules/screen.js';
import {Interaction} from './interaction.js';
import {Selection} from './selection.js';
import {Renderer} from '../modules/renderer.js';
import {model} from '../modules/data.js';

addEventListener('load', init, {once : true});



/**
 * 브라우져 전역 데이터, 서버통신, 데이터 테이블
 */
function init() {
  const root = document.querySelector('main');
  if (!root) return;

  const screen = new Screen();
  const interaction = new Interaction(root, screen, model);
  Selection(screen, interaction, model);
  Renderer(screen, interaction.rendering, model);

}