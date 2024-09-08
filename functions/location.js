// @ts-check
import * as Vector2 from './vector2.js';
const [x, y] = [0, 1];

/**
 * @param {Number[]} vector
 * @param {Number[]} divisor
 */
export function getLocationByVector(vector, divisor) {
  const location = Vector2.divfloor(
    [vector [x], vector[y] - divisor[y] / 2],
    [divisor[x], divisor[y] * 3]
  )
  return [ (location[x] - (location[y]&1))>>1, location[y] ];
}

/**
 * @param {Number[]} location
 * @param {Number[]} max
 */
export function isValidLocation(location, max) {
  return (
    0 <= location[x] && location[x] < max[x] &&
    0 <= location[y] && location[y] < max[y]
  )
}

/**
 * @param {Number[]} location
 * @param {Number[]} max
 */
export function getIndexByLocation(location, max) {
  if (
    0 <= location[x] && location[x] < max[x] &&
    0 <= location[y] && location[y] < max[y]
  ) {
    return location[x] + max[x]*location[y];
  }
}
/**
 * @param {Number} index
 * @param {Number[]} max
 */
export function getLocationByIndex(index, max) {
  const locationX = index % max[y];
  return [locationX, (index-locationX) / max[y]];
}
/**
 * @param {Number[][]} locations
 * @param {Number[]} max
 */
export function getIndexsByLocations(locations, max) {
  const indexs = [];
  for (const location of locations) {
    const index = getIndexByLocation(location, max);
    if (index !== undefined) indexs.push(index);
  }
  return indexs;
}

/**
 * @param {Number[]} relative
 */
export function getDistanceByRelativeLocation(relative) {
  const [dx, dy] = relative.map(Math.abs);
  return dy + Math.max(dx - (dy >>> 1) + (dy & 1), 0); // dy 나누기 2의 반올림.
}
/**
 * @param {Number[]} location
 * @param {Number} distance
 */
export function getLocationsByDistance(location, distance) {
  const locations = [];
  for (let dx = distance+1; --dx;) {
    locations.push(shiftX(location, dx));
    locations.push(shiftX(location, -dx));
  }
  for (const direction of straightDirections) {
    let reference = shiftX(location, -distance);
    for (let yCounter = distance+1; --yCounter;) {
      reference = getLocationByRelativeLocation(reference, direction);
      for (let dx = distance + yCounter; dx--;) {
        locations.push(shiftX(reference, dx));
      }
    }
  }
  return locations;
}

const straightDirections = [[1,-1], [1,1]];
/**
 * @param {Number[]} location
 * @param {Number} dx
 */
function shiftX([px, py], dx) {
  return [px + dx, py];
}

/**
 * @param {Number} index
 * @param {Number[]} max
 */
export function getIndexsByAround(index, max) {
  const indexs = [], location = getLocationByIndex(index, max);
  for (const direction of directions) {
    const target = getIndexByLocation(getLocationByRelativeLocation(location, direction), max);
    if (target !== undefined) indexs.push(target);
  }
  return indexs;
}
const directions = [
  [ 1,1],[ 1,0],[ 1,-1],
  [-1,1],[-1,0],[-1,-1]
]

// /**
//  * @param {Number} index
//  * @param {Number[]} max
//  */
// export function getIndexsByAround(index, max) {
//   const indexs = [];
//   for (const location of getLocationsByDistance(getLocationByIndex(index, max), 1)) {
//     const target = getIndexByLocation(location, max);
//     if (target !== undefined) indexs.push(target);
//   }
//   return indexs;
// }

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