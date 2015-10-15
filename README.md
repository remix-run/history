# history

[![build status](https://img.shields.io/travis/rackt/history/master.svg?style=flat-square)](https://travis-ci.org/rackt/history)
[![npm package](https://img.shields.io/npm/v/history.svg?style=flat-square)](https://www.npmjs.org/package/history)
[![#rackt on freenode](https://img.shields.io/badge/irc-rackt_on_freenode-61DAFB.svg?style=flat-square)](https://webchat.freenode.net/)

[`history`](https://www.npmjs.com/package/history) is a JavaScript library that lets you easily manage session history in browsers, testing environments, and (soon, via [React Native](https://facebook.github.io/react-native/)) native devices. `history` abstracts away the differences in these different platforms and provides a minimal API that lets you manage the history stack, navigate, confirm navigation, and persist state between sessions. `history` is library-agnostic and may easily be included in any JavaScript project.

## Installation

Using [npm](https://www.npmjs.org/):

    $ npm install history

Then with a module bundler like [webpack](https://webpack.github.io/), use as you would anything else:

```js
// using an ES6 transpiler, like babel
import { createHistory } from 'history'

// not using an ES6 transpiler
var createHistory = require('history').createHistory
```

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

history.pushState({ the: 'state' }, '/the/path?a=query')

// When you're finished, stop the listener.
unlisten()
```

You can find many more examples [in the documentation](https://github.com/rackt/history/tree/master/docs)!

## Thanks

A big thank-you to [Dan Shaw](https://www.npmjs.com/~dshaw) for letting us use the `history` npm package name! Thanks Dan!

Also, thanks to [BrowserStack](https://www.browserstack.com/) for providing the infrastructure that allows us to run our build in real browsers.
