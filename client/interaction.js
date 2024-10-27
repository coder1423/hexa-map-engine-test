// @ts-check
import * as Location from '../functions/location.js';
import {TargetSelection} from './target-selection.js';



/**
 * 명령(서버에 요청할) 생성, 플레이어 선택, 키보드, 트리거, 길찾기와 자동명령(장거리 이동 등) 등 클라이언트 편의성 기능.
 * 그리고 상호작용할 html 생성도 여기서.
 */
export class Interaction {
  /**
   * @param {HTMLElement} root
   * @param {HTMLCanvasElement} screen
   * @param {number[]} mouseLocation
   * @param {import('../screen/structure.js').Overlay[]} overlayList
   * @param {import('../screen/structure.js').Connection[]} connectionList
   * @param {Number[]} mapSize
   * @param {Number[]} mapData
   */
  constructor(root, screen, mouseLocation, overlayList, connectionList, mapSize, mapData) {
    let 지형선택 = [0];

    root.appendChild(screen);
    screen.classList.add('layer');

    resize();
    addEventListener('resize', resize);
    screen.addEventListener('mousedown', canvasMousedown);
    new TargetSelection(screen, mouseLocation, overlayList, connectionList, mapSize, mapData);
    new KeyDown(지형선택);
    oncontextmenu = e => e.preventDefault();



    /** @param {MouseEvent} e */
    function canvasMousedown(e) {
      if (e.button == 2) {
        new UpdateMapData(screen, mouseLocation, 지형선택, mapSize, mapData);
      }
    }



    function resize() {
      screen.width  = innerWidth;
      screen.height = innerHeight;
    }



  }
}



class UpdateMapData {
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