## Location

A `location` object is conceptually similar to `document.location` in web browsers, with a few extra goodies. `location` objects have the following properties:

- `key`
- `pathname`
- `search`
- `state`
- `action`

If you'd like, you can create a `location` object programmatically using `createLocation`.

```js
import { createLocation } from 'history';

var location = createLocation(key, path, state, action);
```
