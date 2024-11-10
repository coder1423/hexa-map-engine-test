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
    this.rgb      = rgb;
    this.indexSet = indexSet;
    this.alpha    = alpha;
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
    this.rgbaStr   = rgbaStr;
    this.lineWidth = lineWidth;
    this.path      = path;
  }
}

export class RenderingData {
  /**
   * @param {Number[]} tileRGB
   * @param {Rendering유닛 | Null} 유닛
   */
  constructor(
    tileRGB,
    유닛
  ) {
    this.tileRGB = tileRGB;
    this.유닛 = 유닛;
  }
}

export class Rendering유닛 {
  /**
   * @param {String} 경계RGBStr
   * @param {String} 채우기RGBStr
   * @param {Number[][]} 부호
   */
  constructor(
    경계RGBStr,
    채우기RGBStr,
    부호
  ) {
    this.경계RGBStr = 경계RGBStr;
    this.내부RGBStr = 채우기RGBStr;
    this.부호 = 부호;
  }
}