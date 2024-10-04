// @ts-check
import * as Location from '../functions/location.js';
import {Screen} from './screen.js';
import {Overlay, Connection, createGetRenderingDataByLocation} from './renderer.js';

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

    const 시야거리 = 10, 이동력 = 10, mouseLocation = [0, 0],

      set = new Set(),
      overlayList = [
        new Overlay([255,255,255], set, 0.75)
      ],

      list = [],
      connectionList = [
        new Connection('rgba(255,255,255)', 0.5, list)
      ],

      getRenderingDataByLocation = createGetRenderingDataByLocation(mapSize, mapPalette, mapData, overlayList),

      canvas = root.appendChild(document.createElement('canvas'));
    canvas.classList.add('layer');

    new ReSize(canvas);
    new CanvasMouseDown(canvas, mouseLocation, 지형선택, mapSize, mapData);
    new KeyDown(지형선택);
    new Screen(canvas, mouseLocation, getRenderingDataByLocation, connectionList);
    oncontextmenu = e => e.preventDefault();
  }
}

class ReSize {
  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas) {
    resize();
    addEventListener('resize', resize);

    function resize() {
      canvas.width  = innerWidth;
      canvas.height = innerHeight;
    }

  }
}

class CanvasMouseDown {
  /**
   * @param {HTMLElement} node
   * @param {Number[]} mouseLocation
   * @param {Number[]} 지형선택
   * @param {number[]} mapSize
   * @param {number[]} mapData
   */
  constructor(node, mouseLocation, 지형선택, mapSize, mapData) {
    addEventListener('mousedown', mousedown);

    /** @param {MouseEvent} e */
    function mousedown(e) {
      switch (e.button) {
        case 1: // 휠클릭
          break;
        case 0: // 좌클릭
          console.log(mouseLocation);
          break;
        case 2: // 우클릭
          new CanvasMouseRightMove(node, mouseLocation, 지형선택, mapSize, mapData);
          break;
      }
    }

  }
}

class CanvasMouseRightMove {
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