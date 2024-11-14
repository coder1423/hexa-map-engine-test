// @ts-check
import * as Vector2 from '../functions/vector2.js';
import {getIndexByLocation} from '../functions/location.js';
import * as RBG from '../functions/rgb.js'

const [x, y] = [0, 1];



/**
 * @param {import('./screen.js').Screen} screen
 * @param {import('../structure/rendering.js').Rendering} rendering
 * @param {import('../structure/model.js').Model} model
 */
export function Renderer(screen, rendering, model) {
  const {canvas, 화면위치, 격자크기} = screen;
  const {overlayList, connectionList} = rendering;
  const {data, size, palette} = model;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;



  const performFrame = () => {
    ctx.clearRect(0,0, canvas.width, canvas.height);

    const 격자배율 = 격자크기[y], // 격자크기[y] = 격자배율 / 2
      확대모드 = 격자배율 > 9,
      padding = 격자배율 / 40,
      타일기준 = Vector2.add(화면위치, [padding, padding]),
      paddedTileSize = Vector2.add(격자크기, [-padding,-padding]);

    const 타일크기 = [격자크기[x]*2, 격자크기[y]*3],
      시작 = Vector2.add(Vector2.divfloor(Vector2.scalarMul(화면위치, -1), 타일크기), [-1,-1]),
      반복횟수 = Vector2.add(Vector2.divfloor([canvas.width, canvas.height], 타일크기), [3,3]);

    for (let iy = 반복횟수[y]; iy--;)
    for (let ix = 반복횟수[x]; ix--;) {
      const location = Vector2.add(시작, [ix, iy]);

      const index = getIndexByLocation(location, size);
      if (index === undefined) continue;

      let rgb = palette[data[index]];
      for (const overlay of overlayList) {
        if (overlay.indexSet.has(index)) {
          rgb = RBG.mixRGBs(rgb, overlay.rgb, overlay.alpha);
        }
      }
      ctx.fillStyle = RBG.getStrByRGB(rgb);

      const drawingVector = getDrawingVectorByLocation(타일기준, location);
      if (확대모드) {
        ctx.beginPath();
          ctx.moveTo(drawingVector[x]                    ,drawingVector[y]+paddedTileSize[y]  );
          ctx.lineTo(drawingVector[x]+paddedTileSize[x]  ,drawingVector[y]                    );
          ctx.lineTo(drawingVector[x]+paddedTileSize[x]*2,drawingVector[y]+paddedTileSize[y]  );
          ctx.lineTo(drawingVector[x]+paddedTileSize[x]*2,drawingVector[y]+paddedTileSize[y]*3);
          ctx.lineTo(drawingVector[x]+paddedTileSize[x]  ,drawingVector[y]+paddedTileSize[y]*4);
          ctx.lineTo(drawingVector[x]                    ,drawingVector[y]+paddedTileSize[y]*3);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.fillRect(drawingVector[x], drawingVector[y]+격자배율*0.5, paddedTileSize[x]*2, paddedTileSize[y]*3);
      }

    }

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

    requestAnimationFrame(performFrame);
  }
  performFrame();



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