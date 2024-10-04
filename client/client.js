// @ts-check
import {Interaction} from './interaction.js';
import * as Map from '../map-data.js';

addEventListener('load',() => new Client(), {once : true});

/**
 * 브라우져 전역 데이터, 서버통신, 데이터 테이블
 */
export class Client {
  constructor() {
    const root = document.querySelector('main');
    if (!root) return;
    new Interaction(root, Map.size, Map.data, Map.palette);
  }
}