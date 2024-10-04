// @ts-check
import {PriorityQueue} from '../priority-queue.js';

/**
 * @param {(node: Number) => Number} calcCost
 * @param {(node: Number) => Number[]} getAround
 * @param {Number} initialValue
 * @param {Number} initialNode
 */
export function getPathtreeAndNodesetByPathfinding(calcCost, getAround, initialValue, initialNode) {
  const nodeSet = new Set([initialNode]),
    /** @type {Number[]} */
    tree = [],
    /** @type {Number[]} */
    map  = [],
    heap = new PriorityQueue((a, b) => map[b] - map[a], [initialNode]);
  map[initialNode] = initialValue;

  for (const referenceNode of heap) {
    const referenceValue = map[referenceNode];

    for (const targetNode of getAround(referenceNode)) {
      const targetValue = referenceValue - calcCost(targetNode);
      
      if (0 <= targetValue && !nodeSet.has(targetNode)) {
        tree[targetNode] = referenceNode;
        map[targetNode] = targetValue;
        heap.push(targetNode);
        nodeSet.add(targetNode);
      }
    }
  }

  return {tree: tree, nodeSet: nodeSet};
}