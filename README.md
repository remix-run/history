# history [![Travis][build-badge]][build] [![npm package][npm-badge]][npm]

[build-badge]: https://img.shields.io/travis/ReactTraining/history/master.svg?style=flat-square
[build]: https://travis-ci.org/ReactTraining/history

[npm-badge]: https://img.shields.io/npm/v/history.svg?style=flat-square
[npm]: https://www.npmjs.org/package/history

[`history`](https://www.npmjs.com/package/history) is a JavaScript library that lets you easily manage session history anywhere JavaScript runs. `history` abstracts away the differences in various environments and provides a minimal API that lets you manage the history stack, navigate, confirm navigation, and persist state between sessions.

## Installation

Using [npm](https://www.npmjs.com/):

    $ npm install --save history

Then with a module bundler like [webpack](https://webpack.github.io/), use as you would anything else:

```js
// using ES6 modules
import createHistory from 'history/createBrowserHistory'

// using CommonJS modules
var createHistory = require('history').createBrowserHistory
```

The UMD build is also available on [unpkg](https://unpkg.com):

```html
<script src="https://unpkg.com/history/umd/history.min.js"></script>
```

You can find the library on `window.History`.

## Usage

`history` provides 3 different methods for creating a `history` object, depending on your environment.

- `createBrowserHistory` is for use in modern web browsers that support the [HTML5 history API](http://diveintohtml5.info/history.html) (see [cross-browser compatibility](http://caniuse.com/#feat=history))
- `createMemoryHistory` is used as a reference implementation and may also be used in non-DOM environments, like [React Native](https://facebook.github.io/react-native/) or tests
- `createHashHistory` is for use in legacy web browsers

Depending on the method you want to use to keep track of history, you'll `import` (or `require`) one of these methods directly from the package root (i.e. `history/createBrowserHistory`). The remainder of this document uses the term `createHistory` to refer to any of these implementations.

Basic usage looks like this:

```js
import createHistory from 'history/createBrowserHistory'

const history = createHistory()

// Get the current location.
const location = history.location

// Listen for changes to the current location.
const unlisten = history.listen((location, action) => {
  // location is an object like window.location
  console.log(action, location.pathname, location.state)
})

// Use push, replace, and go to navigate around.
history.push('/home', { some: 'state' })

// To stop listening, call the function returned from listen().
unlisten()
```

The options that each `create` method takes, along with its default values, are:

```js
createBrowserHistory({
  basename: '',             // The base URL of the app (see below)
  forceRefresh: false,      // Set true to force full page refreshes
  keyLength: 6,             // The length of location.key
})

createMemoryHistory({
  initialEntries: [ '/' ],  // The initial URLs in the history stack
  initialIndex: 0,          // The starting index in the history stack
  keyLength: 6,             // The length of location.key
})

createHashHistory({
  basename: '',             // The base URL of the app (see below)
  hashType: 'slash',        // The hash type to use (see below)
  // A function to use to confirm navigation with the user (see below)
})
```

### Properties

Each `history` object has the following properties:

- `history.length` - The number of entries in the history stack
- `history.location` - The current location (see below)
- `history.action` - The current navigation action (see below)

Additionally, `createMemoryHistory` provides `history.index` and `history.entries` properties that let you inspect the history stack.

### Transition Hooks

#### Post-change hook

You can listen for changes to the current location using `history.listen`:

```js
history.listen((location, action) => {
  console.log(`The current URL is ${location.pathname}${location.search}${location.hash}`)
  console.log(`The last navigation action was ${action}`)
})
```

Post-change listener functions will be not be invoked when a transition is blocked by a pre-change hook, unless the user used the built-in browser back or forward features to initiate the transition. In this case, the listener functions will be called with the same `location` and `action` as the previous invocation.

#### Pre-change hook
You can perform side effects before history state changes by registering functions with `history.before`

```js
const unsub = history.before((location, action) => {
  location.query = queryParseFn(location.search)
})
```

Before hooks can also be `async` functions, i.e. return a Promise, to block the state change asynchronously.

```js
const unsub = history.before(async (location, action) => {
  await getDataAndCodeForLocation(location)
})
```

Returning a truthy value from any before hook functions will cancel the transition.

```js
const unsub = history.before((location, action) => {
  return await askUserIfTheyreSureTheyWantToLeave()
})
```

Or in a simpler, less custom fashion

```js
const unsub = history.before(async (location, action) => {
  return window.confirm('Are you sure you want to leave this page?')
})
```

The hooks are called in the order they're registered. Not every hook will be called if one of them blocks the transition.

### `Location`

The `location` object implements a subset of [the `window.location` interface](https://developer.mozilla.org/en-US/docs/Web/API/Location), including:

- `location.pathname` - The path of the URL
- `location.search` - The URL query string
- `location.hash` - The URL hash fragment

Locations may also have the following properties:

- `location.state` - Some extra state for this location that does not reside in the URL (supported in `createBrowserHistory` and `createMemoryHistory`)
- `location.key` - A unique string representing this location (supported in `createBrowserHistory` and `createMemoryHistory`)

The `action` is one of `PUSH`, `REPLACE`, or `POP` depending on how the user got to the current URL.

### Navigation

`history` objects may be used programmatically change the current location using the following methods:

- `history.push(path, [state])`
- `history.replace(path, [state])`
- `history.go(n)`
- `history.goBack()`
- `history.goForward()`
- `history.canGo(n)` (only in `createMemoryHistory`)

When using `push` or `replace` you can either specify both the URL path and state as separate arguments or include everything in a single location-like object as the first argument.

1. A URL path *or*
2. A location-like object with `{ pathname, search, hash, state }`

```js
// Push a new entry onto the history stack.
history.push('/home')

// Push a new entry onto the history stack with a query string
// and some state. Location state does not appear in the URL.
history.push('/home?the=query', { some: 'state' })

// If you prefer, use a single location-like object to specify both
// the URL and state. This is equivalent to the example above.
history.push({
  pathname: '/home',
  search: '?the=query',
  state: { some: 'state' }
})

// Go back to the previous history entry. The following
// two lines are synonymous.
history.go(-1)
history.goBack()
```

**Note:** Location state is only supported in `createBrowserHistory` and `createMemoryHistory`.

### Using a Base URL

If all the URLs in your app are relative to some other "base" URL, use the `basename` option. This option transparently adds the given string to the front of all URLs you use.

```js
const history = createHistory({
  basename: '/the/base'
})

history.listen(location => {
  console.log(location.pathname) // /home
})

history.push('/home') // URL is now /the/base/home
```

**Note:** `basename` is not suppported in `createMemoryHistory`.

### Forcing Full Page Refreshes in createBrowserHistory

By default `createBrowserHistory` uses HTML5 `pushState` and `replaceState` to prevent reloading the entire page from the server while navigating around. If instead you would like to reload as the URL changes, use the `forceRefresh` option.

```js
const history = createBrowserHistory({
  forceRefresh: true
})
```

### Modifying the Hash Type in createHashHistory

By default `createHashHistory` uses a leading slash in hash-based URLs. You can use the `hashType` option to use a different hash formatting.


```js
const history = createHashHistory({
  hashType: 'slash' // the default
})

history.push('/home') // window.location.hash is #/home

const history = createHashHistory({
  hashType: 'noslash' // Omit the leading slash
})

history.push('/home') // window.location.hash is #home

const history = createHashHistory({
  hashType: 'hashbang' // Google's legacy AJAX URL format
})

history.push('/home') // window.location.hash is #!/home
```

## Thanks

A big thank-you to [Dan Shaw](https://www.npmjs.com/~dshaw) for letting us use the `history` npm package name! Thanks Dan!

Also, thanks to [BrowserStack](https://www.browserstack.com/) for providing the infrastructure that allows us to run our build in real browsers.
