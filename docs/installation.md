# Installation

The history library is published to the public [npm](https://www.npmjs.com/)
registry. You can install it using:

    $ npm install --save history

## Using a Bundler

The best way to use the `history` library is with a bundler that supports
JavaScript modules (we recommend [Rollup](https://rollupjs.org)). Then, you can
write your code naturally, like:

```js
import { createBrowserHistory } from 'history';
// ...
```

If you're using a bundler that does not support dead code removal, or you're not
sure if your bundler supports dead code removal, we also publish
environment-specific builds you can use to get just the code you need. You can
use one of the following bundles:

- `history/browser`
- `history/hash`
- `history/memory`

Each of these bundles contains a subset of the code specific to that
environment.

```js
// Import only the code needed to create a browser history
import { createBrowserHistory } from 'history/browser';

// Import only the code needed to create a memory history
import { createMemoryHistory } from 'history/memory';
```

If you're using a bundler that doesn't understand JavaScript modules and only
understands CommonJS, you can use `require` as you would with anything else:

```js
var createBrowserHistory = require('history').createBrowserHistory;
```

## Using `<script>` Tags

If you'd like to load the library in a browser via a `<script>` tag, you can
load it from [unpkg](https://unpkg.com). If you're in a browser that supports
[JavaScript
modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules),
just use the `history.production.min.js` build:

```html
<script type="module">
import { createBrowserHistory } from 'https://unpkg.com/history/history.production.min.js';
// ...
</script>
```

The `history.development.js` build is also available for non-production apps.

In legacy browsers that do not yet support JavaScript modules, you can use one
of our UMD (global) builds:

```html
<script src="https://unpkg.com/history/umd/history.production.min.js"></script>
```

You can find the library on `window.HistoryLibrary`.
