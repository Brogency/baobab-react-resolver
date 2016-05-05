'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _baobabReactMixins = require('baobab-react-mixins');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _react2.default.createClass({
    displayName: 'wrapper',

    mixins: [_baobabReactMixins.RootMixin],

    childContextTypes: {
        onResolve: _react2.default.PropTypes.func
    },

    getChildContext: function getChildContext() {
        return {
            onResolve: this.props.onResolve
        };
    },
    render: function render() {
        return this.props.children;
    }
});