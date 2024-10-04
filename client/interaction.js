// @ts-check
import * as Location from '../functions/location.js';
import {Screen} from './screen.js';
import {Overlay, Connection, createGetRenderingDataByLocation} from './renderer.js';
import {getLocationsBySight} from '../functions/sight/get-locations-by-sight.js';
import {getNodeSetByPathfinding} from '../functions/pathfinding/get-pathtree-by-pathfinding.js';

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

      visibleSet = new Set(),
      이동가능Set = new Set(),
      overlayList = [
        new Overlay([0,0,255], 이동가능Set, 0.25),
        new Overlay([255,255,255], visibleSet, 0.5)
      ],

      list = [],
      connectionList = [
        new Connection('rgba(255,255,255)', 0.5, list)
      ],

      getRenderingDataByLocation = createGetRenderingDataByLocation(mapSize, mapPalette, mapData, overlayList),

      canvas = root.appendChild(document.createElement('canvas'));
    canvas.classList.add('layer');

    new ReSize(canvas);
    new CanvasMouseDown(canvas, mouseLocation, 지형선택, mapSize, mapData, visibleSet, 이동가능Set);
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
   * @param {Set<Number>} visibleSet
   * @param {Set<Number>} 이동가능Set
   */
  constructor(node, mouseLocation, 지형선택, mapSize, mapData, visibleSet, 이동가능Set) {
    addEventListener('mousedown', mousedown);

    /** @param {MouseEvent} e */
    function mousedown(e) {
      switch (e.button) {
        case 1: // 휠클릭
          break;

        case 0: // 좌클릭
          위치선택(mouseLocation);
          console.log(mouseLocation);
          break;

        case 2: // 우클릭
          visibleSet.clear();
          이동가능Set.clear();
          new CanvasMouseRightMove(node, mouseLocation, 지형선택, mapSize, mapData);
          break;
      }
    }

    /** @param {Number[]} location */
    function 위치선택(location) {
      visibleSet.clear();
      이동가능Set.clear();
      const 인덱스 = Location.getIndexByLocation(location, mapSize);
      if (인덱스 === undefined) return;
      const 시작높이 = mapData[인덱스];
      const 임시함수 = index => {
        const 상대위치 = Location.getRelativeLocationByLocations(location, Location.getLocationByIndex(index, mapSize)),
          거리 = Location.getDistanceByRelativeLocation(상대위치);
        return 거리 == 0? -1000 : (mapData[index]-시작높이) / 거리;
      }
      for (const val of getLocationsBySight(10, location, mapSize, 임시함수)) {
        if (val === undefined) continue;
        visibleSet.add(val);
      }

      // 이동가능Set
      for (const val of getNodeSetByPathfinding(node => mapData[node], node => Location.getIndexsByAround(node, mapSize), 10, 인덱스)) {
        이동가능Set.add(val);
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