import _ from 'lodash';
import React from 'react';
import { renderToString, render } from '../../src';
import Transform from './components/transform';
import AlwaysLoad from './components/always-load';

function renderAlwaysLoad(alwaysLoad, initialTree, itemOptions = {}) {
    const promise = new Promise((resolve, reject) => resolve({
        pk: 1000,
    }));

    const container = document.createElement('div');
    document.body.appendChild(container);
    window.__TREE__ = initialTree;

    const { tree } = render(
        <AlwaysLoad alwaysLoad={alwaysLoad}
            service={() => promise}
            {...itemOptions}
        />,
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

    it('should set data correctly for empty cursor', (done) => {
        const initialTree = {
            user: {},
        };

        const { promise, tree } = renderAlwaysLoad(true, initialTree);
        promise.then(() => {
            tree.get('user').should.be.deep.equal({
                data: {
                    pk: 1000,
                },
                isLoaded: true,
                isLoading: false,
                initiator: 'client',
            });
            done();
        });
    });

    it('should set data correctly for not-object cursor', (done) => {
        const initialTree = {
            user: null,
        };

        const { promise, tree } = renderAlwaysLoad(true, initialTree);
        promise.then(() => {
            tree.get('user').should.be.deep.equal({
                data: {
                    pk: 1000,
                },
                isLoaded: true,
                isLoading: false,
                initiator: 'client',
            });
            done();
        });
    });

    it('should merge data if merge is true', (done) => {
        const initialTree = {
            user: {
                data: {
                    pk: 999,
                    existingInData: true,
                },
                existing: true,
            },
        };

        const { promise, tree } = renderAlwaysLoad(true, initialTree, { merge: true });
        promise.then(() => {
            tree.get('user').should.be.deep.equal({
                data: {
                    pk: 1000,
                    existingInData: true,
                },
                existing: true,
                isLoaded: true,
                isLoading: false,
                initiator: 'client',
            });
            done();
        });
    });

    it('should override data if merge is false', (done) => {
        const initialTree = {
            user: {
                data: {
                    pk: 999,
                    existingInData: true,
                },
                existing: true,
            },
        };

        const { promise, tree } = renderAlwaysLoad(true, initialTree, { merge: false });
        promise.then(() => {
            tree.get('user').should.be.deep.equal({
                data: {
                    pk: 1000,
                },
                existing: true,
                isLoaded: true,
                isLoading: false,
                initiator: 'client',
            });
            done();
        });
    });

    it('should not load data again if alwaysLoad is true and data loaded from server', (done) => {
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

    it('should not load data again if alwaysLoad is false and data loaded from server', (done) => {
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

    it('should not load data again if alwaysLoad is false and data loaded from client', (done) => {
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
