## Getting Started

The first thing you'll need to do is create a history object. The main `history` module exports several different `create*` methods that you can use depending on your environment.

- `createHistory` is for use in modern web browsers that support the [HTML5 history API](http://diveintohtml5.info/history.html)
- `createHashHistory` is for use in legacy web browsers (see the [caveats of using hash history](#caveats-of-hash-history) and also [caniuse](http://caniuse.com/#feat=history) for compatibility)
- `createMemoryHistory` is used mainly for testing and does not persist across sessions

Once you get a `history` object, use `history.listen` to be notified when [the `location`](Location.md) changes.

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

### Navigation

You can also use a `history` object to programmatically change the current `location` using the following methods:

- `pushState(state, path)`
- `replaceState(state, path)`
- `setState(state)`
- `go(n)`
- `goBack()`
- `goForward()`

The `path` argument to `pushState` and `replaceState` represents a complete URL path, including the query string. The `state` argument should be a JSON-serializable object. In `setState`, the properties in `state` are shallowly merged into the current state.

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

### Creating URLs

Additionally, `history` objects can be used to create `href`s for `<a>` tags that link to various places in your app. This is only really useful when using [Hash History](/docs/History/HashHistory.md) to prefix URLs with a `#` or when using [query support](QuerySupport.md) to automatically build query strings.

```js
var href = history.createHref('/the/path');
```

### Minimizing Your Build

Using the main `history` module is a great way to get up and running quickly. However, you probably don't need to include [all the various history implementations](/docs/History) in your production bundle. To keep your build as small as possible, import only the functions you need directly from `history/lib`.

```js
// HTML5 history
import createHistory from 'history/lib/createBrowserHistory';

// Hash history
import createHistory from 'history/lib/createHashHistory';

// Memory history
import createHistory from 'history/lib/createMemoryHistory';
```

### Caveats of Hash History

Using `window.location.hash` is a common trick that is used to mimic the HTML5 history API in older browsers. It works for most use cases and provides good compatibility across a wide range of browsers. However, in order to preserve state across browser sessions we need a place to store some state.

HTML5 gives us the `pushState` method and the `popstate` event, but in older browsers the only thing we have is the URL. So, when using hash history, you'll see an extra item in your query string that looks something like `_k=123abc`. This is a key that `history` uses to look up persistent state data in `window.sessionStorage` between page loads. If you prefer to use a different query parameter, or to opt-out of this behavior entirely, use the `queryKey` configuration option.

```js
import createHistory from 'history/lib/createHashHistory';

// Use _key instead of _k.
var history = createHistory({
  queryKey: '_key'
});

// Opt-out of persistent state, not recommended.
var history = createHistory({
  queryKey: false
});
```

One other thing to keep in mind when using hash history is that you cannot also use `window.location.hash` as it was originally intended, to link an anchor point within your HTML document.
