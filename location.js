// @ts-check
import * as Vector2 from './vector2.js';
const [x, y] = [0, 1];

/**
 * @param {Number[]} location
 * @param {Number[]} max
 */
export function locationToIndex(location, max) {
  if (0 <= location[x] && location[x] < max[x]) {
    return location[x] + max[x]*location[y];
  }
}
/**
 * @param {Number} index
 * @param {Number[]} max
 */
export function indexToLocation(index, max) {
  const locationX = index % max[y];
  return [locationX, (index-locationX) / max[y]];
}

/**
 * @param {Number[]} relative
 */
export function getDistanceByRelativeLocation(relative) {
  const [dx, dy] = relative.map(Math.abs);
  return dy + Math.max(dx - (dy >>> 1) + (dy & 1), 0); // dy 나누기 2의 반올림.
}
/**
 * @param {Number} distance
 */
export function getLocationsByDistance(distance) {

}

/**
 * @param {Number[]} reference
 * @param {Number[]} relative
 */
export function getLocationsByStraight(reference, relative) {

}

/**
 * @param {Number[]} reference
 * @param {Number[]} target
 */
export function getRelativeLocationByTwoLocations(reference, target) {
  const [dx, dy] = Vector2.difference(reference, target);
  return [
    dx + 정보정(dx, dy, reference[y]),
    dy
  ]
}
/**
 * @param {Number[]} reference
 * @param {Number[]} relative
 */
export function getLocationByRelativeLocation(reference, relative) {
  return [
    reference[x] + relative[x] + 역보정(relative, reference[y]),
    reference[y] + relative[y]
  ]
}

/**
 * @param {Number} dx
 * @param {Number} dy
 * @param {Number} referenceY
 */
function 정보정(dx, dy, referenceY) {
  return dx < 0?
    -(1 & dy & referenceY)
    : 1 & dy &(referenceY ^ 1)
}
/**
 * @param {Number[]} relative
 * @param {Number}   referenceY
 */
function 역보정(relative, referenceY) {
  return relative[x] > 0?
    -(1 & relative[y] &(referenceY ^ 1))
    : 1 & relative[y] & referenceY
}