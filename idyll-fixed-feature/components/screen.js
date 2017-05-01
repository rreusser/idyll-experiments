const React = require('react');
const ReactDOM = require('react-dom');

class Screen extends React.Component {
  render () {
    let overlayStyle = {
      position: 'relative',
      zIndex: 1,
      height: window.innerHeight + 'px',
      display: 'flex',
    };

    let contentStyle = {
      alignSelf: 'center',
    }

    return <div style={overlayStyle}>
      <div style={contentStyle}>
        {this.props.children}
      </div>
    </div>
  }
}

module.exports = Screen;
