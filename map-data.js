// @ts-check

export const size = [128, 128];
/** @type {Number[]} */
export const data = new Array(size[0] * size[1]).fill(1);

const [시작, 끝] = [[245, 245, 220], [58-20*2, 100-16*2, 75-16*2]],
  간격 = 시작.map( (val, i) => (val - 끝[i]) / 9 >>> 0 );

/** @type {Number[][]} */
export const palette = new Array(10)
  .fill(null)
  .map((_, i) => [시작[0]-간격[0]*i, 시작[1]-간격[1]*i, 시작[2]-간격[2]*i]);