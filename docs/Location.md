## Location

A [`location` object](Terms.md#location) is conceptually similar to [`document.location` in web browsers](https://developer.mozilla.org/en-US/docs/Web/API/Document/location), with a few extra goodies. `location` objects have the following properties:

```
pathname      The pathname portion of the URL, without query string
search        The query string portion of the URL, including the ?
state         An object of data tied to this location
action        One of PUSH, REPLACE, or POP
key           A unique identifier for this location
```

Support for query string parsing is provided using the [`useQueries` module](QuerySupport.md).

### Programmatic Creation

You may occasionally need to create a `location` object, either for testing or when using `history` in a stateless environment (like a server). `history` exposes the `createLocation` API for this purpose.

```js
import createLocation from 'history/lib/createLocation'

let location = createLocation('/a/path?a=query', { the: 'state' })
```
