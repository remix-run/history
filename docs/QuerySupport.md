## Query Support

Support for parsing and serializing [URL queries](Glossary.md#query) is provided by the `useQueries` [enhancer](Glossary.md#createhistoryenhancer) function. Simply use a wrapped version of your `createHistory` function to create your `history` object and you'll have a parsed `location.query` object inside `listen` and `listenBefore` callbacks.

```js
import { createHistory, useQueries } from 'history'

const history = useQueries(createHistory)()

history.listen(function (location) {
  console.log(location.query)
})
```

If you need custom query parsing and/or serialization, you can override either using the `parseQueryString` and `stringifyQuery` options, respectively.

```js
const history = useQueries(createHistory)({
  parseQueryString: function (queryString) {
    // TODO: return a parsed version of queryString
  },
  stringifyQuery: function (query) {
    // TODO: return a query string created from query
  }
})
```

Query-enhanced histories accept URL queries as trailing arguments to `createPath`, and `createHref`, and accept `query` as a key for `push` and `replace`.

```js
history.createPath('/the/path', { the: 'query' })
history.push({ pathname: '/the/path', query: { the: 'query' } })
```
