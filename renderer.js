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
 * @param {Number[]} 격자크기 격자크기[y] == 격자배율 / 2
 */
function draw(ctx, 화면위치, 격자크기) {
  const 화면크기 = [ctx.canvas.width, ctx.canvas.height];
  const padding = 격자크기[y] / 40, padding격자크기 = Vector2.add(격자크기, [-padding,-padding]);
  ctx.clearRect(0,0, 화면크기[x], 화면크기[y]);

  for (const 위치 of 출력위치(화면위치, 격자크기, 화면크기)) {
    if (위치[x] < 0 || 100 <= 위치[x] || 위치[y] < 0 || 100 <= 위치[y]) continue;
    const drawingVector = locationToDrawingVector(위치, 화면위치, 격자크기, padding);

    if (위치[x] == 0 && 위치[y] == 0) {
      ctx.fillStyle = 'rgb(255, 0, 0)';
    } else {
      ctx.fillStyle = 'rgb(190, 210, 150)';
    }
    drawTile(ctx, drawingVector, padding격자크기, 격자크기[y]);
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
function locationToDrawingVector(location, 화면위치, 격자크기, padding) {
  return [
    화면위치[x] + padding + location[x]*격자크기[x]*2 + (location[y] & 1)*격자크기[x],
    화면위치[y] + padding + location[y]*격자크기[y]*3
  ]
}