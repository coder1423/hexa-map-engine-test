// @ts-check
import {Interaction} from './interaction.js';
import * as Map from './map-data.js';
import {Screen} from '../screen/screen.js';
import {createGetRenderingDataByLocation} from '../screen/create-get-rendering-data-by-location.js';

addEventListener('load',() => new Client(), {once : true});



/**
 * 브라우져 전역 데이터, 서버통신, 데이터 테이블
 */
class Client {
  constructor() {
    const root = document.querySelector('main');
    if (!root) return;

    const mouseLocation = [0, 0];

    /** @type {import('../screen/structure.js').Overlay[]} */
    const overlayList = [];

    /** @type {import('../screen/structure.js').Connection[]} */
    const connectionList = [];

    const getRenderingDataByLocation = createGetRenderingDataByLocation(Map.size, Map.palette, Map.data, overlayList);

    const canvas = document.createElement('canvas');

    new Interaction(root, canvas, mouseLocation, overlayList, connectionList, Map.size, Map.data);
    new Screen(canvas, mouseLocation, getRenderingDataByLocation, connectionList);



  }
}