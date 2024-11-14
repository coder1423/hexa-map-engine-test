// @ts-check
import {Model} from '../structure/model.js'

/** @todo 이곳은 추후에 웹소켓 통신으로 재편성 할 것 */



const [시작, 끝] = [[245, 245, 220], [58-20*2, 100-16*2, 75-16*2]],
  간격 = 시작.map( (val, i) => (val - 끝[i]) / 9 >>> 0 );

const size = [128, 128];
/** @type {Number[]} */
const data = new Array(size[0] * size[1]).fill(1);
/** @type {Number[][]} */
const palette = new Array(10)
  .fill(null)
  .map((_, i) => [시작[0]-간격[0]*i, 시작[1]-간격[1]*i, 시작[2]-간격[2]*i]);

export const model = new Model(size, data, palette);