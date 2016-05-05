import React from 'react';
import { SchemaBranchMixin, BranchMixin } from 'baobab-react-mixins';
import { ResolveMixin } from '../src';
import { getUser, getProfile } from './services';

const Profile = React.createClass({
    displayName: 'Profile',

    mixins: [SchemaBranchMixin, ResolveMixin],

    schema: {
        pk: null,
        profile: {
            data: {},
        },
    },

    getResolve() {
        return [
            {
                cursor: this.cursors.profile,
                getPromise: () => getProfile(this.state.pk),
            },
        ];
    },

    render() {
        return (
            <div>Loaded data</div>
        );
    },
});

export default React.createClass({
    displayName: 'User',

    mixins: [BranchMixin, ResolveMixin],

    cursors: {
        user: ['user'],
    },

    getResolve() {
        return [
            {
                cursor: this.cursors.user,
                getPromise: () => getUser(),
            },
        ];
    },

    render() {
        if (!this.isFullyLoaded()) {
            return null;
        }

        return (
            <Profile tree={this.cursors.user.select('data')} />
        );
    },
});
