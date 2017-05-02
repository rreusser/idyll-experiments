const React = require('react');
const ReactDOM = require('react-dom');
const IdyllComponent = require('idyll-component');
const Latex = require('react-latex');
const select = require('d3-selection').select;
const format = require('d3-format').format;

document.write('<link href="data/katex.min.css" rel="stylesheet">');

const allowedProps = ['domain', 'step', 'children'];

class Equation extends IdyllComponent {
  constructor(props) {
    super(props);
    this.state = {
      showRange: false
    };
  }

  handleChange(event) {
    this.updateProps({
      value: +event.target.value
    });
  }

  componentDidMount() {
    const dom = ReactDOM.findDOMNode(this);

    this.propNodes = {};
    const self = this;
    select(dom).selectAll('.mord').each(function (d) {
      const $this = select(this);
      Object.keys(self.props).filter((prop) => {
        return allowedProps.indexOf(prop) === -1
      }).forEach((prop) => {
        if ($this.text() === prop) {
          self.propNodes[prop] = $this;
          $this.style('cursor', 'pointer');
          $this.on('mouseover', () => {
            $this.style('color', 'red');
          }).on('mouseout', () => {
            if (!(self.state.showRange && self.state.var === prop)) {
              $this.style('color', 'black');
            }
          }).on('click', () => {

            if (!(self.state.showRange && self.state.var === prop)) {
              self.setState({
                showRange: true,
                var: prop
              });
              $this.text(self.props[prop])
              $this.style('color', 'red');
              Object.keys(self.propNodes).filter(d => d !== prop).forEach((d) => {
                self.propNodes[d].text(d);
                self.propNodes[d].style('color', 'black');
              })
            } else {
              self.setState({
                showRange: false,
                var: prop
              });
              $this.style('color', 'black');
              $this.text(prop)
            }
          })
        }
      })
    });

  }

  handleRangeUpdate(event) {
    const newProps = {};
    const val = +event.target.value;
    newProps[this.state.var] = val;
    this.updateProps(newProps);
    this.propNodes[this.state.var].text(val);
  }

  renderEditing() {
    if (!this.state.showRange) {
      return null;
    }

    const d = (this.props.domain || {})[this.state.var] || [-10, 10];
    const step = (this.props.step || {})[this.state.var] || 0.1;
    return (
      <div style={{ paddingTop: 15, textAlign: 'center' }}>
        <input type='range' value={format('0.1f')(this.props[this.state.var])} min={d[0]} max={d[1]} onChange={this.handleRangeUpdate.bind(this)} step={step} />
      </div>
    );
  }

  getLatex() {
    if (this.props.latex) {
      return this.props.latex;
    }
    return (this.props.children && this.props.children[0]) ? this.props.children[0] : '';
  }

  render() {
    const latexChar = '$';
    const latexString = latexChar + this.getLatex()  + latexChar;
    return (
      <span>
          <Latex displayMode={this.props.display}>{latexString}</Latex>
          {this.renderEditing()}
      </span>
    );
  }
}

module.exports = Equation;
