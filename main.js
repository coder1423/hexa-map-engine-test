// @ts-check
import {Screen} from './screen.js';
import {renderer} from './renderer.js';

addEventListener('load',
  () => {
    const mainNode = document.querySelector('main');
    if (!mainNode) return;
    new Screen(mainNode, renderer());
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