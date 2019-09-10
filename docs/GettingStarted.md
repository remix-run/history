# Intro

The history library is a lightweight layer over browsers' built-in [History](https://developer.mozilla.org/en-US/docs/Web/API/History) and [Location](https://developer.mozilla.org/en-US/docs/Web/API/Location) APIs. The goal is not to provide a full implementation of these APIs, but rather to make it easy for users to opt-in to different methods of navigation.

We provide 3 different methods for creating a `history` object, depending on the needs of your environment:

- `createBrowserHistory` is for use in modern web browsers that support the [HTML5 history API](http://diveintohtml5.info/history.html) (see [cross-browser compatibility](http://caniuse.com/#feat=history))
- `createHashHistory` is for use in situations where you want to store the location in the [hash](https://developer.mozilla.org/en-US/docs/Web/API/HTMLHyperlinkElementUtils/hash) of the current URL to avoid sending it to the server when the page reloads
- `createMemoryHistory` is used as a reference implementation and may also be used in non-DOM environments, like [React Native](https://facebook.github.io/react-native/) or tests

Depending on the method you want to use to keep track of history, you'll `import` (or `require`, if you're using CommonJS) only one of these methods.

## Basic Usage

Basic usage looks like this:

```js
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

// Get the current location.
const location = history.location;

// Listen for changes to the current location.
const unlisten = history.listen((location, action) => {
  // location is an object like window.location
  console.log(action, location.pathname, location.state);
});

// Use push, replace, and go to navigate around.
history.push('/home', { some: 'state' });

// To stop listening, call the function returned from listen().
unlisten();
```

The options that each `create` method takes, along with its default values, are:

```js
createBrowserHistory({
  basename: '', // The base URL of the app (see below)
  forceRefresh: false, // Set true to force full page refreshes
  keyLength: 6, // The length of location.key
  // A function to use to confirm navigation with the user (see below)
  getUserConfirmation: (message, callback) => callback(window.confirm(message))
});

createHashHistory({
  basename: '', // The base URL of the app (see below)
  hashType: 'slash', // The hash type to use (see below)
  // A function to use to confirm navigation with the user (see below)
  getUserConfirmation: (message, callback) => callback(window.confirm(message))
});

createMemoryHistory({
  initialEntries: ['/'], // The initial URLs in the history stack
  initialIndex: 0, // The starting index in the history stack
  keyLength: 6, // The length of location.key
  // A function to use to confirm navigation with the user. Required
  // if you return string prompts from transition hooks (see below)
  getUserConfirmation: null
});
```

## Properties

Each `history` object has the following properties:

- `history.length` - The number of entries in the history stack
- `history.location` - The current location (see below)
- `history.action` - The current navigation action (see below)

Additionally, `createMemoryHistory` provides `history.index` and `history.entries` properties that let you inspect the history stack.

## Listening

You can listen for changes to the current location using `history.listen`:

```js
history.listen((location, action) => {
  console.log(
    `The current URL is ${location.pathname}${location.search}${location.hash}`
  );
  console.log(`The last navigation action was ${action}`);
});
```

The `location` object implements a subset of [the `window.location` interface](https://developer.mozilla.org/en-US/docs/Web/API/Location), including:

- `location.pathname` - The path of the URL
- `location.search` - The URL query string
- `location.hash` - The URL hash fragment

Locations may also have the following properties:

- `location.state` - Some extra state for this location that does not reside in the URL (supported in `createBrowserHistory` and `createMemoryHistory`)
- `location.key` - A unique string representing this location (supported in `createBrowserHistory` and `createMemoryHistory`)

The `action` is one of `PUSH`, `REPLACE`, or `POP` depending on how the user got to the current URL.

## Cleaning up

When you attach a listener using `history.listen`, it returns a function that can be used to remove the listener, which can then be invoked in cleanup logic:

```js
const unlisten = history.listen(myListener);
// ...
unlisten();
```
