import React from 'react';
import ReactDOM from 'react-dom';
import Baobab from 'baobab';
import Wrapper from './wrapper';

export default function (reactElement, container, callback, baobabOptions = {}) {
    const tree = new Baobab(window.__TREE__, baobabOptions);

    const wrappedElement = (
        <Wrapper tree={tree}>
            {reactElement}
        </Wrapper>
    );
    ReactDOM.render(wrappedElement, container, callback);
};
