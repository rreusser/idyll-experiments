const regl = require('regl');
const React = require('react');
const ReactDOM = require('react-dom');
const IdyllComponent = require('idyll-component');

class Regl extends IdyllComponent {
  constructor (props) {
    super(props)
    this.initialize = this.initialize.bind(this);
    this.start = this.start.bind(this);
    this.dirty = true;
  }

  componentDidMount () {
    this.listener = () => {
      this.dirty = true;
    }
    window.addEventListener('resize', this.listener);
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.listener);
  }

  start (err, regl) {
    this.regl = regl;

    let n = 100;
    let x = new Array(n).fill(0).map((d, i) => i / (n - 1) * 2.0 - 1.0);

    let draw = regl({
      vert: `
        precision mediump float;
        attribute float x;
        uniform float aspect, t, k, a, p;
        void main () {
          vec2 uv = vec2(x, cos((x * k + 4.0 * t) / aspect - p));
          gl_Position = vec4(uv.x, a * uv.y * 0.5, 0.0, 1.0);
          gl_PointSize = 5.0;
        }
      `,
      frag: `
        precision mediump float;
        void main () {
          float c = smoothstep(0.4, 0.5, length(gl_PointCoord - 0.5));
          gl_FragColor = vec4(vec3(c), 1);
        }
      `,
      attributes: {
        x: x
      },
      uniforms: {
        aspect: ctx => ctx.viewportHeight / ctx.viewportWidth,
        t: regl.prop('t'),
        k: regl.prop('k'),
        a: regl.prop('a'),
        p: regl.prop('p')
      },
      primitive: 'point',
      count: n
    });


    regl.frame(() => {
      if (!this.dirty) return;

      regl.clear({color: [1, 1, 1, 1]})
      draw({
        t: this.props.position,
        k: this.props.wavenumber,
        a: this.props.amplitude,
        p: this.props.phase
      });

      this.dirty = false;
    });
  }

  componentWillUnmount () {
    this.regl.destroy();
  }

  shouldComponentUpdate (nextProps) {
    if (nextProps.position !== this.props.position ||
      nextProps.wavenumber !== this.props.wavenumber ||
      nextProps.amplitude !== this.props.amplitude ||
      nextProps.phase !== this.props.phase
    ) {
      this.dirty = true;
    }
    return false;
  }

  initialize (c) {
    if (this.node) return;

    this.node = c;

    // Defer this one tick so the dimension of the container are correct:
    requestAnimationFrame(() => {
      regl({
        extensions: [],
        container: this.node,
        pixelRatio: 1,
        attributes: {
          antialias: false,
          depth: false,
          stencil: false,
          alpha: false,
        },
        onDone: this.start
      });
    })
  }

  render () {
    let containerStyle = {
      height: '100%',
    }

    return <div
      className="idyll-regl"
      style={containerStyle}
      ref={this.initialize}
    />
  }
}

module.exports = Regl;
