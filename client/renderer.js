// @ts-check
import * as Vector2 from '../functions/vector2.js';
import {getIndexByLocation} from '../functions/location.js';

const [x, y] = [0, 1];

/**
 * requestAnimationFrame
 */
export class Renderer {
  /**
   * @param {CanvasRenderingContext2D} ctx
   * @param {Number[]} 화면위치
   * @param {Number[]} 격자크기
   * @param {(location: number[]) => String | undefined} getRenderingDataByLocation
   * @param {Connection[]} connectionList
   */
  constructor(ctx, 화면위치, 격자크기, getRenderingDataByLocation, connectionList) {
    performFrame();

    function performFrame() {
      const 격자배율 = 격자크기[y]; // 격자크기[y] = 격자배율 / 2
      ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height);

      const padding = 격자배율 / 40,
        타일기준 = Vector2.add(화면위치, [padding, padding]),
        paddedTileSize = Vector2.add(격자크기, [-padding,-padding]);
      for (const location of 출력위치()) {
        const color = getRenderingDataByLocation(location);
        if (color === undefined) continue;
        ctx.fillStyle = color;

        const drawingVector = getDrawingVectorByLocation(타일기준, location);
        if (격자배율 > 5) {
          drawTile(drawingVector, paddedTileSize);
        } else {
          ctx.fillRect(drawingVector[x], drawingVector[y]+격자배율*0.5, paddedTileSize[x]*2, paddedTileSize[y]*3);
        }
      }

      if (격자배율 > 5) {
        const 경로기준 = Vector2.add(화면위치, [격자크기[x], 격자크기[y]*2]);
        for (const connection of connectionList) {
          if (connection.path.length < 1) continue;
          ctx.strokeStyle = connection.rgbaStr;
          ctx.lineWidth   = connection.lineWidth * 격자배율;
          let [px, py] = getDrawingVectorByLocation(경로기준, connection.path[0]);
          ctx.beginPath();
          ctx.moveTo(px, py);
          for (let i = 0; ++i < connection.path.length;) {
            [px, py] = getDrawingVectorByLocation(경로기준, connection.path[i]);
            ctx.lineTo(px, py);
          }
          ctx.stroke();
        }
      }

      requestAnimationFrame(performFrame);
    }

    /**
     * @param {Number[]} reference
     * @param {Number[]} tileSize
     */
    function drawTile(reference, tileSize) {
      ctx.beginPath();
        ctx.moveTo(reference[x]              ,reference[y]+tileSize[y]  );
        ctx.lineTo(reference[x]+tileSize[x]  ,reference[y]              );
        ctx.lineTo(reference[x]+tileSize[x]*2,reference[y]+tileSize[y]  );
        ctx.lineTo(reference[x]+tileSize[x]*2,reference[y]+tileSize[y]*3);
        ctx.lineTo(reference[x]+tileSize[x]  ,reference[y]+tileSize[y]*4);
        ctx.lineTo(reference[x]              ,reference[y]+tileSize[y]*3);
      ctx.closePath();
      ctx.fill();
    }

    function* 출력위치() {
      const 타일크기 = [격자크기[x]*2, 격자크기[y]*3],
        시작 = Vector2.divfloor(Vector2.scalarMul(화면위치, -1), 타일크기),
        반복횟수 = Vector2.divfloor([ctx.canvas.width, ctx.canvas.height], 타일크기);

      for (let iy = 반복횟수[y]+3; iy--;)
      for (let ix = 반복횟수[x]+3; ix--;) {
        yield Vector2.add(시작, [ix-1, iy-1]);
      }
    }

    /**
     * @param {Number[]} reference
     * @param {Number[]} location
     */
    function getDrawingVectorByLocation(reference, location) {
      return [
        reference[x] + location[x]*격자크기[x]*2 + (location[y] & 1)*격자크기[x],
        reference[y] + location[y]*격자크기[y]*3
      ]
    }

  }
}

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
    this.rgb      = rgb,
    this.indexSet = indexSet,
    this.alpha    = alpha
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
    this.rgbaStr   = rgbaStr,
    this.lineWidth = lineWidth,
    this.path      = path
  }
}

/**
 * @param {Number[]} max
 * @param {Number[][]} palette
 * @param {Number[]} data
 * @param {Overlay[]} overlayList
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