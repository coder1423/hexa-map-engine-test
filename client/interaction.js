// @ts-check
import * as Location from '../functions/location.js';
import {Screen} from './screen.js';
import {Overlay, Connection, createGetRenderingDataByLocation} from './renderer.js';

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
    let 지형선택 = [0];

    const 시야거리 = 10, 이동력 = 10,

      set = new Set(),
      overlayList = [
        new Overlay([255,255,255], set, 0.75)
      ],

      list = [],
      connectionList = [
        new Connection('rgba(255,255,255)', 3, list)
      ];

    new KeyDown(지형선택);
    new Screen(root, createGetRenderingDataByLocation(mapSize, mapPalette, mapData, overlayList), triggerDataChangeByLocation, connectionList);

    /**
     * @param {Number[]} location
     */
    function triggerDataChangeByLocation(location) {
      const index = Location.getIndexByLocation(location, mapSize);
      if (index !== undefined) {
        mapData[index] = 지형선택[0];
      }
    }

  }
}

class KeyDown {
  /**
   * @param {Number[]} 지형선택
   */
  constructor(지형선택) {
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

    /** @param {KeyboardEvent} e */
    function keydown(e) {
      const num = 지형선택Map.get(e.code);
      if (num !== undefined) {
        지형선택[0] = num;
      }
    }

  }
}