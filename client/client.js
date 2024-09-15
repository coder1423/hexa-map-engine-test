// @ts-check
import {Interaction} from './interaction.js';
import * as Map from '../map-data.js';

/**
 * 서버통신, 데이터 테이블
 */
export class Client {
  /**
   * @param {HTMLElement} root
   */
  constructor(root) {
    new Interaction(root, Map.size, Map.data, Map.palette);
  }
}