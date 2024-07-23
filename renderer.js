// @ts-check

const [x, y] = [0, 1];

/**
 * @returns {(canvas: HTMLCanvasElement, 화면위치: Number[], 격자크기: Number[]) => () => void}
 */
export const renderer = () => (canvas, 화면위치, 격자크기) => () => { // 첫번째 파라미터로 렌더링할 데이터 테이블 받아오기?
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0,0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(화면위치[x], 화면위치[y], 격자크기[x], 격자크기[y]);
    // ctx.beginPath();
    //   ctx.arc(vector[x], vector[y], edge, 0, 2*Math.PI);
    //   ctx.fill();
}