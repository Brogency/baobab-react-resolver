import React from 'react';
import { RootMixin } from 'baobab-react-mixins';

export default React.createClass({
    mixins: [RootMixin],

    childContextTypes: {
        onResolve: React.PropTypes.func,
    },

    getChildContext() {
        return {
            onResolve: this.props.onResolve,
        };
    },

    render() {
        return this.props.children;
    },
});
