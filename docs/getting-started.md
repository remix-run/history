# Intro

The history library provides history tracking and navigation primitives for
JavaScript applications that run in browsers and other stateful environments.

We provide 3 different methods for working with history, depending on your
environment:

- A "browser history" is for use in modern web browsers that support
  the [HTML5 history API](http://diveintohtml5.info/history.html) (see
  [cross-browser compatibility](http://caniuse.com/#feat=history))
- A "hash history" is for use in web browsers where you want to store the 
  location in the
  [hash](https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/hash)
  portion of the current URL to avoid sending it to the server when the page
  reloads
- A "memory history" is used as a reference implementation that may be used in 
  non-browser environments, like [React
  Native](https://facebook.github.io/react-native/) or tests

Since you'll only ever need to use one in a given app, we provide
environment-specific bundles. You'll need to `import` one of these bundles:

- `history/browser`
- `history/hash`
- `history/memory`

Each bundle exports a `createHistory` method you can use to create your own
history object. In addition, `history/browser` and `history/hash` export a
singleton instance you can use which reflects the state of [the current
`document`](https://developer.mozilla.org/en-US/docs/Web/API/Window/document).

## Basic Usage

Basic usage looks like this:

```js
// Import the browser history singleton instance.
import history from 'history/browser';
// Alternatively, if you're using hash history import
// the hash history singleton instance.
// import history from 'history/hash';

// Get the current location.
let location = history.location;

// Listen for changes to the current location.
let unlisten = history.listen(({ location, action }) => {
  console.log(action, location.pathname, location.state);
});

// Use push to push a new entry onto the history stack.
history.push('/home', { some: 'state' });

// Use replace to replace the current entry in the stack.
history.replace('/logged-in');

// Use back/forward to navigate one entry back or forward.
history.back();

// To stop listening, call the function returned from listen().
unlisten();
```

If you're using `history/memory` you'll need to create your own `history` object
before you can use it.

```js
import { createHistory } from 'history/memory';
let history = createHistory();
```

If you're using browser or hash history with a `window` other than that of the
current `document` (like an iframe), you'll need to create your own browser/hash
history:

```js
import { createHistory } from 'history/browser';
let history = createHistory({
  window: iframe.contentWindow
});
```

## Properties

Each `history` object has the following properties:

- `history.location` - The current location (see below)
- `history.action` - The current navigation action (see below)

Additionally, memory history provides `history.index` that tells you the current
index in the history stack.

## Listening

You can listen for changes to the current location using `history.listen`:

```js
history.listen(({ action, location }) => {
  console.log(
    `The current URL is ${location.pathname}${location.search}${location.hash}`
  );
  console.log(`The last navigation action was ${action}`);
});
```

The `location` object implements a subset of [the `window.location`
interface](https://developer.mozilla.org/en-US/docs/Web/API/Location),
including:

- `location.pathname` - The path of the URL
- `location.search` - The URL query string
- `location.hash` - The URL hash fragment

Locations may also have the following properties:

- `location.state` - Some extra state for this location that does not reside in 
  the URL
- `location.key` - A unique string representing this location

The `action` is one of `PUSH`, `REPLACE`, or `POP` depending on how the user got
to the current URL.

- A `PUSH` means one more entry was added to the history stack
- A `REPLACE` means the current entry in the stack was replaced
- A `POP` means we went to some other location already in the stack

## Cleaning up

When you attach a listener using `history.listen`, it returns a function that
can be used to remove the listener, which can then be invoked in cleanup logic:

```js
let unlisten = history.listen(myListener);

// Later, when you're done...
unlisten();
```
