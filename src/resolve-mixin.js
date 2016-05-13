import React from 'react';
import _ from 'lodash';
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

export default {
    displayName: 'ResolveMixin',

    contextTypes: {
        onResolve: React.PropTypes.func,
    },

    componentWillMount() {
        this.resolve();
    },

    resolve() {
        // onResolve exists only on renderToString
        const inRenderToString = _.isFunction(this.context.onResolve);

        // renderToString is used only on server render side
        const renderSide = inRenderToString ? 'server' : 'client';

        const toResolve = this.getResolve();

        _.forEach(toResolve, item => {
            const cursor = item.cursor;
            const alwaysLoad = inRenderToString ? false : item.alwaysLoad;

            const cursorValue = cursor.get();
            const isLoaded = _.get(cursorValue, 'isLoaded');
            const initiator = _.get(cursorValue, 'initiator');

            if (isLoaded && initiator != renderSide) {
                cursor.set('initiator', renderSide);
                return true;
            }

            if (alwaysLoad || !isLoaded) {
                const promise = item.service()
                    .then(data => {
                        if (_.isFunction(item.transform)) {
                            data = item.transform(data);
                        }

                        cursor.set({
                            isLoaded: true,
                            initiator: renderSide,
                            data,
                        });
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
        const toResolve = this.getResolve();

        return _.every(toResolve, item => item.cursor.get('isLoaded'));
    },
};
