// @ts-check
const [x, y] = [0, 1];

/**
 * @param {Number[][]} vector2Arr
 */
export function sum(vector2Arr) {
  let sum = [0, 0];
  for (const vector of vector2Arr) {
    sum[x] += vector[x];
    sum[y] += vector[y];
  }
  return sum;
}

/**
 * @param {Number[]} reference
 * @param {Number[]} target
 */
export function add(reference, target) {
  return [
    reference[x] + target[x],
    reference[y] + target[y]
  ]
}
/**
 * @param {Number[]} reference
 * @param {Number[]} target
 */
export function difference(reference, target) {
  return [
    target[x] - reference[x],
    target[y] - reference[y]
  ]
}

/**
 * @param {Number[]} vector2
 * @param {Number} scalar
 */
export function scalarMul(vector2, scalar) {
  return [vector2[x]*scalar, vector2[y]*scalar];
}

/**
 * @param {Number[]} dividend
 * @param {Number[]} divisor
 */
export function divfloor(dividend, divisor) {
  return [
    Math.floor(dividend[x] / divisor[x]),
    Math.floor(dividend[y] / divisor[y])
  ]
}

/**
 * @param {Number[]} dividend
 * @param {Number[]} divisor
 */
export function divmod(dividend, divisor) {
  const remainder = [
    dividend[x] % divisor[x],
    dividend[y] % divisor[y]
  ], quotient = [
    (dividend[x] - remainder[x]) / divisor[x],
    (dividend[y] - remainder[y]) / divisor[y]
  ]
  return [quotient, remainder];
}

/**
 * @param {Number[]} vector2
 */
export function hypotenuse(vector2) {
  return ( vector2[x]**2 + vector2[y]**2 )**0.5;
}

/**
 * @param {Number[]} existing
 * @param {Number[]} changed
 */
export function change(existing, changed) {
  [existing[x], existing[y]] = changed;
}