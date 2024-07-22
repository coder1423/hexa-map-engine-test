// @ts-check
import {Screen} from './screen.js';
import * as Vector2 from './vector2.js';

addEventListener('load',
  () => {
    const mainNode = document.querySelector('main');
    if (!mainNode) return;
    new ScreenState(mainNode);
  }, {
    once : true
  }
)
oncontextmenu = e => e.preventDefault();

class ScreenState {
  /**
   * @param {HTMLElement} rootNode
   */
  constructor(
    rootNode, options={
      multiplier: 0.01,
      vector: [0,0]
    }
  ) {
    const canvas = rootNode.appendChild(document.createElement('canvas')),
      screen = new Screen(canvas, options.vector);
      canvas.classList.add('layer');
    let multiplier = options.multiplier;

    function resize() {
      screen.resize(innerWidth, innerHeight);
    }
    /**
     * @param {WheelEvent} e
     */
    function wheel(e) {
      screen.addEdge(e.deltaY*multiplier);
      console.log(screen.getSize);
      e.offsetX
      e.offsetY
    }
    /** @param {MouseEvent} e */
    function mousedown(e) {
      switch (e.button) {
        case 0:
          
          break;
        case 1:
          new ScreenMouseWheelDown(canvas, screen, [e.offsetX, e.offsetY]);
          break;
        case 2:
          
          break;
      }
    }

    resize();
    addEventListener('resize', resize);
    canvas.addEventListener('wheel', wheel);
    canvas.addEventListener('mousedown', mousedown);
  }
}
class ScreenMouseWheelDown {
  /**
   * @param {HTMLElement} node
   * @param {Screen} screen
   * @param {Number[]} vector
   */
  constructor(node, {getVector, setVector}, vector) {
    const screenVector = getVector();

    function mouseup() {
      node.removeEventListener('mousemove', mousemove);
    }
    /** @param {MouseEvent} e */
    function mousemove(e) {
      setVector(
        Vector2.sum([
          screenVector,
          Vector2.difference(vector, [e.offsetX, e.offsetY])
        ])
      )
    }

    node.addEventListener('mousemove', mousemove);
    addEventListener('mouseup', mouseup, {once : true});
  }
}

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