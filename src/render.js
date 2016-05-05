import React from 'react';
import ReactDOM from 'react-dom';
import Baobab from 'baobab';
import Wrapper from './wrapper';

function getInitialTree() {
    let tree;

    if (typeof window !== 'undefined') {
        tree = window.__TREE__;
    }

    return tree || {};
}

export default function (reactElement, container, callback, baobabOptions = {}) {
    const tree = new Baobab(getInitialTree(), baobabOptions);

    const wrappedElement = (
        <Wrapper tree={tree}>
            {reactElement}
        </Wrapper>
    );

    const reactRoot = ReactDOM.render(wrappedElement, container, callback);

    return {
        reactRoot,
        tree,
    };
};
