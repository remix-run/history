[![build status](https://img.shields.io/travis/rackt/history/master.svg?style=flat-square)](https://travis-ci.org/rackt/history)
[![npm package](https://img.shields.io/npm/v/history.svg?style=flat-square)](https://www.npmjs.org/package/history)
[![react-router channel on slack](https://img.shields.io/badge/slack-react--router@reactiflux-61DAFB.svg?style=flat-square)](http://www.reactiflux.com)

## history

[`history`](https://www.npmjs.com/package/history) is a JavaScript library that lets you easily manage session history in browsers, testing environments, and (soon, via [React Native](https://facebook.github.io/react-native/)) native devices. `history` abstracts away the differences in these different platforms and provides a minimal API that lets you manage the history stack, navigate, confirm navigation, and persist state between sessions. `history` is library-agnostic and may easily be included in any JavaScript project.

### Installation

    $ npm install history

### Basic Usage

A "history" encapsulates navigation between different screens in your app, and notifies listeners when the current screen changes.

```js
import { createHistory } from 'history'

let history = createHistory()

// Listen for changes to the current location. The
// listener is called once immediately.
let unlisten = history.listen(function (location) {
  console.log(location.pathname)
})

history.pushState({ the: 'state' }, '/the/path?a=query')

// When you're finished, stop the listener.
unlisten()
```

Read more about getting started [in the documentation](http://rackt.github.io/history/stable/GettingStarted.html)!

### Thanks

A big thank-you to [Dan Shaw](https://www.npmjs.com/~dshaw) for letting us use the `history` npm package name! Thanks Dan!

Also, thanks to [BrowserStack](https://www.browserstack.com/) for providing the infrastructure that allows us to run our build in real browsers.
