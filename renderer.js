// @ts-check
import * as Vector2 from './vector2.js';

const [x, y] = [0, 1];

// 첫번째 파라미터로 렌더링할 데이터 테이블 받아오기?

export class Renderer{
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {Number[]} 화면위치
   * @param {Number[]} 격자크기
   */
  constructor(canvas, 화면위치, 격자크기) {
    const ctx = canvas.getContext('2d');

    performFrame();
    function performFrame() {
      if (!ctx) return;
      draw(ctx, 화면위치, 격자크기);
      requestAnimationFrame(performFrame);
    }
  }
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number[]} 화면위치
 * @param {Number[]} 격자크기
 */
function draw(ctx, 화면위치, 격자크기) {
  ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height);

  // 격자크기[y] == 격자배율 / 2
  const padding = 격자크기[y] / 20, padding격자크기 = Vector2.add(격자크기, [-padding,-padding]);
  for (const 위치 of 출력위치(화면위치, 격자크기, [ctx.canvas.width, ctx.canvas.height])) {
    const drawingVector = locationToDrawingVector(위치, 화면위치, 격자크기, padding);
    if (위치[x] == 0 && 위치[y] == 0) {
      ctx.fillStyle = 'rgb(255, 0, 0)';
    } else {
      ctx.fillStyle = 'rgb(255, 255, 255)';
    }
    drawTilePath(ctx, drawingVector, padding격자크기);
    ctx.fill();
  }
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number[]} drawingVector
 * @param {Number[]} 격자크기
 */
function drawTilePath(ctx, [px, py], [dx, dy]) {
  ctx.beginPath();
  ctx.moveTo(px     ,py+dy  );
  ctx.lineTo(px+dx  ,py     );
  ctx.lineTo(px+dx*2,py+dy  );
  ctx.lineTo(px+dx*2,py+dy*3);
  ctx.lineTo(px+dx  ,py+dy*4);
  ctx.lineTo(px     ,py+dy*3);
  ctx.closePath();
}

/**
 * @param {Number[]} 화면위치
 * @param {Number[]} 격자크기
 * @param {Number[]} 화면크기
 */
function* 출력위치(화면위치, 격자크기, 화면크기) {
  const 타일크기 = [격자크기[x]*2, 격자크기[y]*3];
  const 시작 = Vector2.divfloor(Vector2.scalarMul(화면위치, -1), 타일크기);
  const 끝 = Vector2.add(시작, Vector2.divfloor(화면크기, 타일크기)).map(val => Math.min(val+1, 100));
  for (let 위치Y = Math.max(시작[y]-1, 0); 위치Y <= 끝[y]; 위치Y++)
  for (let 위치X = Math.max(시작[x]-1, 0); 위치X <= 끝[x]; 위치X++) {
    yield [위치X, 위치Y];
  }
}

/**
 * @param {Number[]} location
 * @param {Number[]} 화면위치
 * @param {Number[]} 격자크기
 * @param {Number} padding
 */
function locationToDrawingVector(location, 화면위치, 격자크기, padding) {
  return [
    화면위치[x] + padding + location[x]*격자크기[x]*2 + (location[y] & 1)*격자크기[x],
    화면위치[y] + padding + location[y]*격자크기[y]*3
  ]
}