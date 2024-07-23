// @ts-check
/**
 * vector2는 2차원 xy 화면상의 위치
 * location은 타일상의 xy 위치
 * index는 타일의 배열상의 실제위치
 */
import * as Vector2 from './vector2.js';
const [x, y] = [0, 1];

export class Screen {
  /**
   * @param {HTMLElement} rootNode
   * @param {(canvas: HTMLCanvasElement, 화면위치: Number[], 격자크기: Number[]) => () => void} renderer
   */
  constructor(rootNode, renderer) {
    const canvas = rootNode.appendChild(document.createElement('canvas'));
    canvas.classList.add('layer');

    let 화면위치 = [0,0], 격자크기 = [10,10];
    const draw = renderer(canvas, 화면위치, 격자크기);

    new ScreenReSize(canvas, draw);
    new ScreenWheel(canvas, 격자크기, 화면위치, draw);
    new Mousedown(canvas, 화면위치, draw);
  }
}

class ScreenWheel {
  /**
   * @param {HTMLElement} node
   * @param {Number[]} 격자크기
   * @param {Number[]} vector
   * @param {() => void} draw
   */
  constructor(node, 격자크기, vector, draw) {
    /** @param {Number} size */
    const clacTileSize = size => [size*3**0.5, size*1.5];
    let mulWheel = 0.03, 격자배율 = 10;

    /** @param {WheelEvent} e */
    function wheel(e) {
      격자배율 = limitedToRange(격자배율-e.deltaY*mulWheel, 5, 50);
      [격자크기[x], 격자크기[y]] = clacTileSize(격자배율);
      e.offsetX
      e.offsetY
      draw();
    }

    [격자크기[x], 격자크기[y]] = clacTileSize(격자배율);
    node.addEventListener('wheel', wheel);
  }
}

class ScreenReSize {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {() => void} draw
   */
  constructor(canvas, draw) {
    function resize() {
      canvas.width  = innerWidth;
      canvas.height = innerHeight;
      draw();
    }
    resize();
    addEventListener('resize', resize);
  }
}

class Mousedown {
  /**
   * @param {HTMLElement} node
   * @param {Number[]} 화면위치
   * @param {() => void} draw
   */
  constructor(node, 화면위치, draw) {
    /** @param {MouseEvent} e */
    function mousedown(e) {
      switch (e.button) {
        case 1: // 휠클릭
          new ScreenMouseWheelDown(node, 화면위치, [e.offsetX, e.offsetY], draw);
          break;
        case 0: // 좌클릭
          
          break;
        case 2: // 우클릭
          
          break;
      }
    }
    node.addEventListener('mousedown', mousedown);
  }
}

class ScreenMouseWheelDown {
  /**
   * @param {HTMLElement} node
   * @param {Number[]} 화면위치
   * @param {Number[]} 클릭위치
   * @param {() => void} draw
   */
  constructor(node, 화면위치, 클릭위치, draw) {
    const reference = 화면위치.slice();
    function mouseup() {
      node.removeEventListener('mousemove', mousemove);
    }
    /** @param {MouseEvent} e */
    function mousemove(e) {
      [화면위치[x], 화면위치[y]] = Vector2.sum([
        Vector2.difference(클릭위치, [e.offsetX, e.offsetY]),
        reference
      ])
      draw();
    }

    node.addEventListener('mousemove', mousemove);
    addEventListener('mouseup', mouseup, {once : true});
  }
}

function getLocationByVector() {
  
}

/**
 * @param {Number} val
 * @param {Number} min
 * @param {Number} max
 */
function limitedToRange(val, min, max) {
  return Math.min(Math.max(val, min), max);
}