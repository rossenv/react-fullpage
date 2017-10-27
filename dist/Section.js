'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var React = _interopRequireWildcard(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Section = function (_React$Component) {
  _inherits(Section, _React$Component);

  function Section() {
    _classCallCheck(this, Section);

    var _this = _possibleConstructorReturn(this, (Section.__proto__ || Object.getPrototypeOf(Section)).call(this));

    _this._handleResize = function () {
      _this.setState({
        windowHeight: window.innerHeight
      });
    };

    _this._renderVerticalAlign = function () {
      var verticalAlignStyle = {
        display: 'table-cell',
        verticalAlign: 'middle',
        width: '100%'
      };

      return React.createElement(
        'div',
        { style: verticalAlignStyle },
        _this.props.children
      );
    };

    _this.state = {
      windowHeight: 0
    };
    return _this;
  }

  _createClass(Section, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      this._handleResize();
      window.addEventListener('resize', function () {
        return _this2._handleResize();
      });
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      var _this3 = this;

      window.removeEventListener('resize', function () {
        return _this3._handleResize();
      });
    }
  }, {
    key: 'render',
    value: function render() {
      var alignVertical = this.props.verticalAlign || this.context.verticalAlign;

      var sectionStyle = {
        width: '100%',
        display: alignVertical ? 'table' : 'block',
        height: this.state.windowHeight,
        maxHeight: this.state.windowHeight,
        overflow: 'auto',
        backgroundColor: this.props.color,
        paddingTop: this.context.sectionPaddingTop,
        paddingBottom: this.context.sectionPaddingBottom
      };

      return React.createElement(
        'div',
        {
          className: this.context.sectionClassName + (this.props.className ? ' ' + this.props.className : ''),
          id: this.props.id,
          style: _extends({}, sectionStyle, this.props.style)
        },
        alignVertical ? this._renderVerticalAlign() : this.props.children
      );
    }
  }]);

  return Section;
}(React.Component);

Section.propTypes = {
  color: _propTypes2.default.string
};

Section.contextTypes = {
  verticalAlign: _propTypes2.default.bool,
  sectionClassName: _propTypes2.default.string,
  sectionPaddingTop: _propTypes2.default.string,
  sectionPaddingBottom: _propTypes2.default.string
};

exports.default = Section;