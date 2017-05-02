const React = require('react');
const ReactDOM = require('react-dom');
const Container = require('./container');
const extend = require('xtend');

class Screen extends React.Component {
  render () {
    let overlayStyle = {
      position: 'relative',
      zIndex: 1,
      height: window.innerHeight + 'px',
      pointerEvents: 'none',
    };

    if (this.props.backgroundImage) {
      overlayStyle.backgroundImage = 'url(' + this.props.backgroundImage + ')';
      overlayStyle.backgroundSize = 'cover';
      overlayStyle.backgroundPosition = 'top center';
    }

    let contentContainerStyle = extend({
      flexDirection: 'column',
      display: 'flex',
      height: '100%',
    }, this.props.contentContainerStyle || {});

    let contentStyle = {
      alignSelf: {
        left: 'flex-start',
        center: 'center',
        right: 'flex-end',
        stretch: 'stretch'
      }[this.props.align] || 'flex-end',
      pointerEvents: 'all',
    }

    return <Container style={overlayStyle}
      className={this.props.className}
      fullBleed={this.props.fullBleed}
      expand={this.props.expand}
      expandLeft={this.props.expandLeft}
      expandRight={this.props.expandRight}
      padding={this.props.padding}
    >
      <div style={contentContainerStyle}>
        <div style={{display: 'flex', flex: this.props.position}}/>
        <div style={contentStyle}>
          {this.props.children}
        </div>
        <div style={{display: 'flex', flex: 1 - this.props.position}}/>
      </div>
    </Container>
  }
}

Screen.defaultProps = {
  position: 0.5,
  fullBleed: false,
  align: 'left',
};

module.exports = Screen;
