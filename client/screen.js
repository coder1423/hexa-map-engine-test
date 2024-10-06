// @ts-check
import {Renderer} from './renderer.js';
import * as Vector2 from '../functions/vector2.js';
import {getLocationByVector} from '../functions/location.js';

/**
 * 캔버스 내부 기능. 화면위치, 격자크기
 */
export class Screen {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {Number[]} mouseLocation
   * @param {(location: number[]) => String | undefined} getRenderingDataByLocation
   * @param {import('./renderer.js').Connection[]} connectionList
   */
  constructor(canvas, mouseLocation, getRenderingDataByLocation, connectionList) {
    let 화면위치 = [0,0], 격자크기 = [10,10];

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    new Wheel(canvas, 화면위치, 격자크기);
    canvas.addEventListener('mousedown', mousedown);
    canvas.addEventListener('mousemove', mousemove);
    new Renderer(ctx, 화면위치, 격자크기, getRenderingDataByLocation, connectionList);



    /** @param {MouseEvent} e */
    function mousedown(e) {
      if (e.button == 1) {
        new MouseWheelMove(canvas, 화면위치, [e.offsetX, e.offsetY]);
      }
    }

    /** @param {MouseEvent} e */
    function mousemove(e) {
      Vector2.update(mouseLocation, getLocationByVector(Vector2.difference(화면위치, [e.offsetX, e.offsetY]), 격자크기));
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
    const mulWheel = 0.04, min = 5, max = 50, 격자비율 = [3**0.5/2, 1/2];
    let 격자배율 = 25;
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

class MouseWheelMove {
  /**
   * @param {HTMLElement} node
   * @param {Number[]} 화면위치
   * @param {Number[]} 클릭위치
   */
  constructor(node, 화면위치, 클릭위치) {
    const reference = Vector2.difference(화면위치, 클릭위치);
    node.addEventListener('mousemove', mousemove);
    addEventListener('mouseup', mouseup);

    /** @param {MouseEvent} e */
    function mousemove(e) {
      Vector2.update(화면위치, Vector2.difference(reference, [e.offsetX, e.offsetY]));
    }
    /** @param {MouseEvent} e */
    function mouseup(e) {
      if (e.button != 1) return;
      node.removeEventListener('mousemove', mousemove);
      removeEventListener('mousemove', mouseup);
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