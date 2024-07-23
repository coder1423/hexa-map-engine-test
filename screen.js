// @ts-check
/**
 * vector2는 2차원 xy 화면상의 위치
 * location은 타일상의 xy 위치
 * index는 타일의 배열상의 실제위치
 * 
 * 외부에서 직접 접근이 불가능 하더라도 클로저 역할이면 class.
 * 내부 변수가 남지 않는 순수함수만 function.
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
    new ScreenWheel(canvas, 화면위치, 격자크기, draw);
    new Mousedown(canvas, 화면위치, draw);
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

class ScreenWheel {
  /**
   * @param {HTMLElement} node
   * @param {Number[]} 화면위치
   * @param {Number[]} 격자크기
   * @param {() => void} draw
   */
  constructor(node, 화면위치, 격자크기, draw) {
    /** @param {Number} size */
    const clacTileSize = size => [size*3**0.5, size*1.5];
    let mulWheel = 0.03, 격자배율 = 10, min = 5, max = 50;

    /** @param {WheelEvent} e */
    function wheel(e) {
      const 기존격자배율 = 격자배율;
      격자배율 = limitedToRange(격자배율-e.deltaY*mulWheel, min, max);
      [격자크기[x], 격자크기[y]] = clacTileSize(격자배율);
      
      const 기존위치차 = Vector2.difference(화면위치, [e.offsetX, e.offsetY]);
      [화면위치[x], 화면위치[y]] = Vector2.sum([
        Vector2.scalarMul(기존위치차, -격자배율/기존격자배율),
        기존위치차,
        화면위치
      ])

      draw();
    }

    [격자크기[x], 격자크기[y]] = clacTileSize(격자배율);
    node.addEventListener('wheel', wheel);
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
    const reference = Vector2.difference(화면위치, 클릭위치);

    /** @param {MouseEvent} e */
    function mousemove(e) {
      [화면위치[x], 화면위치[y]] = Vector2.difference(reference, [e.offsetX, e.offsetY]);
      draw();
    }
    function mouseup() {
      node.removeEventListener('mousemove', mousemove);
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