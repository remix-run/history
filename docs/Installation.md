# Installation

The history library is published to the public [npm](https://www.npmjs.com/) registry. You can install it using:

    $ npm install --save history

Then, use as you would anything else:

```js
// using ES6 modules
import { createBrowserHistory } from 'history';

// using CommonJS modules
var createBrowserHistory = require('history').createBrowserHistory;
```

## Using Globals

If you really just want a `<script>` tag, the UMD build is available on [unpkg](https://unpkg.com):

```html
<script src="https://unpkg.com/history"></script>
```

You can find the library on `window.History`.
