// @ts-check
import {getIndexByLocation} from '../functions/location.js';
import * as RBG from '../functions/rgb.js'

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
        rgb = RBG.mixRGBs(rgb, overlay.rgb, overlay.alpha);
      }
    }

    return rgb;
  }
}