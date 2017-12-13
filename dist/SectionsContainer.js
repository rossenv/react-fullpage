'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SectionsContainer = function (_Component) {
	_inherits(SectionsContainer, _Component);

	function SectionsContainer(props) {
		_classCallCheck(this, SectionsContainer);

		var _this = _possibleConstructorReturn(this, (SectionsContainer.__proto__ || Object.getPrototypeOf(SectionsContainer)).call(this, props));

		_this.prevTime = new Date().getTime();
		_this.scrollings = [];

		_this._getAverage = function (elements, number) {
			var sum = 0;

			//taking `number` elements from the end to make the average, if there are not enought, 1
			var lastElements = elements.slice(Math.max(elements.length - number, 1));

			for (var i = 0; i < lastElements.length; i++) {
				sum = sum + lastElements[i];
			}

			return Math.ceil(sum / number);
		};

		_this._removeDefaultEventListeners = function () {
			window.removeEventListener('resize', _this._handleResize);
			window.removeEventListener('hashchange', _this._handleAnchor);

			if (_this.props.arrowNavigation) {
				window.removeEventListener('keydown', _this._handleArrowKeys);
			}
		};

		_this._addCSS3Scroll = function () {
			_this._addOverflowToBody();
			_this._addMouseWheelEventHandlers();
		};

		_this._addActiveClass = function () {
			_this._removeActiveClass();

			var hash = window.location.hash.substring(1);
			var activeLinks = document.querySelectorAll('a[href="#' + hash + '"]');

			for (var i = 0; i < activeLinks.length; i++) {
				activeLinks[i].className = activeLinks[i].className + (activeLinks[i].className.length > 0 ? ' ' : '') + ('' + _this.props.activeClass);
			}
		};

		_this._removeActiveClass = function () {
			var activeLinks = document.querySelectorAll('a:not([href="#' + _this.props.anchors[_this.state.activeSection] + '"])');

			for (var i = 0; i < activeLinks.length; i++) {
				activeLinks[i].className = activeLinks[i].className.replace(/\b ?active/g, '');
			}
		};

		_this._addChildrenWithAnchorId = function () {
			var index = 0;

			return _react2.default.Children.map(_this.props.children, function (child) {
				var id = _this.props.anchors[index];

				index++;

				if (id) {
					return _react2.default.cloneElement(child, {
						id: id
					});
				} else {
					return child;
				}
			});
		};

		_this._addOverflowToBody = function () {
			document.querySelector('body').style.overflow = 'hidden';
		};

		_this._removeOverflowFromBody = function () {
			document.querySelector('body').style.overflow = 'initial';
		};

		_this._addMouseWheelEventHandlers = function () {
			window.addEventListener('mousewheel', _this._handleMouseWheel, false);
			window.addEventListener('DOMMouseScroll', _this._handleMouseWheel, false);
		};

		_this._removeMouseWheelEventHandlers = function () {
			window.removeEventListener('mousewheel', _this._handleMouseWheel);
			window.removeEventListener('DOMMouseScroll', _this._handleMouseWheel);
		};

		_this._handleMouseWheel = function (event) {
			var e = window.event || event; // old IE support
			var value = e.wheelDelta || -e.deltaY || -e.detail;
			var delta = Math.max(-1, Math.min(1, value));
			var activeSection = _this.state.activeSection - delta;

			var curTime = new Date().getTime();

			//Limiting the array to 150 (lets not waste memory!)
			if (_this.scrollings.length > 149) {
				_this.scrollings.shift();
			}

			//keeping record of the previous scrollings
			_this.scrollings.push(Math.abs(value));

			var timeDiff = curTime - _this.prevTime;

			_this.prevTime = curTime;

			if (timeDiff > 150) {
				_this.scrollings = [];
			}

			var avgEnd = _this._getAverage(_this.scrollings, 10);
			var avgMid = _this._getAverage(_this.scrollings, 70);
			var isAccelerating = avgEnd >= avgMid;

			if (!isAccelerating) {
				return false;
			}

			if (_this.state.scrollingStarted || activeSection < 0 || _this._childrenLength === activeSection) {
				return false;
			}

			_this._setAnchor(activeSection);
			_this._handleSectionTransition(activeSection);
			_this._addActiveClass();
		};

		_this._handleResize = function () {
			var started = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

			var position = 0 - _this.state.activeSection * window.innerHeight;

			_this.setState({
				scrollingStarted: started,
				windowHeight: window.innerHeight,
				sectionScrolledPosition: position
			}, function () {
				_this._resetScroll();
			});
		};

		_this._handleSectionTransition = function (index) {
			var position = 0 - index * _this.state.windowHeight;

			if (!_this.props.anchors.length || index === -1 || index >= _this.props.anchors.length) {
				return false;
			}

			_this.setState({
				scrollingStarted: true,
				activeSection: index,
				sectionScrolledPosition: position
			}, function () {
				_this._resetScroll();
				_this._handleScrollCallback();
			});
		};

		_this._handleArrowKeys = function (e) {
			if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
				e.preventDefault(); // Prevent unwanted scrolling on Firefox
			}
			var event = window.event ? window.event : e;
			var activeSection = event.keyCode === 38 || event.keyCode === 37 ? _this.state.activeSection - 1 : event.keyCode === 40 || event.keyCode === 39 ? _this.state.activeSection + 1 : -1;

			if (_this.state.scrollingStarted || activeSection < 0 || _this._childrenLength === activeSection) {
				return false;
			}

			_this._setAnchor(activeSection);
			_this._handleSectionTransition(activeSection);
			_this._addActiveClass();
		};

		_this._handleTouchNav = function () {
			var touchsurface = document.querySelector('.' + _this.props.className),
			    swipedir,
			    startX,
			    startY,
			    dist,
			    distX,
			    distY,
			    threshold = 50,
			    //required min distance traveled to be considered swipe
			restraint = 100,
			    // maximum distance allowed at the same time in perpendicular direction
			allowedTime = 1000,
			    // maximum time allowed to travel that distance
			elapsedTime,
			    startTime,
			    handleswipe = function handleswipe(swipedir) {
				console.log(swipedir);
			};

			touchsurface.addEventListener('touchstart', function (e) {
				var touchobj = e.changedTouches[0];
				swipedir = 'none';
				dist = 0;
				startX = touchobj.pageX;
				startY = touchobj.pageY;
				startTime = new Date().getTime(); // record time when finger first makes contact with surface
				// e.preventDefault()
			}, false);

			touchsurface.addEventListener('touchmove', function (e) {
				e.preventDefault(); // prevent scrolling when inside DIV
			}, false);

			var self = _this;

			touchsurface.addEventListener('touchend', function (e) {
				var touchobj = e.changedTouches[0];
				distX = touchobj.pageX - startX; // get horizontal dist traveled by finger while in contact with surface
				distY = touchobj.pageY - startY; // get vertical dist traveled by finger while in contact with surface
				elapsedTime = new Date().getTime() - startTime; // get time elapsed
				if (elapsedTime <= allowedTime) {
					// first condition for awipe met
					if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint) {
						// 2nd condition for vertical swipe met
						swipedir = distY < 0 ? 'up' : 'down'; // if dist traveled is negative, it indicates up swipe
						var direction = swipedir === 'down' ? self.state.activeSection - 1 : swipedir === 'up' ? self.state.activeSection + 1 : -1;
						var hash = self.props.anchors[direction];

						if (!self.props.anchors.length || hash) {
							window.location.hash = '#' + hash;
						}

						self._handleSectionTransition(direction);
					}
				}
				handleswipe(swipedir);
				// e.preventDefault()
			}, false);
		};

		_this._handleAnchor = function () {
			var hash = window.location.hash.substring(1);
			var activeSection = _this.props.anchors.indexOf(hash);

			if (_this.state.activeSection !== activeSection) {
				_this._handleSectionTransition(activeSection);
				_this._addActiveClass();
			}
		};

		_this._setAnchor = function (index) {
			var hash = _this.props.anchors[index];

			if (!_this.props.anchors.length || hash) {
				window.location.hash = '#' + hash;
			}
		};

		_this._handleScrollCallback = function () {
			if (_this.props.scrollStartFn) {
				setTimeout(function () {
					return _this.props.scrollStartFn(_this.state);
				}, 0);
			}
		};

		_this._resetScroll = function () {
			_this._clearResetScrollTimer();
			_this._resetScrollTimer = setTimeout(function () {
				_this.setState({
					scrollingStarted: false
				});
			}, _this.props.delay + 300);
		};

		_this._clearResetScrollTimer = function () {
			if (_this._resetScrollTimer) {
				clearTimeout(_this._resetScrollTimer);
			}
		};

		_this.renderNavigation = function () {
			var navigationStyle = {
				position: 'fixed',
				zIndex: '10',
				right: '20px',
				top: '50%',
				transform: 'translate(-50%, -50%)'
			};

			var anchors = _this.props.anchors.map(function (link, index) {
				var anchorStyle = {
					display: 'block',
					margin: '10px',
					borderRadius: '100%',
					backgroundColor: '#556270',
					padding: '5px',
					transition: 'all 0.2s',
					transform: _this.state.activeSection === index ? 'scale(1.3)' : 'none'
				};

				return _react2.default.createElement('a', {
					href: '#' + link,
					key: index,
					className: _this.props.navigationAnchorClass || 'Navigation-Anchor',
					style: _this.props.navigationAnchorClass ? null : anchorStyle
				});
			});

			return _react2.default.createElement(
				'div',
				{
					className: _this.props.navigationClass || 'Navigation',
					style: _this.props.navigationClass ? null : navigationStyle
				},
				anchors
			);
		};

		_this.state = {
			activeSection: props.activeSection,
			scrollingStarted: false,
			sectionScrolledPosition: 0,
			windowHeight: 0
		};
		return _this;
	}

	_createClass(SectionsContainer, [{
		key: 'getChildContext',
		value: function getChildContext() {
			return {
				verticalAlign: this.props.verticalAlign,
				sectionClassName: this.props.sectionClassName,
				sectionPaddingTop: this.props.sectionPaddingTop,
				sectionPaddingBottom: this.props.sectionPaddingBottom
			};
		}
	}, {
		key: 'componentWillUnmount',
		value: function componentWillUnmount() {
			this._clearResetScrollTimer();
			this._removeDefaultEventListeners();
			this._removeMouseWheelEventHandlers();
			this._removeOverflowFromBody();
		}
	}, {
		key: 'componentDidMount',
		value: function componentDidMount() {
			this._childrenLength = this.props.children.length;

			this._handleResize(false);
			window.addEventListener('resize', this._handleResize);

			if (!this.props.scrollBar) {
				this._addCSS3Scroll();
				this._handleAnchor(); //Go to anchor in case we found it in the URL

				window.addEventListener('hashchange', this._handleAnchor, false); //Add an event to watch the url hash changes

				if (this.props.arrowNavigation) {
					window.addEventListener('keydown', this._handleArrowKeys);
				}

				if (this.props.touchNavigation) {
					this._handleTouchNav();
				}
			}
		}
	}, {
		key: 'componentWillReceiveProps',
		value: function componentWillReceiveProps(nextProps) {
			if (this.props.activeSection !== nextProps.activeSection) {
				this.setState({ activeSection: nextProps.activeSection });
				this._setAnchor(nextProps.activeSection);
				this._handleSectionTransition(nextProps.activeSection);
				this._addActiveClass();
			}
		}
	}, {
		key: 'componentDidUpdate',
		value: function componentDidUpdate(prevProps, prevState) {
			var _this2 = this;

			if (!this.state.scrollingStarted && prevState.scrollingStarted) {
				if (this.props.scrollEndFn) {
					setTimeout(function () {
						return _this2.props.scrollEndFn(_this2.state);
					}, 0);
				}
			}
		}
	}, {
		key: 'render',
		value: function render() {
			var containerStyle = {
				height: '100%',
				width: '100%',
				position: 'relative',
				transform: 'translate3d(0px, ' + this.state.sectionScrolledPosition + 'px, 0px)',
				transition: 'all ' + this.props.delay + 'ms ease'
			};

			return _react2.default.createElement(
				'div',
				null,
				_react2.default.createElement(
					'div',
					{
						className: this.props.className,
						style: _extends({}, containerStyle, this.props.style)
					},
					this.props.scrollBar ? this._addChildrenWithAnchorId() : this.props.children
				),
				this.props.navigation && !this.props.scrollBar ? this.renderNavigation() : null
			);
		}
	}]);

	return SectionsContainer;
}(_react.Component);

exports.default = SectionsContainer;


SectionsContainer.defaultProps = {
	scrollStartFn: null,
	scrollEndFn: null,
	delay: 1000,
	verticalAlign: false,
	scrollBar: false,
	navigation: true,
	className: 'SectionContainer',
	sectionClassName: 'Section',
	anchors: [],
	activeClass: 'active',
	sectionPaddingTop: '0',
	sectionPaddingBottom: '0',
	arrowNavigation: true,
	activeSection: 0,
	touchNavigation: true
};

SectionsContainer.propTypes = {
	scrollStartFn: _propTypes2.default.func,
	scrollEndFn: _propTypes2.default.func,
	delay: _propTypes2.default.number,
	verticalAlign: _propTypes2.default.bool,
	scrollBar: _propTypes2.default.bool,
	navigation: _propTypes2.default.bool,
	className: _propTypes2.default.string,
	sectionClassName: _propTypes2.default.string,
	navigationClass: _propTypes2.default.string,
	navigationAnchorClass: _propTypes2.default.string,
	activeClass: _propTypes2.default.string,
	sectionPaddingTop: _propTypes2.default.string,
	sectionPaddingBottom: _propTypes2.default.string,
	arrowNavigation: _propTypes2.default.bool,
	activeSection: _propTypes2.default.number,
	touchNavigation: _propTypes2.default.bool
};

SectionsContainer.childContextTypes = {
	verticalAlign: _propTypes2.default.bool,
	sectionClassName: _propTypes2.default.string,
	sectionPaddingTop: _propTypes2.default.string,
	sectionPaddingBottom: _propTypes2.default.string
};