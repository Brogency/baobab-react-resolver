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
                service: this.props.service,
                alwaysLoad: this.props.alwaysLoad,
            },
        ];
    },

    render() {
        return (
            <div></div>
        );
    },
});
