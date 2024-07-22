// @ts-check
/**
 * vector2는 2차원 xy 화면상의 위치
 * location은 타일상의 xy 위치
 * index는 타일의 배열상의 실제위치
 */
import * as Location from './location.js';
import * as Vector2 from './vector2.js';

// Renderer
export class Screen {
  /**
   * @param {HTMLCanvasElement} canvas
   */
  constructor(canvas, vector=[0,0], edge=10, edgeMin=5, edgeMax=50) {
    let size = clacTileSize(edge);
    function draw() {
      size
    }

    /** @param {Number} val */
    this.setEdge = (val) => {
      edge = limitedToRange(val, edgeMin, edgeMax);
      size = clacTileSize(edge);
    }
    /** @param {Number} delta */
    this.addEdge = (delta) => {
      this.setEdge(edge + delta);
    }
    this.getSize = () => {
      return size;
    }

    /**
     * @param {Number} x
     * @param {Number} y
     */
    this.resize = (x, y) => {
      canvas.width  = x;
      canvas.height = y;
      draw();
    }
    /**
     * @param {Number[]} newVector
     */
    this.setVector = (newVector) => {
      vector = newVector;
      draw();
    }
    this.getVector = () => {
      return vector;
    }
  }
}

/** @param {Number} edge */
function clacTileSize(edge) {
  return [edge*3**0.5, edge*2];
}
/**
 * @param {Number} val
 * @param {Number} min
 * @param {Number} max
 */
function limitedToRange(val, min, max) {
  return Math.min(Math.max(val, min), max);
}