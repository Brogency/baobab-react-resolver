import React from 'react';
import { renderToString } from '../../src';
import NestedRelations from './components/nested-relations';
import AlwaysFailed from './components/always-failed';
import WithoutResolve from './components/without-resolve';

describe('renderToString', () => {
    it('should resolve first-level resolves', (done) => {
        renderToString(<NestedRelations />).then(({ initialTree }) => {
            initialTree.should.have.deep.property('user.data');

            const user = initialTree.user.data;
            user.pk.should.be.equal(1);
            user.type.should.be.equal('user');

            done();
        });
    });

    it('should resolve nested resolves', (done) => {
        renderToString(<NestedRelations />).then(({ initialTree }) => {
            initialTree.should.have.deep.property('user.data.profile.data');

            const profile = initialTree.user.data.profile.data;
            profile.pk.should.be.equal(1);
            profile.userPk.should.be.equal(1);
            profile.type.should.be.equal('profile');

            profile.should.have.deep.property('settings.data');

            const settings = profile.settings.data;
            settings.pk.should.be.equal(1);
            settings.profilePk.should.be.equal(1);
            settings.type.should.be.equal('settings');

            done();
        });
    });

    it('should fall down in catch if any service is rejected', (done) => {
        renderToString(<AlwaysFailed />).catch(() => done());
    });

    it('should render without errors when resolvers is not used', (done) => {
        renderToString(<WithoutResolve />).then(() => done());
    });
});
