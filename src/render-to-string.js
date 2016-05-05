import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom/server';
import Baobab from 'baobab';
import Wrapper from './wrapper';

export default function (reactElement, baobabOptions = {}) {
    return new Promise(function (resolve, reject) {
        const tree = new Baobab(
            {},
            _.merge({}, baobabOptions, {
                immutable: false,
                asynchronous: false,
            })
        );
        const queue = [];
        const wrappedElement = (
            <Wrapper onResolve={(promise) => queue.push(promise)} tree={tree}>
                {reactElement}
            </Wrapper>
        );

        const resolveQueue = () => {
            // Fill queue with promises
            ReactDOM.renderToStaticMarkup(wrappedElement);

            tree.unbindAll();

            if (queue.length) {
                return Promise.all(queue)
                    .then(() => queue.length = 0)
                    .then(resolveQueue);
            }
        };

        resolveQueue()
            .then(() => resolve({
                reactString: ReactDOM.renderToString(wrappedElement),
                initialTree: tree.serialize(),
            }))
            .catch(reject);
    });
};
