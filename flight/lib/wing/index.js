'use strict';

const extend = require('xtend');
const mextend = require('xtend/mutable');
const shallowEqual = require('shallow-equal/objects');

module.exports = function run (regl, initialState) {
  const size = [41, 81];

  const state = mextend({
    mux: -0.08,
    muy: 0.08 * 0,
    n: 1.94,
    radius: 1,
    circulation: 0.0,
    alpha: 0,
    kuttaCondition: 0,
    cpAlpha: 0.2,
    streamAlpha: 0.15,
    colorScale: 0.425,
    gridAlpha: 0.0,
    size: 10,
    gridSize: size,
    xmin: -2,
    xmax: 2,
  }, initialState || {});

  const camera = require('./camera-2d')(regl, state);
  window.addEventListener('resize', camera.resize);

  const mesh = require('./mesh')(
    (r, th) => [Math.pow(r, 1.5), th],
    size[0], size[1], [0, 1], [0, Math.PI * 2]
  );

  window.addEventListener('resize', camera.taint);
  const draw = require('./draw-mesh')(regl, mesh);
  const setUniforms = require('./uniforms')(regl);

  regl.frame(({tick}) => {
    //if (tick % 2 !== 1) return;

    camera.update({
      xmin: state.xmin,
      xmax: state.xmax,
      ymin: state.ymin,
      ymax: state.ymax,
    });

    camera.draw(({dirty}) => {
      if (!dirty) return;

      setUniforms(state, () => {
        regl.clear({color: [1, 1, 1, 1]});
        draw();
      });
    });
  });

  return {
    update: function (changes) {
      let newState = extend(state, changes);

      if (!shallowEqual(newState, state)) {
        mextend(state, changes);
        camera.taint();
      }
    }
  };
}
