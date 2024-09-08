// @ts-check
import * as Location from '../functions/location.js';
import {Screen} from './screen.js';

/**
 * 명령(서버에 요청할) 생성, 플레이어 선택, 키보드, 트리거, 길찾기와 자동명령(장거리 이동 등) 등 클라이언트 편의성 기능
 */
export class Interaction {
  /**
   * @param {HTMLElement} root
   * @param {Number[]} mapSize
   * @param {Number[]} mapData
   * @param {Number[][]} mapPalette
   */
  constructor(root, mapSize, mapData, mapPalette) {
    let 지형선택 = 0;
    const 지형선택Map = new Map([
      ['Digit1', 1],
      ['Digit2', 2],
      ['Digit3', 3],
      ['Digit4', 4],
      ['Digit5', 5],
      ['Digit6', 6],
      ['Digit7', 7],
      ['Digit8', 8],
      ['Digit9', 9],
      ['Digit0', 0]
    ]);
    addEventListener('keydown', keydown);

    new Screen(root, getRenderingDataByLocation, triggerDataChangeByLocation);

    /**
     * @param {Number[]} location
     */
    function getRenderingDataByLocation(location) {
      const index = Location.getIndexByLocation(location, mapSize);
      if (index !== undefined) {
        return mapPalette[mapData[index]];
      }
    }

    /**
     * @param {Number[]} location
     */
    function triggerDataChangeByLocation(location) {
      const index = Location.getIndexByLocation(location, mapSize);
      if (index !== undefined) {
        mapData[index] = 지형선택;
      }
    }
    
    /** @param {KeyboardEvent} e */
    function keydown(e) {
      const num = 지형선택Map.get(e.code);
      if (num !== undefined) {
        지형선택 = num;
      }
    }
  }
}