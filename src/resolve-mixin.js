import React from 'react';
import _ from 'lodash';
/*

 [
     {
         cursor: [required] cursor,
         getPromise: [required] Function: which returns promise,
         alwaysLoad: [optional] Boolean: always load data via promise call
     }
 ]
 */

const __SERVER__ = typeof window === 'undefined';

const INITIATOR = __SERVER__ ? 'server' : 'client';

export default {
    displayName: 'ResolveMixin',

    contextTypes: {
        onResolve: React.PropTypes.func,
    },

    componentWillMount() {
        const toResolve = this.getResolve();

        _.forEach(toResolve, item => {
            const cursor = item.cursor;
            const cursorValue = cursor.get();
            const isLoaded = _.get(cursorValue, 'isLoaded');
            const initiator = _.get(cursorValue, 'initiator');

            if (isLoaded && initiator != INITIATOR) {
                cursor.set('initiator', INITIATOR);
                return true;
            }

            if (item.alwaysLoad || !isLoaded) {
                const promise = item.getPromise()
                    .then(data => {
                        cursor.set({
                            isLoaded: true,
                            initiator: INITIATOR,
                            data,
                        });
                    });

                if (_.isFunction(this.context.onResolve)) {
                    this.context.onResolve(promise);
                }

                return promise;
            }

            return true;
        });
    },

    isFullyLoaded() {
        const toResolve = this.getResolve();

        return _.every(toResolve, item => item.cursor.get('isLoaded'));
    },
};
