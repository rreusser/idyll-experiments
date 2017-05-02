'use strict';

module.exports = function (regl, mesh) {

  return regl({
    vert: `
      precision mediump float;
      attribute vec2 rth;
      varying float psi, cp, rgrid;
      varying vec2 b, uv;
      uniform mat4 modelview;
      uniform vec2 mu, gridSize;
      uniform float r0, theta0, n, circulation, scale, rsize, alpha, colorScale;
      #define OPI2 0.15915494309

      vec2 cdiv (vec2 a, vec2 b) {
        return vec2(a.x * b.x + a.y * b.y, a.y * b.x - a.x * b.y) / dot(b, b);
      }

      vec2 cmul (vec2 a, vec2 b) {
        return vec2(a.x * b.x - a.y * b.y, a.y * b.x + a.x * b.y);
      }

      vec2 csqr (vec2 a) {
        return vec2(a.x * a.x - a.y * a.y, 2.0 * a.x * a.y);
      }

      vec2 cinv (vec2 a) {
        return vec2(a.x, -a.y) / dot(a, a);
      }

      float cmag2 (vec2 a) {
        return dot(a, a);
      }

      void main () {
        uv = rth;
        uv.x = pow(uv.x, 0.6666666);
        uv *= gridSize;
        uv.y *= OPI2;

        //b = barycentric;
        rgrid = rth.x;
        float r = 1.0 + rgrid * rsize;
        float theta = rth.y + theta0;
        vec2 rot = vec2(cos(alpha), sin(alpha));
        vec2 zeta = r * vec2(cos(theta), sin(theta));

        // Compute 1 + 1 / zeta and 1 - 1 / zeta:
        vec2 oz = cinv(r0 * zeta + mu);
        vec2 opz = oz;
        vec2 omz = -oz;
        opz.x += 1.0;
        omz.x += 1.0;

        // Exponentiate both of the above:
        float opznarg = atan(opz.y, opz.x) * n;
        float opznmod = pow(dot(opz, opz), n * 0.5);

        // (1 + 1 / (zeta + mu)) ** n:
        vec2 opzn = opznmod * vec2(cos(opznarg), sin(opznarg));

        float omznarg = atan(omz.y, omz.x) * n;
        float omznmod = pow(dot(omz, omz), n * 0.5);

        // (1 - 1 / (zeta + mu)) ** n:
        vec2 omzn = omznmod * vec2(cos(omznarg), sin(omznarg));

        // Compute the potential:
        vec2 circ = vec2(0.0, circulation * OPI2);
        vec2 wt = rot - cdiv(csqr(cinv(zeta)), rot) + cdiv(circ, zeta);

        // Compute the final coordinate, z:
        vec2 z = n * cdiv(opzn + omzn, opzn - omzn);
        //vec2 z = mu + r0 * zeta;

        // Compute the jacobian:
        vec2 dzdzeta = 4.0 * n * n * cdiv(cmul(opzn, omzn), cmul(csqr(r0 * zeta + mu) - vec2(1, 0), csqr(opzn - omzn)));
        //vec2 dzdzeta = vec2(1, 0);

        cp = 1.0 - cmag2(cdiv(wt, dzdzeta)) * colorScale;

        // Compute z^2 - 1
        psi = (r - 1.0 / r) * sin(theta + alpha) + circulation * OPI2 * log(r);

        //z.x -= n;
        //z /= scale;
        //z.x += 0.5;
        //z *= 4.0;

        gl_Position = modelview * vec4(z, 0, 1);
        //gl_Position = vec4(z, 0, 1);
      }
    `,
    frag: `
      #extension GL_OES_standard_derivatives : enable
      precision mediump float;

      vec4 colormap (float x) {
        const float e0 = 0.0;
        const vec4 v0 = vec4(0.26666666666666666,0.00392156862745098,0.32941176470588235,1);
        const float e1 = 0.13;
        const vec4 v1 = vec4(0.2784313725490196,0.17254901960784313,0.47843137254901963,1);
        const float e2 = 0.25;
        const vec4 v2 = vec4(0.23137254901960785,0.3176470588235294,0.5450980392156862,1);
        const float e3 = 0.38;
        const vec4 v3 = vec4(0.17254901960784313,0.44313725490196076,0.5568627450980392,1);
        const float e4 = 0.5;
        const vec4 v4 = vec4(0.12941176470588237,0.5647058823529412,0.5529411764705883,1);
        const float e5 = 0.63;
        const vec4 v5 = vec4(0.15294117647058825,0.6784313725490196,0.5058823529411764,1);
        const float e6 = 0.75;
        const vec4 v6 = vec4(0.3607843137254902,0.7843137254901961,0.38823529411764707,1);
        const float e7 = 0.88;
        const vec4 v7 = vec4(0.6666666666666666,0.8627450980392157,0.19607843137254902,1);
        const float e8 = 1.0;
        const vec4 v8 = vec4(0.9921568627450981,0.9058823529411765,0.1450980392156863,1);
        float a0 = smoothstep(e0,e1,x);
        float a1 = smoothstep(e1,e2,x);
        float a2 = smoothstep(e2,e3,x);
        float a3 = smoothstep(e3,e4,x);
        float a4 = smoothstep(e4,e5,x);
        float a5 = smoothstep(e5,e6,x);
        float a6 = smoothstep(e6,e7,x);
        float a7 = smoothstep(e7,e8,x);
        return max(mix(v0,v1,a0)*step(e0,x)*step(x,e1),
          max(mix(v1,v2,a1)*step(e1,x)*step(x,e2),
          max(mix(v2,v3,a2)*step(e2,x)*step(x,e3),
          max(mix(v3,v4,a3)*step(e3,x)*step(x,e4),
          max(mix(v4,v5,a4)*step(e4,x)*step(x,e5),
          max(mix(v5,v6,a5)*step(e5,x)*step(x,e6),
          max(mix(v6,v7,a6)*step(e6,x)*step(x,e7),mix(v7,v8,a7)*step(e7,x)*step(x,e8)
        )))))));
      }

      varying float psi, cp, rgrid;
      varying vec2 uv;
      uniform float cpAlpha, streamAlpha, gridAlpha;

      float grid (float parameter, float width, float feather) {
        float w1 = width - feather * 0.5;
        float d = fwidth(parameter);
        float looped = 0.5 - abs(mod(parameter, 1.0) - 0.5);
        return smoothstep(d * w1, d * (w1 + feather), looped);
      }

      float grid (vec2 parameter, float width, float feather) {
        float w1 = width - feather * 0.5;
        vec2 d = fwidth(parameter);
        vec2 looped = 0.5 - abs(mod(parameter, 1.0) - 0.5);
        vec2 a2 = smoothstep(d * w1, d * (w1 + feather), looped);
        return min(a2.x, a2.y);
      }

      const float feather = 0.5;
      const float streamWidth = 1.0;
      const float pressureWidth = 1.0;
      const float boundaryWidth = 1.0;
      void main () {
        float boundary = grid(rgrid, boundaryWidth, feather);
        //float pressure = 1.0 - (1.0 - grid(cp * 20.0, pressureWidth, feather)) * cpAlpha;
        float stream = (1.0 - grid(5.0 * psi, streamWidth, feather)) * streamAlpha;
        vec3 color = colormap(max(0.0, min(1.0, cp))).xyz;

        float gridLines = (1.0 - grid(uv, 1.0, feather)) * gridAlpha;
        color *= 1.0 - gridLines;

        gl_FragColor = vec4((color + stream) * boundary, 1);
        //gl_FragColor = vec4((color * pressure + stream) * boundary, 1);
      }
    `,
    attributes: {
      rth: mesh.positions,
    },
    depth: {enable: false},
    elements: mesh.cells,
    count: mesh.cells.length * 3
  });
};
