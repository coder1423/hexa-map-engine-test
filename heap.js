// @ts-check

export class Heap {
  /**
   * @param {(a: Number, b: Number) => Number} compareFn
   * @param {Number[]} values
   */
  constructor(compareFn = (a,b)=>b-a, values = []) {
    /** @type {Number[]} */
    values.sort(compareFn);

    /** @param {Number} value */
    this.push = value => {
      values.push(value);
      values.sort(compareFn);
    }
    this.pop = values.pop;

    this[Symbol.iterator] = function*() {
      for (
        let elem = values.pop();
        elem !== undefined;
        elem = values.pop()
      ) yield elem;
    }
  }
}