// @ts-check
import * as Location from '../functions/location.js';
import {Screen} from './screen.js';
import {TargetSelection} from './target-selection.js';
import {createGetRenderingDataByLocation} from './renderer.js';

/**
 * 명령(서버에 요청할) 생성, 플레이어 선택, 키보드, 트리거, 길찾기와 자동명령(장거리 이동 등) 등 클라이언트 편의성 기능. mouseLocation
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
    const mouseLocation = [0, 0],

      /** @type {import('./renderer.js').Overlay[]} */
      overlayList = [],

      /** @type {import('./renderer.js').Connection[]} */
      connectionList = [],

      getRenderingDataByLocation = createGetRenderingDataByLocation(mapSize, mapPalette, mapData, overlayList);

    const canvas = root.appendChild(document.createElement('canvas'));
    canvas.classList.add('layer');

    resize();
    addEventListener('resize', resize);
    canvas.addEventListener('mousedown', canvasMousedown);
    new TargetSelection(canvas, mouseLocation, overlayList, connectionList, mapSize, mapData);
    new KeyDown(지형선택);
    new Screen(canvas, mouseLocation, getRenderingDataByLocation, connectionList);
    oncontextmenu = e => e.preventDefault();



    /** @param {MouseEvent} e */
    function canvasMousedown(e) {
      if (e.button == 2) {
        new ChangeMapData(canvas, mouseLocation, 지형선택, mapSize, mapData);
      }
    }

    function resize() {
      canvas.width  = innerWidth;
      canvas.height = innerHeight;
    }

  }
}

class ChangeMapData {
  /**
   * @param {HTMLElement} node
   * @param {number[]} mouseLocation
   * @param {Number[]} 지형선택
   * @param {number[]} mapSize
   * @param {number[]} mapData
   */
  constructor(node, mouseLocation, 지형선택, mapSize, mapData) {
    node.addEventListener('mousemove', mousemove);
    addEventListener('mouseup', mouseup);

    function mousemove() {
      const index = Location.getIndexByLocation(mouseLocation, mapSize);
      if (index !== undefined) {
        mapData[index] = 지형선택[0];
      }
    }
    /** @param {MouseEvent} e */
    function mouseup(e) {
      if (e.button != 2) return;
      node.removeEventListener('mousemove', mousemove);
      removeEventListener('mousemove', mouseup);
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