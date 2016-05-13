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
         alwaysLoad: [optional] Boolean: always load data via promise call,
         transform: [optional] Function: transforms data, called only on load
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

        // onResolve exists only on renderToString
        var inRenderToString = _lodash2.default.isFunction(this.context.onResolve);

        // renderToString is used only on server render side
        var renderSide = inRenderToString ? 'server' : 'client';

        var toResolve = this.getResolve();

        _lodash2.default.forEach(toResolve, function (item) {
            var cursor = item.cursor;
            var alwaysLoad = inRenderToString ? false : item.alwaysLoad;

            var cursorValue = cursor.get();
            var isLoaded = _lodash2.default.get(cursorValue, 'isLoaded');
            var initiator = _lodash2.default.get(cursorValue, 'initiator');

            if (isLoaded && initiator != renderSide) {
                cursor.set('initiator', renderSide);
                return true;
            }

            if (alwaysLoad || !isLoaded) {
                var promise = item.service().then(function (data) {
                    if (_lodash2.default.isFunction(item.transform)) {
                        data = item.transform(data);
                    }

                    cursor.set({
                        isLoaded: true,
                        initiator: renderSide,
                        data: data
                    });
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
        var toResolve = this.getResolve();

        return _lodash2.default.every(toResolve, function (item) {
            return item.cursor.get('isLoaded');
        });
    }
};