// @ts-check
import {Renderer} from './renderer.js';
import * as Vector2 from '../functions/vector2.js';
import {getLocationByVector} from '../functions/location.js';

/**
 * 화면위치, 격자크기, html캔버스
 */
export class Screen {
  /**
   * @param {HTMLElement} root
   * @param {(location: number[]) => Number[] | undefined} getRenderingDataByLocation
   * @param {(location: number[]) => void} triggerDataChangeByLocation
   */
  constructor(root, getRenderingDataByLocation, triggerDataChangeByLocation) {
    let 화면위치 = [0,0], 격자크기 = [10,10];

    const canvas = root.appendChild(document.createElement('canvas'));
    canvas.classList.add('layer');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    new Wheel(canvas, 화면위치, 격자크기);
    new MouseDown(canvas, 화면위치, 격자크기, triggerDataChangeByLocation);
    new ReSize(canvas);
    new Renderer(ctx, 화면위치, 격자크기, getRenderingDataByLocation); // 렌더러의 출력 데이터도 여기를 통해서 연결하기?
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

class Wheel {
  /**
   * @param {HTMLElement} node
   * @param {Number[]} 화면위치
   * @param {Number[]} 격자크기
   */
  constructor(node, 화면위치, 격자크기) {
    const mulWheel = 0.03, min = 5, max = 50, 격자비율 = [3**0.5/2, 1/2];
    let 격자배율 = 15;
    updateTileSize(격자배율);
    node.addEventListener('wheel', wheel);

    /** @param {Number} size */
    function updateTileSize(size) {
      Vector2.update(격자크기, Vector2.scalarMul(격자비율, size));
    }

    /** @param {WheelEvent} e */
    function wheel(e) {
      const 기존격자배율 = 격자배율;
      격자배율 = limitedToRange(격자배율-e.deltaY*mulWheel, min, max);
      updateTileSize(격자배율);

      Vector2.update(화면위치, Vector2.add(
        Vector2.scalarMul([e.offsetX, e.offsetY], 1-격자배율/기존격자배율),
        Vector2.scalarMul(화면위치, 격자배율/기존격자배율)
      ))
    }

  }
}

class MouseDown {
  /**
   * @param {HTMLElement} node
   * @param {Number[]} 화면위치
   * @param {Number[]} 격자크기
   * @param {(location: number[]) => void} triggerDataChangeByLocation
   */
  constructor(node, 화면위치, 격자크기, triggerDataChangeByLocation) {
    /** @param {Number[]} 마우스위치 */
    const getLocationByOffsetVector = 마우스위치 => getLocationByVector(Vector2.difference(화면위치, 마우스위치), 격자크기);
    node.addEventListener('mousedown', mousedown);

    /** @param {MouseEvent} e */
    function mousedown(e) {
      switch (e.button) {
        case 1: // 휠클릭
          new MouseWheelMove(node, 화면위치, [e.offsetX, e.offsetY]);
          break;
        case 0: // 좌클릭
          console.log(getLocationByOffsetVector([e.offsetX, e.offsetY]));
          break;
        case 2: // 우클릭
          new MouseRightMove(node, getLocationByOffsetVector, triggerDataChangeByLocation);
          break;
      }
    }

  }
}

class MouseWheelMove {
  /**
   * @param {HTMLElement} node
   * @param {Number[]} 화면위치
   * @param {Number[]} 클릭위치
   */
  constructor(node, 화면위치, 클릭위치) {
    const reference = Vector2.difference(화면위치, 클릭위치);
    node.addEventListener('mousemove', mousemove);
    addEventListener('mouseup', mouseup, {once : true});

    /** @param {MouseEvent} e */
    function mousemove(e) {
      Vector2.update(화면위치, Vector2.difference(reference, [e.offsetX, e.offsetY]));
    }
    function mouseup() {
      node.removeEventListener('mousemove', mousemove);
    }

  }
}

class MouseRightMove {
  /**
   * @param {HTMLElement} node
   * @param {(마우스위치: number[]) => number[]} getLocationByOffsetVector
   * @param {(location: number[]) => void} triggerDataChangeByLocation
   */
  constructor(node, getLocationByOffsetVector, triggerDataChangeByLocation) {
    node.addEventListener('mousemove', mousemove);
    addEventListener('mouseup', mouseup, {once : true});

    /** @param {MouseEvent} e */
    function mousemove(e) {
      triggerDataChangeByLocation(getLocationByOffsetVector([e.offsetX, e.offsetY]));
    }
    function mouseup() {
      node.removeEventListener('mousemove', mousemove);
    }

  }
}

/**
 * @param {Number} val
 * @param {Number} min
 * @param {Number} max
 */
function limitedToRange(val, min, max) {
  return Math.min(Math.max(val, min), max);
}