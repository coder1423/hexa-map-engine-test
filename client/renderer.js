// @ts-check
import * as Vector2 from '../functions/vector2.js';

const [x, y] = [0, 1];

/**
 * requestAnimationFrame
 */
export class Renderer {
  /**
   * @param {CanvasRenderingContext2D} ctx
   * @param {Number[]} 화면위치
   * @param {Number[]} 격자크기
   * @param {(location: number[]) => Number[] | undefined} getRenderingDataByLocation
   */
  constructor(ctx, 화면위치, 격자크기, getRenderingDataByLocation) {
    const performFrame = () => {
      const 화면크기 = [ctx.canvas.width, ctx.canvas.height];
      const padding = 격자크기[y] / 40, padding격자크기 = Vector2.add(격자크기, [-padding,-padding]);
      ctx.clearRect(0,0, 화면크기[x], 화면크기[y]);

      for (const location of 출력위치(화면위치, 격자크기, 화면크기)) {
        let tileColor = getRenderingDataByLocation(location);
        if (tileColor === undefined) continue;

        const drawingVector = getDrawingVectorByLocation(location, 화면위치, 격자크기, padding);
        ctx.fillStyle = getStrByRGB(tileColor);
    
        drawTile(ctx, drawingVector, padding격자크기, 격자크기[y]);
      }

      requestAnimationFrame(performFrame);
    }

    performFrame();
  }
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number[]} drawingVector
 * @param {Number[]} 격자크기
 * @param {Number} 격자크기Y
 */
function drawTile(ctx, [px, py], [dx, dy], 격자크기Y) {
  if (격자크기Y > 5) {
    ctx.beginPath();
      ctx.moveTo(px     ,py+dy  );
      ctx.lineTo(px+dx  ,py     );
      ctx.lineTo(px+dx*2,py+dy  );
      ctx.lineTo(px+dx*2,py+dy*3);
      ctx.lineTo(px+dx  ,py+dy*4);
      ctx.lineTo(px     ,py+dy*3);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.fillRect(px, py+격자크기Y/2, dx*2, dy*3);
  }
}

/**
 * @param {Number[]} 화면위치
 * @param {Number[]} 격자크기
 * @param {Number[]} 화면크기
 */
function* 출력위치(화면위치, 격자크기, 화면크기) {
  const 타일크기 = [격자크기[x]*2, 격자크기[y]*3],
    시작 = Vector2.divfloor(Vector2.scalarMul(화면위치, -1), 타일크기),
    반복횟수 = Vector2.divfloor(화면크기, 타일크기);

  for (let iy = 반복횟수[y]+3; iy--;)
  for (let ix = 반복횟수[x]+3; ix--;) {
    yield Vector2.add(시작, [ix-1, iy-1]);
  }
}

/**
 * @param {Number[]} location
 * @param {Number[]} 화면위치
 * @param {Number[]} 격자크기
 * @param {Number} padding
 */
function getDrawingVectorByLocation(location, 화면위치, 격자크기, padding) {
  return [
    화면위치[x] + padding + location[x]*격자크기[x]*2 + (location[y] & 1)*격자크기[x],
    화면위치[y] + padding + location[y]*격자크기[y]*3
  ]
}

/** @param {Number[]} rgb */
function getStrByRGB(rgb) {
  return `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`;
}
/**
 * @param {Number[]} baseRgb
 * @param {Number[]} rgb
 * @param {Number} a 0~1
*/
function mixRGBs(baseRgb, rgb, a) {
  return [
    baseRgb[0] + (rgb[0]-baseRgb[0])*a,
    baseRgb[1] + (rgb[1]-baseRgb[1])*a,
    baseRgb[2] + (rgb[2]-baseRgb[2])*a
  ]
}