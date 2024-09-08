// @ts-check
import {Interaction} from './interaction.js';

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

/**
 * 서버통신, 데이터 테이블
 */
export class Client {
  /**
   * @param {HTMLElement} root
   * @param {Number[]} mapSize
   * @param {Number[]} mapData
   * @param {Number[][]} mapPalette
   */
  constructor(root, mapSize, mapData, mapPalette) {
    const 시야거리 = 10, 이동력 = 10;

    new Interaction(root, mapSize, mapData, mapPalette);
  }
}