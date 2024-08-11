// @ts-check
import {Screen} from './screen.js';
import {Model} from './model.js';
import * as Map from './map-data.js';

addEventListener('load',
  () => {
    const mainNode = document.querySelector('main');
    if (!mainNode) return;
    const model = new Model(Map.size, Map.data, Map.palette);
    new Screen(mainNode, model.getRenderingDataByLocation, model.triggerDataChangeByLocation);
  }, {once : true}
)
oncontextmenu = e => e.preventDefault();


class State {
  /**
   * @param {State} rootState
   */
  constructor(rootState) {
    const rootNode = rootState.slot;
    this.slot = null;
  }
  remove() {

  }
}