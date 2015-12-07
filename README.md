# history [![Travis][build-badge]][build] [![npm package][npm-badge]][npm]

[`history`](https://www.npmjs.com/package/history) is a JavaScript library that lets you easily manage session history in browsers, testing environments, and (soon, via [React Native](https://facebook.github.io/react-native/)) native devices. `history` abstracts away the differences in these different platforms and provides a minimal API that lets you manage the history stack, navigate, confirm navigation, and persist state between sessions. `history` is library-agnostic and may easily be included in any JavaScript project.

[![Coveralls][coveralls-badge]][coveralls]
[![Discord][discord-badge]][discord]

## Docs & Help

- [Guides and API Docs](/docs#readme)
- [Changelog](/CHANGES.md)
- [Stack Overflow](http://stackoverflow.com/questions/tagged/react-router)

For questions and support, please visit [our channel on Reactiflux](https://discord.gg/0ZcbPKXt5bYaNQ46) or [Stack Overflow](http://stackoverflow.com/questions/tagged/react-router). The issue tracker is *exclusively* for bug reports and feature requests.

## Installation

Using [npm](https://www.npmjs.com/):

    $ npm install history

Then with a module bundler like [webpack](https://webpack.github.io/), use as you would anything else:

```js
// using an ES6 transpiler, like babel
import { createHistory } from 'history'

// not using an ES6 transpiler
var createHistory = require('history').createHistory
```

The UMD build is also available on [npmcdn](https://npmcdn.com):

```html
<script src="https://npmcdn.com/history/umd/History.min.js"></script>
```

You can find the library on `window.History`.

## Basic Usage

A "history" encapsulates navigation between different screens in your app, and notifies listeners when the current screen changes.

```js
import { createHistory } from 'history'

let history = createHistory()

// Listen for changes to the current location. The
// listener is called once immediately.
let unlisten = history.listen(location => {
  console.log(location.pathname)
})

history.push({
  pathname: '/the/path',
  search: '?a=query',
  state: { the: 'state' }
})

// When you're finished, stop the listener.
unlisten()
```

You can find many more examples [in the documentation](https://github.com/rackt/history/tree/master/docs)!

## Thanks

A big thank-you to [Dan Shaw](https://www.npmjs.com/~dshaw) for letting us use the `history` npm package name! Thanks Dan!

Also, thanks to [BrowserStack](https://www.browserstack.com/) for providing the infrastructure that allows us to run our build in real browsers.

[build-badge]: https://img.shields.io/travis/rackt/history/master.svg?style=flat-square
[build]: https://travis-ci.org/rackt/history

[npm-badge]: https://img.shields.io/npm/v/history.svg?style=flat-square
[npm]: https://www.npmjs.org/package/history

[coveralls-badge]: https://img.shields.io/coveralls/rackt/history/master.svg?style=flat-square
[coveralls]: https://coveralls.io/github/rackt/history

[discord-badge]: https://img.shields.io/badge/Discord-join%20chat%20%E2%86%92-738bd7.svg?style=flat-square
[discord]: https://discord.gg/0ZcbPKXt5bYaNQ46
