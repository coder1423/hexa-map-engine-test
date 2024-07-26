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
  const 타일크기 = [격자크기[x]*2, 격자크기[y]*3];

  const 시작 = Vector2.divfloor(Vector2.scalarMul(화면위치, -1), 타일크기);
  const 끝 = Vector2.add(시작, Vector2.divfloor([ctx.canvas.width, ctx.canvas.height], 타일크기)).map(val => Math.min(val+1, 100));

  ctx.strokeStyle = 'rgb(0, 0, 0)';
  ctx.lineWidth = 격자크기[y] / 10; // 격자크기[y] == 격자배율 / 2
  ctx.fillStyle = 'rgb(255, 255, 255)';


  for (let 위치X = Math.max(시작[x]-1, 0); 위치X <= 끝[x]; 위치X++)
  for (let 위치Y = Math.max(시작[y]-1, 0); 위치Y <= 끝[y]; 위치Y++) {
    const 그리기위치 = locationToDrawingVector([위치X, 위치Y], 화면위치, 격자크기);
      ctx.save();
      ctx.translate(그리기위치[x], 그리기위치[y]);
      if (위치X == 0 && 위치Y == 0) {
        ctx.fillStyle = 'rgb(255, 0, 0)';
      }
      drawTilePath(ctx, 격자크기);
      ctx.fill();
      ctx.stroke();
    ctx.restore();
  }
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number[]} 격자크기
 */
function drawTilePath(ctx, [dx, dy]) {
  ctx.beginPath();
  ctx.moveTo(0   ,dy  );
  ctx.lineTo(dx  ,0   );
  ctx.lineTo(dx*2,dy  );
  ctx.lineTo(dx*2,dy*3);
  ctx.lineTo(dx  ,dy*4);
  ctx.lineTo(0   ,dy*3);
  ctx.closePath();
}

/**
 * @param {Number[]} location
 * @param {Number[]} 화면위치
 * @param {Number[]} 격자크기
*/
function locationToDrawingVector(location, 화면위치, 격자크기) {
  return [
    화면위치[x] + location[x]*격자크기[x]*2 + (location[y] & 1)*격자크기[x],
    화면위치[y] + location[y]*격자크기[y]*3
  ]
}