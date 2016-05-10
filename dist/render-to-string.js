'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (reactElement) {
    var baobabOptions = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    return new Promise(function (resolve, reject) {
        var tree = new _baobab2.default({}, _lodash2.default.merge({}, baobabOptions, {
            immutable: false,
            asynchronous: false
        }));
        var queue = [];
        var wrappedElement = _react2.default.createElement(
            _wrapper2.default,
            { onResolve: function onResolve(promise) {
                    return queue.push(promise);
                }, tree: tree },
            reactElement
        );

        var resolveQueue = function resolveQueue() {
            // Fill queue with promises
            _server2.default.renderToStaticMarkup(wrappedElement);

            tree.unbindAll();

            if (queue.length) {
                return Promise.all(queue).then(function () {
                    return queue.length = 0;
                }).then(resolveQueue);
            }

            return Promise.resolve();
        };

        resolveQueue().then(function () {
            return resolve({
                reactString: _server2.default.renderToString(wrappedElement),
                initialTree: tree.serialize()
            });
        }).catch(reject);
    });
};

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _server = require('react-dom/server');

var _server2 = _interopRequireDefault(_server);

var _baobab = require('baobab');

var _baobab2 = _interopRequireDefault(_baobab);

var _wrapper = require('./wrapper');

var _wrapper2 = _interopRequireDefault(_wrapper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;