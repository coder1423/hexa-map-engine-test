// @ts-check
import * as Location from '../functions/location.js';
import {Overlay, Connection} from '../screen/structure.js';
import {getLocationsBySight} from '../functions/sight/get-locations-by-sight.js';
import {getPathtreeAndNodesetByPathfinding} from '../functions/pathfinding/get-pathtree-and-nodeset-by-pathfinding.js';
import {getPathByPathtree} from '../functions/pathfinding/get-path-by-pathtree.js';



/**
 * @todo 선택 대상을 어떻게 상호작용의 다른 기능들과 공유할지 생각하기.
 * @todo 이곳 이름을 TargetSelection이 아니라 Selection으로 바꾸는게 어떨지 생각하기.
 */
export class TargetSelection {
  /**
   * @param {HTMLElement} node
   * @param {Number[]} mouseLocation
   * @param {Overlay[]} overlayList
   * @param {Connection[]} connectionList
   * @param {Number[]} mapSize
   * @param {Number[]} mapData
   */
  constructor(node, mouseLocation, overlayList, connectionList, mapSize, mapData) {
    const visibleSet = new Set();
    const 이동가능Set = new Set();
    const pathList = [];

    overlayList.push(...[
      new Overlay([0,0,255], 이동가능Set, 0.25),
      new Overlay([255,255,255], visibleSet, 0.5)
    ]);
    connectionList.push(...[
      new Connection('rgba(255,0,0,1)', 0.5, pathList)
    ]);

    let pathTree = [];

    /** @type {(node: Number) => Number} */
    const calcCost = node => mapData[node];
    /** @type {(node: Number) => Number[]} */
    const getAround = node => Location.getIndexsByAround(node, mapSize);

    node.addEventListener('mousedown', mousedown);
    node.addEventListener('mousemove', mousemove);



    /** @param {MouseEvent} e */
    function mousedown(e) {
      if (e.button == 0) {
        resetSelection();
        selection();
      }
      if (e.button == 2) {
        resetSelection();
      }
    }



    function selection() {
      const 시야거리 = 10, 이동력 = 10; // 임시 수치

      const index = Location.getIndexByLocation(mouseLocation, mapSize);
      if (index === undefined) return;

      const reference높이 = mapData[index];
      /** @type {(index: number) => number} */
      const get높이ByIndex = index => {
        const targetLocation = Location.getLocationByIndex(index, mapSize),
          relativeLocation = Location.getRelativeLocationByLocations(mouseLocation, targetLocation),
          distance = Location.getDistanceByRelativeLocation(relativeLocation);
        return distance == 0? -Infinity : (mapData[index]-reference높이) / distance;
      }
      for (const val of getLocationsBySight(시야거리, mouseLocation, mapSize, get높이ByIndex)) {
        if (val === undefined) continue;
        visibleSet.add(val);
      }

      // 이동가능Set
      const {tree, nodeSet} = getPathtreeAndNodesetByPathfinding(calcCost, getAround, 이동력, index);
      pathTree = tree;
      for (const val of nodeSet) {
        이동가능Set.add(val);
      }
    }



    function resetSelection() {
      visibleSet.clear();
      이동가능Set.clear();
      pathList.splice(0, pathList.length);
      pathTree = [];
    }



    function mousemove() {
      const index = Location.getIndexByLocation(mouseLocation, mapSize);
      if (index === undefined) return;
      pathList.splice(0, pathList.length);
      for (const val of [index, ...getPathByPathtree(pathTree, index)]) {
        pathList.push(Location.getLocationByIndex(val, mapSize));
      }
    }



  }
}