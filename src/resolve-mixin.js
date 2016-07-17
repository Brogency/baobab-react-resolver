import React from 'react';
import _ from 'lodash';
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

export default {
    displayName: 'ResolveMixin',

    contextTypes: {
        onResolve: React.PropTypes.func,
    },

    componentWillMount() {
        this.resolve();
    },

    resolve(force = false) {
        // onResolve exists only on renderToString
        const inRenderToString = _.isFunction(this.context.onResolve);

        // renderToString is used only on server render side
        const renderSide = inRenderToString ? 'server' : 'client';

        const toResolve = this.getResolverBindings();

        _.forEach(toResolve, (item) => {
            const { cursor, service, merge } = item;

            /* istanbul ignore next */
            if (!cursor) {
                throw Exception('baobab-react-resolver: cursor is not set');
            }

            /* istanbul ignore next */
            if (!_.isFunction(service)) {
                throw Exception('baobab-react-resolver: service is not function');
            }

            const alwaysLoad = inRenderToString ? false : item.alwaysLoad;
            const initialData = item.initialData || null;

            const cursorValue = cursor.get();
            const isLoaded = _.get(cursorValue, 'isLoaded');
            const initiator = _.get(cursorValue, 'initiator');

            if (isLoaded && initiator != renderSide) {
                cursor.set('initiator', renderSide);

                return true;
            }

            if (!_.isObject(cursor.get())) {
                // Set initial structure
                cursor.set({
                    isLoaded: false,
                    isLoading: false,
                });
            }

            if (!cursor.exists('data')) {
                // Set initial data
                cursor.set('data', initialData);
            }

            if (force || alwaysLoad || !isLoaded) {
                cursor.set('isLoading', true);

                const promise = service()
                    .then((data) => {
                        if (_.isFunction(item.transform)) {
                            data = item.transform(data);
                        }

                        cursor.merge({
                            isLoaded: true,
                            isLoading: false,
                            initiator: renderSide,
                        });

                        if (merge && _.isObject(cursor.get('data'))) {
                            cursor.merge('data', data);
                        } else {
                            cursor.set('data', data);
                        }

                        return Promise.resolve(data);
                    })
                    .catch((err) => {
                        cursor.set('isLoading', false);

                        return Promise.reject(err);
                    });

                if (inRenderToString) {
                    this.context.onResolve(promise);
                }

                return promise;
            }

            return true;
        });
    },

    isFullyLoaded() {
        const toResolve = this.getResolverBindings();

        return _.every(toResolve, item => item.cursor.get('isLoaded'));
    },

    isLoading() {
        const toResolve = this.getResolverBindings();

        return _.some(toResolve, item => item.cursor.get('isLoading'));
    },
};
