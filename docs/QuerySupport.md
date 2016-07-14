## Query Support

Support for parsing and serializing [URL queries](Glossary.md#query) is provided by the `useQueries` [enhancer](Glossary.md#createhistoryenhancer) function. Simply use a wrapped version of your `createHistory` function to create your `history` object and you'll have a parsed `location.query` object inside `listen` and `listenBefore` callbacks.

```js
import { createHistory, withQueries } from 'history'

const history = withQueries(createHistory())

history.listen(function (location) {
  console.log(location.query)
})
```

If you need custom query parsing and/or serialization, you can override either using the `parseQueryString` and `stringifyQuery` options, respectively.

```js
const history = withQueries(createHistory(), {
  parse: (queryString) => (
    // TODO: parsed version of queryString
  ),
  stringify: (query) => (
    // TODO: query string created from query
  )
})
```

Query-enhanced histories accept URL queries as the `query` key for `push`, `replace`, `createPath`, and `createHref`.

```js
history.createPath({ pathname: '/the/path', query: { the: 'query' } })
history.push({ pathname: '/the/path', query: { the: 'query' } })
```
