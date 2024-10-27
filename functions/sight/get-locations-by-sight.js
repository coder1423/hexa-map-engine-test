// @ts-check
import * as Location from '../location.js';

/**
 * for of 중심축들
 *   for 직선
 * for of 대각축들
 *  for 대각
 *    for of 좌우축
 *      for 직선
 */

/**
 * @param {Number} maxDistance
 * @param {Number[]} start
 * @param {Number[]} max
 * @param {(index: Number) => Number} get높이ByIndex
 */
export function getLocationsBySight(maxDistance, start, max, get높이ByIndex) {
  const startIndex = Location.getIndexByLocation(start, max);
  const visibleSet = new Set([startIndex]);
  const obscured지도 = [];

  if (startIndex === undefined) return visibleSet;
  const start높이 = get높이ByIndex(startIndex);
  obscured지도[startIndex] = start높이;

  for (const direction of 직선Directions) // 중심축들
  for (let previous = start, previousIndex = startIndex, count = maxDistance; count--;) {
    const target = Location.getLocationByRelativeLocation(previous, direction),
      targetIndex = Location.getIndexByLocation(target, max);
    if (targetIndex === undefined) break;
  
    // 추가
    const obscured = obscured지도[previousIndex];
    const 높이 = get높이ByIndex(targetIndex);
    if (obscured <= 높이) visibleSet.add(targetIndex);
    obscured지도[targetIndex] = Math.max(높이, obscured);

    previous = target;
    previousIndex = targetIndex;
  }

  for (const {referenceDirection, 직선Directions} of reference직선Directions) // 대각축들
  for (let previousReference = start, count = maxDistance; 0 <= (count -= 2);) {
    const currentReference = Location.getLocationByRelativeLocation(previousReference, referenceDirection),
      referenceIndex = Location.getIndexByLocation(currentReference, max);
    if (referenceIndex === undefined) break;

    /** @type {Number | undefined} */
    let obscured;
    for (const direction of 직선Directions) {
      const index = Location.getIndexByLocation(Location.getLocationByRelativeLocation(previousReference, direction), max);
      if (index === undefined || obscured !== undefined && obscured < obscured지도[index]) continue;
      obscured = obscured지도[index];
    }
    if (obscured === undefined) break;

    // 추가
    const 높이 = get높이ByIndex(referenceIndex);
    if (obscured <= 높이) visibleSet.add(referenceIndex);
    obscured지도[referenceIndex] = Math.max(높이, obscured);

    for (const direction of 직선Directions) // 좌우축
    for (let previousComparison = previousReference, previousIndex = referenceIndex, count2 = count; count2--;) {
      const comparison = Location.getLocationByRelativeLocation(previousComparison, direction),
        target = Location.getLocationByRelativeLocation(comparison, referenceDirection),
        comparisonIndex = Location.getIndexByLocation(comparison, max),
        targetIndex = Location.getIndexByLocation(target, max);
      if (targetIndex === undefined || comparisonIndex === undefined) break;

      // 추가
      const obscured = Math.max(obscured지도[previousIndex], obscured지도[comparisonIndex]);
      const 높이 = get높이ByIndex(targetIndex);
      if (obscured <= 높이) visibleSet.add(targetIndex);
      obscured지도[targetIndex] = Math.max(높이, obscured);

      previousComparison = comparison;
      previousIndex = targetIndex;
    }

    previousReference = currentReference;
  }

  return visibleSet;
}

const 직선Directions = [
  [ 1,1],[ 1,0],[ 1,-1],
  [-1,1],[-1,0],[-1,-1]
],
reference직선Directions = [
  {referenceDirection: [ 0, 2], 직선Directions: [[-1, 1],[ 1, 1]]},
  {referenceDirection: [ 2, 1], 직선Directions: [[ 1, 1],[ 1, 0]]},
  {referenceDirection: [ 2,-1], 직선Directions: [[ 1, 0],[ 1,-1]]},

  {referenceDirection: [ 0,-2], 직선Directions: [[ 1,-1],[-1,-1]]},
  {referenceDirection: [-2,-1], 직선Directions: [[-1,-1],[-1, 0]]},
  {referenceDirection: [-2, 1], 직선Directions: [[-1, 0],[-1, 1]]},
];