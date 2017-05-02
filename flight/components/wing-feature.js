const regl = require('regl');
const React = require('react');
const ReactDOM = require('react-dom');
const IdyllComponent = require('idyll-component');
const wing = require('../lib/wing');
const shallowEqual = require('shallow-equal/objects');
const cubicInOut = require('eases/cubic-in-out');
const quadInOut = require('eases/quad-in-out');

function clamp (t, dur) {
  return 0.5 + Math.max(-0.5, Math.min(0.5, (t - 0.5) / (dur || 1)));
}

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

  componentWillReceiveProps (nextProps, nextState) {
    if (this.content) {
      this.content.update(this.computeState(nextProps));
    }
  }

  computeState (props) {
    var screens = 7;
    var t = props.position * screens;

    var zoomtime = clamp(t - 1);
    var tZoomIn = 1.75
    var tZoomOut = 5.5
    var tKutta = 4
    var zoom = quadInOut(clamp(t - tZoomIn, 1.25)) -
      quadInOut(clamp((t - tZoomOut), 1.5))

    return {
      alpha: quadInOut(clamp(t)) * 15.0,
      kuttaCondition: quadInOut(clamp(t - tKutta, 1.25)),
      xmin: -3 + 4.25 * zoom,
      xmax: 3 - 0.0 * zoom,
      ymin: -1 - 0.45 * zoom,
      ymax: 1 - 0.45 * zoom,
    }
  }

  initialize (c) {
    if (this.node) return;

    this.node = c;

    // Defer this one tick so the dimension of the container are correct:
    requestAnimationFrame(() => {
      regl({
        extensions: ['oes_standard_derivatives'],
        container: this.node,
        pixelRatio: 1.0,
        attributes: {
          antialias: true,
          depth: false,
          stencil: false,
          alpha: false,
        },
        onDone: this.start
      });
    })
  }

  start (err, regl) {
    this.regl = regl;
    this.content = wing(regl, this.computeState(this.props));
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
