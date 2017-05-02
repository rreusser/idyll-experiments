const React = require('react');
const ReactDOM = require('react-dom');
const extend = require('extend');

class Explanation extends React.Component {
  render () {
    var style = extend({
      color: 'black',
      backgroundColor: 'rgba(255,255,255,0.6)',
      padding: '10px 15px',
      fontSize: '1.2em',
    }, this.props.style || {});

    return <div style={style} className="idyll-explanation">
      {this.props.children}
    </div>
  }
}

module.exports = Explanation;
