import React from 'react';
import { SchemaBranchMixin, BranchMixin } from 'baobab-react-mixins';
import { ResolveMixin } from '../../../src';
import { getUser, getProfile, getSettings } from '../../services';

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

    getResolverBindings() {
        return [
            {
                cursor: this.cursors.settings,
                service: () => getSettings(this.state.pk),
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

    getResolverBindings() {
        return [
            {
                cursor: this.cursors.profile,
                service: () => getProfile(this.state.pk),
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

    getResolverBindings() {
        return [
            {
                cursor: this.cursors.user,
                service: getUser,
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
