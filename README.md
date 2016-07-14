[![Build Status](https://travis-ci.org/Brogency/baobab-react-resolver.svg)](https://travis-ci.org/Brogency/baobab-react-resolver)
[![Coverage Status](https://coveralls.io/repos/github/Brogency/baobab-react-resolver/badge.svg?branch=master)](https://coveralls.io/github/Brogency/baobab-react-resolver?branch=master)
[![npm version](https://badge.fury.io/js/baobab-react-resolver.svg)](https://badge.fury.io/js/baobab-react-resolver)


baobab-react-resolver
=========

Promise resolver for Baobab + React powered applications.

Based on [Baobab cursors](https://github.com/Yomguithereal/baobab).

## Installation

  npm install --save baobab baobab-react baobab-react-schemabranchmixin baobab-react-resolver

## Example

```
import React from 'react';
import { ResolveMixin } from 'baobab-react-resolver';
import { SchemaBranchMixin } from 'baobab-react-mixins';
import { getDataFromApi } from 'api'

export default React.createClass({
  displayName: 'Component',

  mixins: [SchemaBranchMixin, ResolveMixin],

  schema: {
    response: {
      data: {
        count: 0,
      },
    }
  },

  getResolverBindings() {
    return [
      {
        cursor: this.cursors.response,
        service: getDataFromApi,
      },
    ];
  },

  render() {
    return (
      <div>
        {JSON.stringify({this.state.response})}
      </div>
    )
  },
});

```


## Tests

  npm test
