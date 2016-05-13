import _ from 'lodash';
import React from 'react';
import { renderToString, render } from '../../src';
import Transform from './components/transform';
import AlwaysLoad from './components/always-load';

function renderAlwaysLoad(alwaysLoad, initialTree) {
    const promise = new Promise((resolve, reject) => resolve({
        pk: 1000,
    }));

    const container = document.createElement('div');
    document.body.appendChild(container);
    window.__TREE__ = initialTree;

    const { tree } = render(
        <AlwaysLoad alwaysLoad={alwaysLoad}
            service={() => promise} />,
        container,
        null,
        { asynchronous: false }
    );

    return {
        promise,
        tree,
    };
}

describe('ResolveMixin', () => {
    it('should transform data correctly before set into cursor', (done) => {
        renderToString(<Transform />).then(({ initialTree }) => {
            initialTree.should.have.deep.property('user.data');

            const user = initialTree.user.data;
            user.pk.should.be.equal(1);
            user.type.should.be.equal('user');
            user.should.have.property('fromTransform');
            user.fromTransform.should.be.equal('from transform');

            done();
        });
    });

    it('should do not load data again if alwaysLoad is true and data loaded from server', (done) => {
        const initialTree = {
            user: {
                data: {
                    pk: 1,
                },
                initiator: 'server',
                isLoaded: true,
            },

        };

        const { promise, tree } = renderAlwaysLoad(true, initialTree);
        promise.then(() => {
            initialTree.user.data.pk.should.be.equal(tree.get('user', 'data', 'pk'));
            done();
        });
    });

    it('should load data again if alwaysLoad is true and data loaded from client', (done) => {
        const initialTree = {
            user: {
                data: {
                    pk: 1,
                },
                initiator: 'client',
                isLoaded: true,
            },

        };

        const { promise, tree } = renderAlwaysLoad(true, initialTree);
        promise.then(() => {
            initialTree.user.data.pk.should.not.be.equal(tree.get('user', 'data', 'pk'));
            done();
        });
    });

    it('should do not load data again if alwaysLoad is false and data loaded from server', (done) => {
        const initialTree = {
            user: {
                data: {
                    pk: 1,
                },
                initiator: 'server',
                isLoaded: true,
            },

        };

        const { promise, tree } = renderAlwaysLoad(false, initialTree);
        promise.then(() => {
            initialTree.user.data.pk.should.be.equal(tree.get('user', 'data', 'pk'));
            done();
        });
    });

    it('should do not load data again if alwaysLoad is false and data loaded from client', (done) => {
        const initialTree = {
            user: {
                data: {
                    pk: 1,
                },
                initiator: 'client',
                isLoaded: true,
            },
        };

        const { promise, tree } = renderAlwaysLoad(false, initialTree);
        promise.then(() => {
            initialTree.user.data.pk.should.be.equal(tree.get('user', 'data', 'pk'));
            done();
        });
    });
});
