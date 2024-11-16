// @ts-check
import * as Vector2 from '../functions/vector2.js';
import {getLocationByVector} from '../functions/location.js';



export class Screen {
  constructor() {
    const mouseLocation = [0, 0];
    const canvas = document.createElement('canvas');
    const 화면위치 = [0,0];
    const 격자크기 = [10,10];

    this.mouseLocation = mouseLocation;
    this.canvas = canvas;
    this.화면위치 = 화면위치;
    this.격자크기 = 격자크기;

    Wheel(canvas, 화면위치, 격자크기);
    canvas.addEventListener('mousedown', mousedown);
    canvas.addEventListener('mousemove', mousemove);



    /** @param {MouseEvent} e */
    function mousedown(e) {
      if (e.button == 1) {
        MouseWheelMove(canvas, 화면위치, [e.offsetX, e.offsetY]);
      }
    }



    /** @param {MouseEvent} e */
    function mousemove(e) {
      Vector2.change(mouseLocation, getLocationByVector(Vector2.difference(화면위치, [e.offsetX, e.offsetY]), 격자크기));
    }



  }
}



/**
 * @param {HTMLElement} node
 * @param {Number[]} 화면위치
 * @param {Number[]} 격자크기
 */
function Wheel(node, 화면위치, 격자크기) {
  const mulWheel = 0.04, min = 5, max = 50, 격자비율 = [3**0.5/2, 1/2];
  let 격자배율 = 25;
  changeTileSize(격자배율);
  node.addEventListener('wheel', wheel);



  /** @param {Number} size */
  function changeTileSize(size) {
    Vector2.change(격자크기, Vector2.scalarMul(격자비율, size));
  }



  /** @param {WheelEvent} e */
  function wheel(e) {
    const 기존격자배율 = 격자배율;
    격자배율 = limitedToRange(격자배율-e.deltaY*mulWheel, min, max);
    changeTileSize(격자배율);

    Vector2.change(화면위치, Vector2.add(
      Vector2.scalarMul([e.offsetX, e.offsetY], 1-격자배율/기존격자배율),
      Vector2.scalarMul(화면위치, 격자배율/기존격자배율)
    ))
  }

}



/**
 * @param {HTMLElement} node
 * @param {Number[]} 화면위치
 * @param {Number[]} 클릭위치
 */
function MouseWheelMove(node, 화면위치, 클릭위치) {
  const reference = Vector2.difference(화면위치, 클릭위치);
  node.addEventListener('mousemove', mousemove);
  addEventListener('mouseup', mouseup);



  /** @param {MouseEvent} e */
  function mousemove(e) {
    Vector2.change(화면위치, Vector2.difference(reference, [e.offsetX, e.offsetY]));
  }



  /** @param {MouseEvent} e */
  function mouseup(e) {
    if (e.button != 1) return;
    node.removeEventListener('mousemove', mousemove);
    removeEventListener('mousemove', mouseup);
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