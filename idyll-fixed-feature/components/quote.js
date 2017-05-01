const React = require('react');
const ReactDOM = require('react-dom');

class Quote extends React.Component {
  render () {
    return <figure className="idyll-quote">
      <blockquote>
        {this.props.children}
      </blockquote>
      <figcaption><cite>{this.props.attrib}</cite></figcaption>
    </figure>
  }
}

module.exports = Quote;
