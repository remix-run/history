## Location

A [`location` object](Glossary.md#location) is conceptually similar to [`document.location` in web browsers](https://developer.mozilla.org/en-US/docs/Web/API/Document/location), with a few extra goodies. `location` objects have the following properties:

```
pathname      The pathname portion of the URL, without query string
search        The query string portion of the URL, including the ?
state         An object of data tied to this location
action        One of PUSH, REPLACE, or POP
key           A unique identifier for this location
```

Support for query string parsing is provided using the [`useQueries` module](QuerySupport.md).

### Location Descriptors

[Location descriptors](Glossary.md#locationdescriptor) can be either objects or path strings. As objects, they are like `location` objects, except they ignore the internally-generated `action` and `key` fields.

You can use location descriptors to call `history.push` and `history.replace`. Location descriptor objects can define just the portions of the next `location` that you want to set. They can also extend an existing `location` object to change only specific fields on that `location`.

```js
// Pushing a path string.
history.push('/the/path')

// Omitting location state when pushing a location descriptor.
history.push({ pathname: '/the/path', search: '?the=search' })

// Extending an existing location object.
history.push({ ...location, search: '?other=search' })
```

### Programmatic Creation

You may occasionally need to create a `location` object, either for testing or when using `history` in a stateless, non-DOM environment (i.e. a server). In these cases, you can use the `createLocation` method directly:

```js
import { createLocation } from 'history'

const location = createLocation('/a/path?a=query', { the: 'state' })
```

Alternatively, you can use a `history` object's `createLocation` method:

```js
const location = history.createLocation('/a/path?a=query', { the: 'state' })
```

`location` objects created in this way will get a default `key` property that is generated using `history.createKey()`.
