// @ts-check
import * as Location from './location.js';

/**
 * @param {Number} n
 * @param {Number[]} 시작
 * @param {Number[]} max
 * @param {(index: Number) => Number} get높이by인덱스
 */
export function getLocationsBySight(n, 시작, max, get높이by인덱스) {
  const 시작인덱스 = Location.getIndexByLocation(시작, max);
  if (시작인덱스 === undefined) return;
  const 보임집합 = new Set([시작인덱스]),
    가려짐지도 = [],
    시작높이 = get높이by인덱스(시작인덱스);
  가려짐지도[시작인덱스] = 시작높이;

  for (const 방향 of 직선방향들)
  for (let 기존인덱스 = 시작인덱스, i = n; i--;) {
    const 대상 = Location.getLocationByRelativeLocation(Location.getLocationByIndex(기존인덱스, max), 방향),
      대상인덱스 = Location.getIndexByLocation(대상, max);

    if (대상인덱스 === undefined) break;
    const 높이 = get높이by인덱스(대상인덱스), 가려짐 = 가려짐지도[기존인덱스];
    if (가려짐 <= 시작높이) {
      보임집합.add(대상인덱스);
    }
    가려짐지도[대상인덱스] = Math.max(높이, 가려짐);

    기존인덱스 = 대상인덱스;
  }

  for (const {기준방향, 직선방향들} of 기준직선방향들)
  for (let 이전기준 = 시작, i = n-2; 0 <= i; i -= 2) {
    const 지금기준 = Location.getLocationByRelativeLocation(이전기준, 기준방향),
      기준인덱스 = Location.getIndexByLocation(지금기준, max);

    /** @type {Number | undefined} */
    let 가려짐;
    for (const 방향 of 직선방향들) {
      const index = Location.getIndexByLocation(Location.getLocationByRelativeLocation(이전기준, 방향), max);
      if (index === undefined || 가려짐 !== undefined && 가려짐 < 가려짐지도[index]) break;
      가려짐 = 가려짐지도[index];
    }

    if (가려짐 === undefined || 기준인덱스 === undefined) break;
    const 높이 = get높이by인덱스(기준인덱스);
    if (가려짐 <= 시작높이) {
      보임집합.add(기준인덱스);
    }
    가려짐지도[기준인덱스] = Math.max(높이, 가려짐);

    for (const 방향 of 직선방향들)
    for (let 이전 = 지금기준, 기존인덱스 = 기준인덱스, 이전비교 = 이전기준, j = i; j--;) {
      const 대상 = Location.getLocationByRelativeLocation(이전, 방향),
        비교 = Location.getLocationByRelativeLocation(이전비교, 방향),
        대상인덱스 = Location.getIndexByLocation(대상, max),
        비교인덱스 = Location.getIndexByLocation(비교, max);

      if (대상인덱스 === undefined || 비교인덱스 === undefined) break;
      const 높이 = get높이by인덱스(대상인덱스), 가려짐 = Math.max(가려짐지도[기존인덱스], 가려짐지도[비교인덱스]);
      if (가려짐 <= 시작높이) {
        보임집합.add(대상인덱스);
      }
      가려짐지도[대상인덱스] = Math.max(높이, 가려짐);

      이전 = 대상;
      기존인덱스 = 대상인덱스;
      이전비교 = 비교;
    }

    이전기준 = 지금기준;
  }
}

const 직선방향들 = [
  [0,0],[0,0],[0,0],
  [0,0],[0,0],[0,0]
],
기준직선방향들 = [
  {기준방향: [0,0], 직선방향들: [[0,0],[0,0]]},
  {기준방향: [0,0], 직선방향들: [[0,0],[0,0]]},
  {기준방향: [0,0], 직선방향들: [[0,0],[0,0]]},

  {기준방향: [0,0], 직선방향들: [[0,0],[0,0]]},
  {기준방향: [0,0], 직선방향들: [[0,0],[0,0]]},
  {기준방향: [0,0], 직선방향들: [[0,0],[0,0]]},
];