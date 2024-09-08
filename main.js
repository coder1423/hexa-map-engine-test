// @ts-check
import {Client} from './client/client.js';
import * as Map from './map-data.js';

/**
 * 브라우져 전역 데이터
 */

addEventListener('load',
  () => {
    const mainNode = document.querySelector('main');
    if (!mainNode) return;
    new Client(mainNode, Map.size, Map.data, Map.palette);
  }, {once : true}
)
oncontextmenu = e => e.preventDefault();