// @ts-check
import * as Location from '../location.js';

/**
 * 참이면 보이는것, 거짓이면 가려진것
 * @param {Number[]} reference
 * @param {Number[]} target
 * @param {Number[]} max
 * @param {Number[]} 지형높이
 * @param {Number[]} 지형지도
 */
export function checkSightByLocations(reference, target, max, 지형높이, 지형지도) {
  const referenceIndex = Location.getIndexByLocation(reference, max);
  if (referenceIndex === undefined) return;

  const relativeLocation = Location.getRelativeLocationByLocations(reference, target),
    referenceDistance = Location.getDistanceByRelativeLocation(relativeLocation),
    reference높이 = 지형높이[지형지도[referenceIndex]];

  /** @type {(location: Number[], distance: Number) => Number | undefined} */
  const getSlopeByLocation = (location, distance) => {
    const index = Location.getIndexByLocation(location, max);
    if (index === undefined) return;
    return (지형높이[지형지도[index]] - reference높이) / distance;
  }

  const referenceSlope = getSlopeByLocation(target, referenceDistance);
  if (referenceSlope === undefined) return;

  /** @type {(location: Number[], distance: Number) => Boolean} 참이면 가려진것 */
  const isObstructingByLocation = (location, distance) => {
    const slope = getSlopeByLocation(location, distance);
    return slope === undefined? true : referenceSlope < slope;
  }

  return checkSight(reference, relativeLocation, isObstructingByLocation);
}



/**
 * @param {Number[]} reference
 * @param {Number[]} relativeLocation
 * @param {(location: Number[], distance: Number) => Boolean} isObstructingByLocation
 */
function checkSight(reference, [x, y], isObstructingByLocation) {
  return x == 0? 대각(
    reference, isObstructingByLocation, 대각Direction[y < 0? 4 : 5],
    Math.abs(y) >>> 1
  ) : y == 0? 직선(
    reference, isObstructingByLocation, 직선Direction[x < 0? 4 : 5],
    Math.abs(x)
  ) : 사분면(
    reference, isObstructingByLocation,
    get규격LocationByLocation([x, y]),
    getKeyByLocation([x, y])
  );
}

/**
 * @param {Number[]} reference
 * @param {(location: Number[], distance: Number) => Boolean} isObstructingByLocation
 * @param {Number[]} 규격Location
 * @param {Number} key
 */
function 사분면(reference, isObstructingByLocation, [x, y], key) {
  return x < y? 측면(
    reference, isObstructingByLocation, high측면Direction[key],
    Math.ceil((y - x) * 0.5),
    x
  ) : x == y? 직선(
    reference, isObstructingByLocation, 직선Direction[key],
    y
  ) : x < y*3? 측면(
    reference, isObstructingByLocation, medium측면Direction[key],
    Math.ceil((x - y) * 0.5),
    Math.ceil((y*3 - x) * 0.5)
  ) : x == y*3? 대각(
    reference, isObstructingByLocation, 대각Direction[key],
    y
  ) : 측면(
    reference, isObstructingByLocation, low측면Direction[key],
    y,
    Math.ceil((x - y*3) * 0.5)
  );
}



/**
 * @param {Number[]} location
 * @param {(location: Number[], distance: Number) => Boolean} isObstructingByLocation
 * @param {Number[]} direction
 * @param {Number} count
 */
function 직선(location, isObstructingByLocation, direction, count) {

  for (let distance = 1; distance <= count; distance++) {
    location = Location.getLocationByRelativeLocation(location, direction);
    if (isObstructingByLocation(location, distance)) return false;
  }

  return true;
}



/**
 * @param {Number[]} location
 * @param {(location: Number[], distance: Number) => Boolean} isObstructingByLocation
 * @param {Number[][]} directions
 * @param {Number} count
 */
function 대각(location, isObstructingByLocation, [direction, 좌측면, 우측면], count) {
  let 중심Location = location;

  for (let distance = 1; distance <= count; distance++) {
    중심Location = Location.getLocationByRelativeLocation(중심Location, direction);
    if (isObstructingByLocation(location, distance)) return false;
  }

  return [좌측면, 우측면].some(
    측면 => 대각직선(Location.getLocationByRelativeLocation(location, 측면), isObstructingByLocation, direction, count)
  );
}

/**
 * @param {Number[]} location
 * @param {(location: Number[], distance: Number) => Boolean} isObstructingByLocation
 * @param {Number[]} direction
 * @param {Number} count
 */
function 대각직선(location, isObstructingByLocation, direction, count) {

  for (let distance = 1; distance <= count; distance++) {
    if (isObstructingByLocation(location, (distance << 1)+1)) return false;
    location = Location.getLocationByRelativeLocation(location, direction);
  }

  return true;
}



/**
 * @param {Number[]} location
 * @param {(location: Number[], distance: Number) => Boolean} isObstructingByLocation
 * @param {Number[][]} directions
 * @param {Number} 직선횟수
 * @param {Number} 측면횟수
 */
function 측면(location, isObstructingByLocation, [직선Direction, 측면Direction], 직선횟수, 측면횟수) {

  for (let 직선distance = 0; 직선distance <= 직선횟수; 직선횟수++) {
    let 측면Location = location;

    for (let 측면Distance = 0; 측면Distance <= 측면횟수; 측면Distance++) {
      const distance = (직선distance << 1) + 측면Distance;
      if (distance == 0) continue;
      if (isObstructingByLocation(측면Location, distance)) return false;
      
      측면Location = Location.getLocationByRelativeLocation(측면Location, 측면Direction);
    }

    location =  Location.getLocationByRelativeLocation(location, 직선Direction);
  }

  return true;
}



/** @param {Number[]} location */
function get규격LocationByLocation([x, y]) {
  return [
    (Math.abs(x) << 1) - (y & 1),
    Math.abs(y)
  ]
}
/** @param {Number[]} location */
function getKeyByLocation([x, y]) {
  return (x < 0? 0 : 1) + (y < 0? 0 : 2);
}

const 직선Direction = [
  [-1,-1], [ 1,-1],
  [-1, 1], [ 1, 1],
  [-1, 0], [ 1, 0]
], 대각Direction = [
  [[-2,-1], [-1, 0], [-1,-1]],
  [[ 2,-1], [ 1,-1], [ 1, 0]],
  [[-2, 1], [-1, 1], [-1, 0]],
  [[ 2, 1], [ 1, 0], [ 1, 1]],
  [[ 0,-2], [-1,-1], [ 1,-1]],
  [[ 0, 2], [ 1, 1], [-1, 1]]
], high측면Direction = [
  [[0, 2], [-1,-1]],
  [[0, 2], [ 1,-1]],
  [[0,-2], [-1, 1]],
  [[0,-2], [ 1, 1]]
], medium측면Direction = [
  [[-2,-1], [-1,-1]],
  [[ 2,-1], [ 1,-1]],
  [[-2, 1], [-1, 1]],
  [[ 2, 1], [ 1, 1]]
], low측면Direction = [
  [[-2,-1], [-1, 0]],
  [[ 2,-1], [ 1, 0]],
  [[-2, 1], [-1, 0]],
  [[ 2, 1], [ 1, 0]]
]