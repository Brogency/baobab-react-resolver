import React from 'react';
import { BranchMixin } from 'baobab-react-mixins';
import { ResolveMixin } from '../../../src';

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
                service: () => new Promise((resolve, reject) => reject()),
            },
        ];
    },

    render() {
        return (
            <div></div>
        );
    },
});
