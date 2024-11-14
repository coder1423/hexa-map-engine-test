// @ts-check

export class Overlay {
  /**
   * @param {Number[]} rgb
   * @param {Set<Number>} indexSet
   * @param {Number} alpha 0~1
   */
  constructor(
    rgb,
    indexSet,
    alpha
  ) {
    this.rgb = rgb;
    this.indexSet = indexSet;
    this.alpha = alpha;
  }
}

export class Connection {
  /**
   * @param {String} rgbaStr
   * @param {Number} lineWidth
   * @param {Number[][]} path location[][]
   */
  constructor(
    rgbaStr,
    lineWidth,
    path
  ) {
    this.rgbaStr = rgbaStr;
    this.lineWidth = lineWidth;
    this.path = path;
  }
}

export class Rendering {
  /**
   * @param {Overlay[]} overlayList
   * @param {Connection[]} connectionList
   */
  constructor(
    overlayList,
    connectionList,
  ) {
    this.overlayList = overlayList;
    this.connectionList = connectionList;
  }
}