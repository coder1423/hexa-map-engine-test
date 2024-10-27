// @ts-check
import {getIndexByLocation} from '../functions/location.js';

/**
 * @param {Number[]} max
 * @param {Number[][]} palette
 * @param {Number[]} data
 * @param {import('./structure.js').Overlay[]} overlayList
 */
export function createGetRenderingDataByLocation(max, palette, data, overlayList) {
  /** @param {Number[]} location*/
  return location => {
    const index = getIndexByLocation(location, max);
    if (index === undefined) return;
    let rgb = palette[data[index]];

    for (const overlay of overlayList) {
      if (overlay.indexSet.has(index)) {
        rgb = mixRGBs(rgb, overlay.rgb, overlay.alpha);
      }
    }

    return getStrByRGB(rgb);
  }
}

/** @param {Number[]} rgb */
function getStrByRGB(rgb) {
  return `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
}
/**
 * @param {Number[]} baseRgb
 * @param {Number[]} rgb
 * @param {Number} alpha 0~1
*/
function mixRGBs(baseRgb, rgb, alpha) {
  return [
    baseRgb[0] + (rgb[0]-baseRgb[0])*alpha,
    baseRgb[1] + (rgb[1]-baseRgb[1])*alpha,
    baseRgb[2] + (rgb[2]-baseRgb[2])*alpha
  ]
}