// @ts-check

/**
 * @param {Number[]} pathtree
 * @param {Number} target
 */
export function getPathByPathtree(pathtree, target) {
  const path = [];
  for (let index = target; pathtree[index] !== undefined; index = pathtree[index]) {
    path.push(pathtree[index]);
  }
  return path;
}