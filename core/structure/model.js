// @ts-check

export class Model {
  /**
   * @param {Number[]} size
   * @param {Number[]} data
   * @param {Number[][]} palette
   */
  constructor(
    size,
    data,
    palette
  ) {
    this.size = size;
    this.data = data;
    this.palette = palette;
  }
}