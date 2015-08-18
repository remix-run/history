## Query Support

Support for parsing and serializing URL queries is provided by the `enableQueries` function. Simply use a wrapped version of your `createHistory` function to create your `history` object and you'll have a parsed `location.query` object inside `listen`.

```js
import { createHistory, enableQueries } from 'history';

var history = enableQueries(createHistory)();

history.listen(function (location) {
  console.log(location.query);
});
```

Query-enabled histories also accept URL queries as trailing arguments to `pushState`, `replaceState`, and `createHref`.

```js
history.pushState(null, '/the/path', { the: 'query' }); // /the/path?the=query
```
