const karmanTrefftz = require('./karman-trefftz');
const rotateZ = require('gl-mat4/rotateZ');

module.exports = function (regl) {
  var modelview = [];

  function r0 (ctx, props) {
    return Math.sqrt(Math.pow(1 - props.mux, 2) + Math.pow(muy(ctx, props), 2)) * props.radius;
  }

  function alpha (ctx, props) {
    return -props.alpha * Math.PI / 180;
  }

  function muy (ctx, props) {
    return props.muy;
  }

  function n (ctx, props) {
    return props.n;
  }

  return regl({
    uniforms: {
      mu: (ctx, props) => [props.mux, muy(ctx, props)],
      theta0: (ctx, props) => Math.atan2(-muy(ctx, props), 1 - props.mux),
      n: n,
      r0: r0,
      velocity: (ctx, props) => props.velocity,
      rsize: (ctx, props) => {
        return props.size / Math.sqrt(props.radius) / r0(ctx, props);
      },
      cpAlpha: (ctx, props) => props.cpAlpha,
      streamAlpha: (ctx, props) => props.streamAlpha,
      colorScale: (ctx, props) => props.colorScale,
      gridAlpha: (ctx, props) => props.gridAlpha,
      gridSize: (ctx, props) => [props.gridSize[0] - 1, props.gridSize[1] - 1],
      scale: (ctx, props) => {
        var theta0 = Math.atan2(-muy(ctx, props), 1 - props.mux);
        var a = props.mux - Math.cos(theta0) * r0(ctx, props);
        return n(ctx, props) - karmanTrefftz(n(ctx, props), a, 0)[0];
      },
      alpha: alpha,
      circulation: (ctx, props) => {
        return props.kuttaCondition * (
          -4.0 * Math.PI * Math.sin(alpha(ctx, props) - Math.asin(muy(ctx, props) / r0(ctx, props)))
        ) + (1.0 - props.kuttaCondition) * props.circulation;
      },
      modelview: (ctx, props) => {
        return rotateZ(modelview, ctx.view, alpha(ctx, props));
      }
    },
    context: {
      time: (ctx, props) => {
        if (props.time !== undefined) {
          return props.time;
        } else {
          return ctx.time;
        }
      }
    }
  });
};
