// @ts-check

/** @param {Number[]} rgb */
export function getStrByRGB(rgb) {
  return '#' + ((rgb[0]<<16) + (rgb[1]<<8) + rgb[2]<<0).toString(16).padStart(6,'0');
}

/**
 * @param {Number[]} baseRgb
 * @param {Number[]} rgb
 * @param {Number} alpha 0~1
*/
export function mixRGBs(baseRgb, rgb, alpha) {
  return [
    baseRgb[0] + (rgb[0]-baseRgb[0])*alpha,
    baseRgb[1] + (rgb[1]-baseRgb[1])*alpha,
    baseRgb[2] + (rgb[2]-baseRgb[2])*alpha
  ]
}