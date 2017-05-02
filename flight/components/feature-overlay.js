const React = require('react');
const ReactDOM = require('react-dom');

class FeatureOverlay extends React.Component {
  render () {
    let overlayStyle = {
      position: 'relative',
      zIndex: 1
    };

    return <div style={overlayStyle}>
      {this.props.children}
    </div>
  }
}

module.exports = FeatureOverlay;
