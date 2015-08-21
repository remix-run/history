## Query Support

Support for parsing and serializing URL queries is provided by the `useQueries` enhancer function. Simply use a wrapped version of your `createHistory` function to create your `history` object and you'll have a parsed `location.query` object inside `listen`.

```js
import { createHistory, useQueries } from 'history';

// Use the built-in query parsing/serialization.
var history = useQueries(createHistory)();

// Use custom query parsing/serialization.
var history = useQueries(createHistory)({
  parseQueryString: function (queryString) {
    return qs.parse(queryString);
  },
  stringifyQuery: function (query) {
    return qs.stringify(query, { arrayFormat: 'brackets' });
  }
});

history.listen(function (location) {
  console.log(location.query);
});
```

Query-used histories also accept URL queries as trailing arguments to `pushState`, `replaceState`, `createPath`, and `createHref`.

```js
history.createPath('/the/path', { the: 'query' });
history.pushState(null, '/the/path', { the: 'query' });
```
