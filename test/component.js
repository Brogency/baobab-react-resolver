import React from 'react';
import { SchemaBranchMixin, BranchMixin } from 'baobab-react-mixins';
import { ResolveMixin } from '../src';
import { getUser, getProfile, getSettings } from './services';

const Profile = React.createClass({
    displayName: 'Profile',

    mixins: [SchemaBranchMixin, ResolveMixin],

    schema: {
        userPk: null,
        pk: null,
        settings: {
            data: {},
        },
    },

    getResolve() {
        return [
            {
                cursor: this.cursors.settings,
                getPromise: () => getSettings(this.state.pk),
            },
        ];
    },

    render() {
        return (
            <div>Loaded data</div>
        );
    },
});

const User = React.createClass({
    displayName: 'User',

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
        if (!this.isFullyLoaded()) {
            return null;
        }

        return (
            <Profile tree={this.cursors.profile.select('data')} />
        );
    },
});

export default React.createClass({
    displayName: 'RootComponent',

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
            <User tree={this.cursors.user.select('data')} />
        );
    },
});
