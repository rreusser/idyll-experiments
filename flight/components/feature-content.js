const React = require('react');
const ReactDOM = require('react-dom');
const shallowEqual = require('shallow-equal/objects');
const extend = require('xtend/mutable');

class FeatureContent extends React.Component {
  render () {
    return <div style={this.props.style}>
      {this.props.children}
    </div>
  }
}

module.exports = FeatureContent;
