// @ts-check
import * as Location from '../functions/location.js';
const value = 0;



export class Interaction {
  /**
   * @param {HTMLElement} root
   * @param {import('../modules/screen.js').Screen} screen
   * @param {import('../structure/model.js').Model} model
   */
  constructor(root, screen, model) {
    const {canvas, mouseLocation} = screen;
    const {size, data} = model;

    let 지형선택 = [0];

    root.appendChild(canvas);
    canvas.classList.add('layer');

    resize();
    addEventListener('resize', resize);
    canvas.addEventListener('mousedown', canvasMousedown);
    KeyDown(지형선택);
    oncontextmenu = e => e.preventDefault();



    /** @param {MouseEvent} e */
    function canvasMousedown(e) {
      if (e.button == 2) {
        UpdateMapData(canvas, mouseLocation, 지형선택, size, data);
      }
    }



    function resize() {
      canvas.width  = innerWidth;
      canvas.height = innerHeight;
    }



  }
}



/**
 * @param {HTMLElement} node
 * @param {Number[]} mouseLocation
 * @param {Number[]} 지형선택
 * @param {Number[]} mapSize
 * @param {Number[]} mapData
 */
function UpdateMapData(node, mouseLocation, 지형선택, mapSize, mapData) {
  node.addEventListener('mousemove', mousemove);
  addEventListener('mouseup', mouseup);



  function mousemove() {
    const index = Location.getIndexByLocation(mouseLocation, mapSize);
    if (index !== undefined) {
      mapData[index] = 지형선택[value];
    }
  }



  /** @param {MouseEvent} e */
  function mouseup(e) {
    if (e.button != 2) return;
    node.removeEventListener('mousemove', mousemove);
    removeEventListener('mousemove', mouseup);
  }

}



/**
 * @param {Number[]} 지형선택
 */
function KeyDown(지형선택) {
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
      지형선택[value] = num;
    }
  }

}