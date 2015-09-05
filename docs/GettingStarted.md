## Getting Started

The first thing you'll need to do is create a [history object](Terms.md#history). The main `history` module exports several different [`create*` methods](Terms.md#createhistory) that you can use depending on your environment.

- `createHistory` is for use in modern web browsers that support the [HTML5 history API](http://diveintohtml5.info/history.html) (see [cross-browser compatibility](http://caniuse.com/#feat=history))
- `createHashHistory` is for use in legacy web browsers (see [caveats of using hash history](HashHistoryCaveats.md))
- `createMemoryHistory` is used mainly for testing and does not persist state across sessions

Once you get a `history` object, use `history.listen` to be notified when [the `location`](Location.md) changes.

```js
import { createHistory } from 'history'

let history = createHistory()

// Listen for changes to the current location. The
// listener is called once immediately.
let unlisten = history.listen(function (location) {
  console.log(location.pathname)
})

// When you're finished, stop the listener.
unlisten()
```

### Navigation

You can also use a `history` object to programmatically change the current `location` using the following methods:

- `pushState(state, path)`
- `replaceState(state, path)`
- `setState(state)`
- `go(n)`
- `goBack()`
- `goForward()`

The [`path`](Terms.md#path) argument to `pushState` and `replaceState` represents a complete URL path, including the [query string](Terms.md#querystring). The [`state`](Terms.md#locationstate) argument should be a JSON-serializable object. In `setState`, the properties in `state` are shallowly merged into the current state.

```js
// Push a new entry onto the history stack.
history.pushState({ some: 'state' }, '/home')

// Replace the current entry on the history stack.
history.replaceState({ some: 'other state' }, '/profile')

// Go back to the previous history entry. The following
// two lines are synonymous.
history.go(-1)
history.goBack()
```

To prevent the user from navigating away from a page, or to prompt them before they do, see the documentation on [confirming navigation](ConfirmingNavigation.md).

### Creating URLs

Additionally, `history` objects can be used to create URL paths and/or `href`s for `<a>` tags that link to various places in your app. This is useful when using hash history to prefix URLs with a `#` or when using [query support](QuerySupport.md) to automatically build query strings.

```js
let href = history.createHref('/the/path')
```

### Minimizing Your Build

Using the main `history` module is a great way to get up and running quickly. However, you probably don't need to include all the various history implementations in your production bundle. To keep your build as small as possible, import only the functions you need directly from `history/lib`.

```js
// Browser history
import createHistory from 'history/lib/createBrowserHistory'

// Hash history
import createHistory from 'history/lib/createHashHistory'

// Memory history
import createHistory from 'history/lib/createMemoryHistory'
```
