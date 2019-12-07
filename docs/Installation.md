# Installation

The history library is published to the public [npm](https://www.npmjs.com/) registry. You can install it using:

    $ npm install --save history

Then, use as you would anything else:

```js
// using ES6 modules
import history from 'history/browser';

// using CommonJS modules
var history = require('history/browser');
```

## Using Globals

If you really just want a `<script>` tag, the UMD build is available on [unpkg](https://unpkg.com):

```html
<script src="https://unpkg.com/history"></script>
```

You can find the library on `window.HistoryLibrary`, which is an object with the following properties:

- `browserHistory` - The browser history singleton
- `hashHistory` - The hash history singleton
- `createBrowserHistory`
- `createHashHistory`
- `createMemoryHistory`
