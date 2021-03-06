import * as React from 'react';
import PropTypes from 'prop-types';

class Section extends React.Component {
  constructor() {
    super();

    this.state = {
      windowHeight: 0,
    };
  }

  componentDidMount() {
    this._handleResize();
    window.addEventListener('resize', () => this._handleResize());
  }

  componentWillUnmount() {
    window.removeEventListener('resize', () => this._handleResize());
  }

  _handleResize = () => {
    this.setState({
      windowHeight: window.innerHeight,
    });
  };

  _renderVerticalAlign = () => {
    const verticalAlignStyle = {
      display: 'table-cell',
      verticalAlign: 'middle',
      width: '100%',
    };

    return <div style={verticalAlignStyle}>{this.props.children}</div>;
  };

  render() {
    const alignVertical = this.props.verticalAlign || this.context.verticalAlign;

    const sectionStyle = {
      width: '100%',
      display: alignVertical ? 'table' : 'block',
      height: this.state.windowHeight,
      maxHeight: this.state.windowHeight,
      overflow: 'auto',
      backgroundColor: this.props.color,
      paddingTop: this.context.sectionPaddingTop,
      paddingBottom: this.context.sectionPaddingBottom,
    };

    return (
      <div
        className={
          this.context.sectionClassName + (this.props.className ? ` ${this.props.className}` : '')
        }
        id={this.props.id}
        style={{ ...sectionStyle, ...this.props.style }}
      >
        {alignVertical ? this._renderVerticalAlign() : this.props.children}
      </div>
    );
  }
}

Section.propTypes = {
  color: PropTypes.string,
};

Section.contextTypes = {
  verticalAlign: PropTypes.bool,
  sectionClassName: PropTypes.string,
  sectionPaddingTop: PropTypes.string,
  sectionPaddingBottom: PropTypes.string,
};

export default Section;
