// @ts-check

const [x, y] = [0, 1];

// 첫번째 파라미터로 렌더링할 데이터 테이블 받아오기?

export function renderer() {
  return draw만들기;

  /**
   * @param {CanvasRenderingContext2D} ctx
   * @param {Number[]} 화면위치
   * @param {Number[]} 격자크기
   */
  function draw만들기(ctx, 화면위치, 격자크기) {
    return draw;

    function draw() {
      ctx.clearRect(0,0, ctx.canvas.width, ctx.canvas.height);
      ctx.strokeStyle = 'rgb(0, 0, 0)';
      ctx.lineWidth = 격자크기[y] / 10; // 격자크기[y] == 격자배율 / 2
      ctx.fillStyle = 'rgb(255, 255, 255)';

      타일경로그리기([0,0]);
      ctx.fill();
      ctx.stroke();

      타일경로그리기([1,0]);
      ctx.fill();
      ctx.stroke();

      타일경로그리기([0,1]);
      ctx.fill();
      ctx.stroke();
    }

    /** @param {Number[]} location */
    function 타일경로그리기(location) {
      const 그리기위치 = locationTo그리기위치(location);
      ctx.beginPath();
      ctx.moveTo(
        그리기위치[x],
        그리기위치[y] + 격자크기[y]
      );
      ctx.lineTo(
        그리기위치[x] + 격자크기[x],
        그리기위치[y]
      );
      ctx.lineTo(
        그리기위치[x] + 격자크기[x]*2,
        그리기위치[y] + 격자크기[y]
      );
      ctx.lineTo(
        그리기위치[x] + 격자크기[x]*2,
        그리기위치[y] + 격자크기[y]*3
      );
      ctx.lineTo(
        그리기위치[x] + 격자크기[x],
        그리기위치[y] + 격자크기[y]*4
      );
      ctx.lineTo(
        그리기위치[x],
        그리기위치[y] + 격자크기[y]*3
      );
      ctx.closePath();
    }
    /** @param {Number[]} location */
    function locationTo그리기위치(location) {
      return [
        화면위치[x] + location[x]*격자크기[x]*2 + (location[y] & 1)*격자크기[x],
        화면위치[y] + location[y]*격자크기[y]*3
      ]
    }
  }
}