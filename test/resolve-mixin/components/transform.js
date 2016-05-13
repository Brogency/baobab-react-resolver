import React from 'react';
import { BranchMixin } from 'baobab-react-mixins';
import { ResolveMixin } from '../../../src';
import { getUser } from '../../services';

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
                transform: this.transformUser,
            },
        ];
    },

    transformUser({ pk, type }) {
        return {
            pk,
            type,
            fromTransform: 'from transform',
        };
    },

    render() {
        return (
            <div></div>
        );
    },
});
