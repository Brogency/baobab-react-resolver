import React from 'react';
import { renderToString } from '../src';
import User from './component';

describe('renderToString', () => {
    it('should resolve nested resolves', (done) => {
        renderToString(<User />).then(({ initialTree }) => {
            initialTree.should.have.deep.property('user.data.profile.data');

            initialTree.user.data.profile.data.should.be.equal({
                pk: 1,
                type: 'profile',
                userPk: 1,
            });
            done();
        });
    });
});
