// @ts-check
import * as Location from '../functions/location.js';
import {Screen} from './screen.js';
import {Overlay, Connection, createGetRenderingDataByLocation} from './renderer.js';
import {getLocationsBySight} from '../functions/sight/get-locations-by-sight.js';
import {getPathtreeAndNodesetByPathfinding} from '../functions/pathfinding/get-pathtree-and-nodeset-by-pathfinding.js';
import {getPathByPathtree} from '../functions/pathfinding/get-path-by-pathtree.js';

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

      visibleSet = new Set(),
      이동가능Set = new Set(),
      overlayList = [
        new Overlay([0,0,255], 이동가능Set, 0.25),
        new Overlay([255,255,255], visibleSet, 0.5)
      ],

      경로list = [],
      connectionList = [
        new Connection('rgba(255,0,0,1)', 0.5, 경로list)
      ],

      getRenderingDataByLocation = createGetRenderingDataByLocation(mapSize, mapPalette, mapData, overlayList),

      canvas = root.appendChild(document.createElement('canvas'));
    canvas.classList.add('layer');

    new ReSize(canvas);
    new CanvasMouseDown(canvas, mouseLocation, 지형선택, mapSize, mapData, visibleSet, 이동가능Set, 경로list);
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
   * @param {Number[][]} 경로list
   */
  constructor(node, mouseLocation, 지형선택, mapSize, mapData, visibleSet, 이동가능Set, 경로list) {
    const 시야거리 = 10, 이동력 = 10;
    node.addEventListener('mousedown', mousedown);

    /** @param {MouseEvent} e */
    function mousedown(e) {
      switch (e.button) {
        case 1: // 휠클릭
          break;

        case 0: // 좌클릭
          new 위치선택(node, mouseLocation, visibleSet, 이동가능Set, 경로list, mapSize, mapData, 시야거리, 이동력);
          // console.log(mouseLocation);
          break;

        case 2: // 우클릭
          visibleSet.clear();
          이동가능Set.clear();
          경로list.splice(0, 경로list.length);
          new CanvasMouseRightMove(node, mouseLocation, 지형선택, mapSize, mapData);
          break;
      }
    }

  }
}

class 위치선택 {
  /**
   * @param {HTMLElement} node
   * @param {Number[]} mouseLocation
   * @param {Set<Number>} visibleSet
   * @param {Set<Number>} 이동가능Set
   * @param {Number[][]} 경로list
   * @param {Number[]} mapSize
   * @param {Number[]} mapData
   * @param {Number} 시야거리
   * @param {Number} 이동력
   */
  constructor(node, mouseLocation, visibleSet, 이동가능Set, 경로list, mapSize, mapData, 시야거리, 이동력) {
    visibleSet.clear();
    이동가능Set.clear();
    경로list.splice(0, 경로list.length);
    const 인덱스 = Location.getIndexByLocation(mouseLocation, mapSize);
    if (인덱스 === undefined) return;
    const 시작높이 = mapData[인덱스];
    const 임시함수 = index => {
      const 상대위치 = Location.getRelativeLocationByLocations(mouseLocation, Location.getLocationByIndex(index, mapSize)),
        거리 = Location.getDistanceByRelativeLocation(상대위치);
      return 거리 == 0? -1000 : (mapData[index]-시작높이) / 거리;
    }
    for (const val of getLocationsBySight(시야거리, mouseLocation, mapSize, 임시함수)) {
      if (val === undefined) continue;
      visibleSet.add(val);
    }

    // 이동가능Set
    const calcCost = node => mapData[node],
      getAround = node => Location.getIndexsByAround(node, mapSize),
      {tree, nodeSet} = getPathtreeAndNodesetByPathfinding(calcCost, getAround, 이동력, 인덱스);
    for (const val of nodeSet) {
      이동가능Set.add(val);
    }

    node.addEventListener('mousemove', mousemove);
    addEventListener('mouseup', mouseup);

    function mousemove() {
      const index = Location.getIndexByLocation(mouseLocation, mapSize);
      if (index === undefined) return;
      경로list.splice(0, 경로list.length);
      for (const val of [index, ...getPathByPathtree(tree, index)]) {
        경로list.push(Location.getLocationByIndex(val, mapSize));
      }
    }
    /** @param {MouseEvent} e */
    function mouseup(e) {
      if (e.button != 0) return;
      node.removeEventListener('mousemove', mousemove);
      removeEventListener('mousemove', mouseup);
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