[![build status](https://img.shields.io/travis/rackt/history/master.svg?style=flat-square)](https://travis-ci.org/rackt/history)
[![npm package](https://img.shields.io/npm/v/history.svg?style=flat-square)](https://www.npmjs.org/package/history)
[![react-router channel on slack](https://img.shields.io/badge/slack-react--router@reactiflux-61DAFB.svg?style=flat-square)](http://www.reactiflux.com)

`history` is a lightweight, but powerful JavaScript library that lets you easily manage session history in browsers, testing environments, and (soon, via React Native) native devices. `history` abstracts away the differences in these different platforms and provides a minimal API that lets you manage the history stack, navigate, confirm navigation, and persist state between sessions. `history` is library-agnostic and may easily be included in any JavaScript project.

### Installation

    $ npm install history

### Getting Started

The first thing you'll need to do is create a history object. `history` provides several different `create*` methods that you can use depending on your environment.

- `createHistory` is for use in modern web browsers that support the [HTML5 history API](http://diveintohtml5.info/history.html)
- `createHashHistory` is for use in legacy web browsers (see [caniuse](http://caniuse.com/#feat=history) for compatibility)
- `createMemoryHistory` is used mainly for testing and does not persist across sessions

Once you get a `history` object, use `history.listen` to be notified when the `location` changes.

```js
import { createHistory } from 'history';

var history = createHistory();

// Listen for changes to the current location. The
// listener is called once immediately.
var unlisten = history.listen(function (location) {
  console.log(location.pathname);
});

// When you're finished, stop the listener.
unlisten();
```

### Location

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

### Navigation

You can also use a `history` object to programmatically change the current `location` using the following methods:

- `pushState(state, path)`
- `replaceState(state, path)`
- `go(n)`
- `goBack()`
- `goForward()`

The `path` argument to `pushState` and `replaceState` represents a complete URL path, including the query string. The `state` argument should be a JSON-serializable object.

```js
// Push a new entry onto the history stack.
history.pushState({ some: 'state' }, '/home');

// Replace the current entry on the history stack.
history.replaceState({ some: 'other state' }, '/profile');

// Go back to the previous history entry. The following
// two lines are synonymous.
history.go(-1);
history.goBack();
```

### Confirming Navigation

Sometimes you may want to prevent the user from going to a different page. For example, if they are halfway finished filling out a long form, and they click the back button (or try to close the tab), you may want to prompt them to confirm they actually want to leave the page before they lose the information they've already entered. For these cases, `history` lets you register transition hooks that return a prompt message you can show the user before the location changes. For example, you could do something like this:

```js
history.registerTransitionHook(function () {
  if (input.value !== '')
    return 'Are you sure you want to leave this page?';
});
```

You can dynamically add/remove transition hooks using `unregisterTransitionHook` as well.

In browsers, `history` uses [`window.confirm`](https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm) by default to display confirmation messages to users. However, you can provide your own custom confirmation dialog box using the `getUserConfirmation` hook when you create your `history` object.

```js
var history = createHistory({
  getUserConfirmation: function (message, callback) {
    callback(window.confirm(message)); // The default
  }
});
```

### Caveats of Hash History

Using `window.location.hash` is a common trick that is used to mimic the HTML5 history API in older browsers. It works for most use cases and provides good compatibility across a wide range of browsers. However, in order to preserve state across browser sessions we need a place to store some state. HTML5 gives us the `pushState` method and the `popstate` event, but in older browsers the only thing we have is the URL. So, when using hash history, you'll see an extra item in your query string that looks something like `_k=123abc`. This is a key that `history` uses to look up persistent state data in `window.sessionStorage` between page loads. If you prefer to use a different query parameter, or to opt-out of this behavior entirely, use the `queryKey` configuration option.

```js
// Use _key instead of _k.
var history = createHashHistory({
  queryKey: '_key'
});

// Opt-out of persistent state, not recommended.
var history = createHashHistory({
  queryKey: false
});
```

One other thing to keep in mind when using hash history is that you cannot also use `window.location.hash` as it was originally intended, to link an anchor point within your HTML document.

### Thanks

A big thank-you to [Dan Shaw](https://github.com/dshaw) for letting us use the `history` npm package name! Thanks Dan!
