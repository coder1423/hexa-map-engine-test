// @ts-check

/**
 * @todo 여기는 그냥 모델이 아닌 뷰 모델로?
 * 뷰에서 클릭 등을 하면 이곳에서 전략패턴으로 상태에 따라서 선택들 조합?
 * 그리고 서버나 처리 모델 사이의 통신과 길찾기/직선/거리 등의 location 관련 기능들도 여기서 중심적으로 접근?
 * 
 * Screen이 뷰모델을 일방적으로 참조해서,
 * 클릭을 뷰모델의 타일선택 트리거 호출과 연결하고,
 * 뷰모델에 데이터 업데이트 콜백을 넣어서 draw 렌더링 연결하는 것 고려.
 */

import * as Location from './location.js';

export class Model {
  /**
   * @param {Number[]} mapSize
   * @param {Number[]} mapData
   * @param {string[]} mapPalette 
   */
  constructor(mapSize, mapData, mapPalette) {
    let 지형선택 = 0;
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
    ])
    addEventListener('keydown', keydown);

    /**
     * @param {Number[]} location
     */
    this.getRenderingDataByLocation = location => {
      const index = Location.getIndexByLocation(location, mapSize);
      if (index !== undefined) {
        return mapPalette[mapData[index]];
      }
    }

    /**
     * @param {Number[]} location
     */
    this.triggerDataChangeByLocation = location => {
      const index = Location.getIndexByLocation(location, mapSize);
      if (index !== undefined) {
        mapData[index] = 지형선택;
      }
    }

    /** @param {KeyboardEvent} e */
    function keydown(e) {
      const num = 지형선택Map.get(e.code);
      if (num !== undefined) {
        지형선택 = num;
      }
    }

  }
}