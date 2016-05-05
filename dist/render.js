'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (reactElement, container, callback) {
    var baobabOptions = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

    var tree = new _baobab2.default(getInitialTree(), baobabOptions);

    var wrappedElement = _react2.default.createElement(
        _wrapper2.default,
        { tree: tree },
        reactElement
    );

    var reactRoot = _reactDom2.default.render(wrappedElement, container, callback);

    return {
        reactRoot: reactRoot,
        tree: tree
    };
};

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _baobab = require('baobab');

var _baobab2 = _interopRequireDefault(_baobab);

var _wrapper = require('./wrapper');

var _wrapper2 = _interopRequireDefault(_wrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getInitialTree() {
    var tree = void 0;

    if (typeof window !== 'undefined') {
        tree = window.__TREE__;
    }

    return tree || {};
}

;