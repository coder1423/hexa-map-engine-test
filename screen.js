// @ts-check
/**
 * vector2는 2차원 xy 화면상의 위치
 * location은 타일상의 xy 위치
 * index는 타일의 배열상의 실제위치
 * 
 * 외부에서 직접 접근이 불가능 하더라도 클로저 역할이면 class.
 * 내부 변수가 남지 않는 순수함수만 function.
 * 기능상의 큰 차이는 없지만, 역할을 명확히 구분하기 위해 사용?
 * 단, 커링은 예외 혹은 화살표=> 함수로 정의.
 */
import {Renderer} from './renderer.js';
import * as Vector2 from './vector2.js';
import {getLocationByVector} from './location.js';

export class Screen {
  /** @param {HTMLElement} root */
  constructor(root) {
    let 화면위치 = [0,0], 격자크기 = [10,10];

    const canvas = root.appendChild(document.createElement('canvas'));
    canvas.classList.add('layer');

    new Wheel(canvas, 화면위치, 격자크기);
    new MouseDown(canvas, 화면위치, 격자크기);
    new ReSize(canvas);
    new Renderer(canvas, 화면위치, 격자크기); // 렌더러의 출력 데이터도 여기를 통해서 연결하기?
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
   */
  constructor(node, 화면위치, 격자크기) {
    node.addEventListener('mousedown', mousedown);

    /** @param {MouseEvent} e */
    function mousedown(e) {
      switch (e.button) {
        case 1: // 휠클릭
          new ScreenMouseWheelDown(node, 화면위치, [e.offsetX, e.offsetY]);
          break;
        case 0: // 좌클릭
          console.log(getLocationByVector(Vector2.difference(화면위치, [e.offsetX, e.offsetY]), 격자크기))
          break;
        case 2: // 우클릭
          
          break;
      }
    }

  }
}
class ScreenMouseWheelDown {
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

/**
 * @param {Number} val
 * @param {Number} min
 * @param {Number} max
 */
function limitedToRange(val, min, max) {
  return Math.min(Math.max(val, min), max);
}