const React = require('react');
const ReactDOM = require('react-dom');
const IdyllComponent = require('idyll-component');
const shallowEqual = require('shallow-equal/objects');
const extend = require('xtend/mutable');
const FeatureContent = require('./feature-content');

const stateClasses = [
  'is-top',
  'is-fixed',
  'is-bottom'
];

class Feature extends IdyllComponent {
  constructor (props) {
    super(props)
    this.setFeature = this.setFeature.bind(this);
    this.setRoot = this.setRoot.bind(this);

    this.state = {
      scrollState: 0,
      featureMarginLeft: 0,
      featureWidth: window.innerWidth
    };
  }

  componentDidMount() {
    super.componentDidMount && super.componentDidMount();
    const node = ReactDOM.findDOMNode(this);
  }

  setRoot (c) {
    this.rootEl = window.rootEl = c;
    this.initialize();
  }

  setFeature (c) {
    this.featureEl = window.featureEl = c;
    this.initialize();
  }

  handleResize () {
    let rootRect = this.rootEl.getBoundingClientRect()
    this.setState({
      featureMarginLeft: -rootRect.left,
      featureWidth: window.innerWidth,
      featureHeight: window.innerHeight
    });
  }

  handleScroll () {
    if (!this.rootEl) return;
    let rootRect = this.rootEl.getBoundingClientRect();

    let position = rootRect.top / (window.innerHeight - rootRect.height)

    // Update this whenever it changes so that the state is correctly adjusted:
    this.setState({scrollState: position < 0 ? 0 : (position <= 1 ? 1 : 2)})

    // Only update the value when onscreen:
    if (rootRect.top < window.innerHeight && rootRect.bottom > 0) {
      this.updateProps({value: position})
    }
  }



  initialize () {
    if (!this.rootEl || !this.featureEl) return;

    this.handleResize();
    window.addEventListener('resize', this.handleResize.bind(this));
    window.addEventListener('scroll', this.handleScroll.bind(this));
  }

  render () {
    let feature;
    let ps = this.state.scrollState;
    let featureStyles = {
      width: this.state.featureWidth + 'px',
      height: this.state.featureHeight + 'px',
      marginLeft: ps === 1 ? 0 : (this.state.featureMarginLeft + 'px'),
      position: ps === 1 ? 'fixed' : 'absolute',
      bottom: ps === 2 ? 0 : 'auto'
    };

    if (ps === 1) {
      featureStyles.top = 0;
      featureStyles.right = 0;
      featureStyles.bottom = 0;
      featureStyles.left = 0;
    }

    let rootStyles = {
      position: 'relative',
      marginLeft: 0,
      marginRight: 0,
    };

    var featureChild = this.props.children.filter(c => c.type === FeatureContent)[0];
    var nonFeatureChildren = this.props.children.filter(c => c.type !== FeatureContent);

    if (featureChild) {
      feature = React.cloneElement(featureChild, {
        style: featureStyles,
        ref: this.setFeature
      });
    }

    return <figure
      style={rootStyles}
      className={`idyll-feature ${stateClasses[this.state.scrollState]}`}
      ref={this.setRoot}
    >
      {feature}
      {nonFeatureChildren}
    </figure>
  }
}

module.exports = Feature;
