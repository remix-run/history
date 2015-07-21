## Location

A `location` object is conceptually similar to `document.location` in web browsers, with a few extra goodies. `location` objects have the following properties:

```
pathname      The pathname portion of the URL, without query string
search        The query string portion of the URL, including the ?
state         An object of data tied to this location
action        One of PUSH, REPLACE, or POP
key           A unique identifier for this location
```

If you'd like, you can create a `location` object programmatically using `createLocation`.

```js
import { createLocation } from 'history';

var location = createLocation('/a/path?a=query', { some: 'state' });
```
