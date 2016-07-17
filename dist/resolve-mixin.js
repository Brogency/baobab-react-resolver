'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*

 [
     {
         cursor: [required] cursor,
         service: [required] Function: which returns promise,
         alwaysLoad: [optional, default=false] Boolean: always load data via promise call,
         initialData: [optional, default=null] Any,
         merge: [optional, default=false] Use merge instead of set for data,
         transform: [optional, deprecated] Function: transforms data, called only on load,
     }
 ]
 */

exports.default = {
    displayName: 'ResolveMixin',

    contextTypes: {
        onResolve: _react2.default.PropTypes.func
    },

    componentWillMount: function componentWillMount() {
        this.resolve();
    },
    resolve: function resolve() {
        var _this = this;

        var force = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

        // onResolve exists only on renderToString
        var inRenderToString = _lodash2.default.isFunction(this.context.onResolve);

        // renderToString is used only on server render side
        var renderSide = inRenderToString ? 'server' : 'client';

        var toResolve = this.getResolverBindings();

        _lodash2.default.forEach(toResolve, function (item) {
            var cursor = item.cursor;
            var service = item.service;
            var merge = item.merge;

            /* istanbul ignore next */

            if (!cursor) {
                throw Exception('baobab-react-resolver: cursor is not set');
            }

            /* istanbul ignore next */
            if (!_lodash2.default.isFunction(service)) {
                throw Exception('baobab-react-resolver: service is not function');
            }

            var alwaysLoad = inRenderToString ? false : item.alwaysLoad;
            var initialData = item.initialData || null;

            var cursorValue = cursor.get();
            var isLoaded = _lodash2.default.get(cursorValue, 'isLoaded');
            var initiator = _lodash2.default.get(cursorValue, 'initiator');

            if (isLoaded && initiator != renderSide) {
                cursor.set('initiator', renderSide);

                return true;
            }

            if (!_lodash2.default.isObject(cursor.get())) {
                // Set initial structure
                cursor.set({
                    isLoaded: false,
                    isLoading: false
                });
            }

            if (!cursor.exists('data')) {
                // Set initial data
                cursor.set('data', initialData);
            }

            if (force || alwaysLoad || !isLoaded) {
                cursor.set('isLoading', true);

                var promise = service().then(function (data) {
                    if (_lodash2.default.isFunction(item.transform)) {
                        data = item.transform(data);
                    }

                    cursor.merge({
                        isLoaded: true,
                        isLoading: false,
                        initiator: renderSide
                    });

                    if (merge && _lodash2.default.isObject(cursor.get('data'))) {
                        cursor.merge('data', data);
                    } else {
                        cursor.set('data', data);
                    }

                    return Promise.resolve(data);
                }).catch(function (err) {
                    cursor.set('isLoading', false);

                    return Promise.reject(err);
                });

                if (inRenderToString) {
                    _this.context.onResolve(promise);
                }

                return promise;
            }

            return true;
        });
    },
    isFullyLoaded: function isFullyLoaded() {
        var toResolve = this.getResolverBindings();

        return _lodash2.default.every(toResolve, function (item) {
            return item.cursor.get('isLoaded');
        });
    },
    isLoading: function isLoading() {
        var toResolve = this.getResolverBindings();

        return _lodash2.default.some(toResolve, function (item) {
            return item.cursor.get('isLoading');
        });
    }
};