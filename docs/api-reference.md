<a name="top"></a>

# history API Reference

This is the API reference for [the history JavaScript library](https://github.com/ReactTraining/history).

The [source code](https://github.com/ReactTraining/history/tree/dev/packages/history) for this library is written in TypeScript, but it is compiled to JavaScript before publishing. Some of the function signatures in this reference include their TypeScript type annotations, but you can always refer to the original source as well.

<a name="setup"></a>

## Setup

This library includes three `history` object initializers for the different modes we support. They are:

- [Browser history](#browserhistory) - for building web apps
- [Hash history](#hashhistory) - for building web apps where you don't want to/can't send the URL to the server for some reason
- [Memory history](#memoryhistory) - for building native apps and testing

An app should only ever need to use one of these modes.

<a name="browserhistory"></a>

### Browser History

A "browser history" object is designed to be run in modern web browsers that support the HTML5 history interface including `pushState`, `replaceState`, and the `popstate` event.

```ts
declare createBrowserHistory({ window?: Window }): BrowserHistory;
```

`createBrowserHistory` returns a [`BrowserHistory`](https://github.com/ReactTraining/history/blob/0f992736/packages/history/index.ts#L306) instance for the given `window`, which defaults to [the `defaultView` of the current `document`](https://developer.mozilla.org/en-US/docs/Web/API/Document/defaultView).

```ts
import { createBrowserHistory } from 'history';
let history = createBrowserHistory();
```

See [the Getting Started guide](getting-started.md) for more information.

<a name="hashhistory"></a>

### Hash History

A "hash history" object is designed to be run in modern web browsers that support the HTML5 history interface including `pushState`, `replaceState`, and the `popstate` event. The main difference between this and [browser history](#createbrowserhistory) is that a hash history stores the current location in the `hash` portion of the URL, which means that it is not ever sent to the server.

```ts
declare createHashHistory({ window?: Window }): HashHistory;
```

`createHashHistory` returns a [`HashHistory`](https://github.com/ReactTraining/history/blob/0f992736/packages/history/index.ts#L317) instance for the given `window`, which defaults to [the `defaultView` of the current `document`](https://developer.mozilla.org/en-US/docs/Web/API/Document/defaultView).

```ts
import { createHashHistory } from 'history';
let history = createHashHistory();
```

See [the Getting Started guide](getting-started.md) for more information.

<a name="memoryhistory"></a>

### Memory History

A "memory history" object stores all locations internally in an array. This makes it ideal as a reference implementation and for situations where you need complete control over the history stack, like tests and React Native.

```ts
declare createMemoryHistory({
  initialEntries?: InitialEntry[],
  initialIndex?: number
}): MemoryHistory;

type InitialEntry = Path | LocationPieces;
```

`createMemoryHistory` returns a [`MemoryHistory`](https://github.com/ReactTraining/history/blob/0f992736/packages/history/index.ts#L324) instance.

```ts
import { createMemoryHistory } from 'history';
let history = createMemoryHistory();
```

You can provide initial entries to this history instance through the `initialEntries` property, which defaults to `['/']` (a single location at the root `/` URL). The `initialIndex` defaults to the index of the last item in `initialEntries`.

See [the Getting Started guide](getting-started.md) for more information.

<a name="history"></a>

## History

A `history` object is similar to a [web browser's `window.history`](https://developer.mozilla.org/en-US/docs/Web/API/Window/history) instance but with a smaller API. `history` objects maintain a "stack" of [`location`](#location) objects that represent a user's browsing history. As you navigate around the app, the stack is automatically updated to reflect the changes.

A `history` object has the following interface:

<pre>
interface History&lt;S extends <a href="#state">State</a> = <a href="#state">State</a>&gt; {
  readonly <a href="#history.action">action</a>: <a href="#action">Action</a>;
  readonly <a href="#history.location">location</a>: <a href="#location">Location</a>&lt;S&gt;;
  <a href="#history.createhref">createHref</a>(to: <a href="#to">To</a>): string;
  <a href="#history.push">push</a>(to: <a href="#to">To</a>, state?: S): void;
  <a href="#history.replace">replace</a>(to: <a href="#to">To</a>, state?: S): void;
  <a href="#history.go">go</a>(n: number): void;
  <a href="#history.back">back</a>(): void;
  <a href="#history.forward">forward</a>(): void;
  <a href="#history.listen">listen</a>(listener: Listener&lt;S&gt;): () => void;
  <a href="#history.block">block</a>(blocker: Blocker&lt;S&gt;): () => void;
}
</pre>

<a name="history.action"></a>

### `history.action`

The current (most recent) [`Action`](#action) that modified the history stack.

<a name="history.location"></a>

### `history.location`

The current [`Location`](#location).

<a name="history.createhref"></a>

### `history.createHref(to: To)`

Returns a string suitable for use as an `<a href>` value that will navigate to
the given destination.

<a name="history.push"></a>

### `history.push(to: To, state?: State)`

Pushes a new entry onto the stack.

See [the Navigation guide](navigation.md) for more information.

<a name="history.replace"></a>

### `history.replace(to: To, state?: State)`

Replaces the current entry in the stack with a new one.

See [the Navigation guide](navigation.md) for more information.

<a name="history.go"></a>

### `history.go(delta: number)`

Navigates back/forward by `delta` entries in the stack.

See [the Navigation guide](navigation.md) for more information.

<a name="history.back"></a>

### `history.back()`

Goes back one entry in the history stack. Alias for `history.go(-1)`.

See [the Navigation guide](navigation.md) for more information.

<a name="history.forward"></a>

### `history.forward()`

Goes forward one entry in the history stack. Alias for `history.go(1)`.

See [the Navigation guide](navigation.md) for more information.

<a name="history.listen"></a>

### `history.listen(listener: Listener)`

Starts listening for location changes and calls the given callback when it does.

```ts
// To start listening for location changes...
let unlisten = history.listen(({ action, location }) => {
  // The current location changed.
});

// Later, when you are done listening for changes...
unlisten();
```

See [the Getting Started guide](getting-started.md#listening) for more information.

<a name="history.block"></a>

### `history.block(blocker: Blocker)`

Prevents changes to the history stack from happening. This is useful when you want to prevent the user navigating away from the current page for some reason.

```ts
// To start blocking location changes...
let unblock = history.block(({ action, location, retry }) => {
  // A transition was blocked!
});

// Later, when you want to start allowing transitions again...
unblock();
```

See [the guide on Blocking Transitions](blocking-transitions.md) for more information.

<a name="location"></a>

## Location

A `location` is a particular entry in the history stack, usually analogous to a "page" or "screen" in your app. As the user clicks on links and moves around the app, the current location changes.

A `location` object has the following interface:

<pre>
interface Location {
  <a href="#location.pathname">pathname</a>: string;
  <a href="#location.search">search</a>: string;
  <a href="#location.hash">hash</a>: string;
  <a href="#location.state">state</a>: <a href="#state">State</a>;
  <a href="#location.key">key</a>: string;
}
</pre>

<a name="location.pathname"></a>

### `location.pathname`

The `location.pathname` property contains an initial `/` followed by the remainder of the URL up to the `?`.

See also [`URL.pathname`](https://developer.mozilla.org/en-US/docs/Web/API/URL/pathname).

<a name="location.search"></a>

### `location.search`

The `location.search` property contains an initial `?` followed by the `key=value` pairs in the query string. If there are no parameters, this value may be the empty string (i.e. `''`).

See also [`URL.search`](https://developer.mozilla.org/en-US/docs/Web/API/URL/search).

<a name="location.hash"></a>

### `location.hash`

The `location.hash` property contains an initial `#` followed by fragment identifier of the URL. If there is no fragment identifier, this value may be the empty string (i.e. `''`).

See also [`URL.hash`](https://developer.mozilla.org/en-US/docs/Web/API/URL/hash).

<a name="location.state"></a>

### `location.state`

The `location.state` property contains a user-supplied [`State`](#state) object that is associated with this location. This can be a useful place to store any information you do not want to put in the URL, e.g. session-specific data.

Note: In web browsers, this state is managed using the browser's built-in `pushState`, `replaceState`, and `popstate` APIs. See also [`History.state`](https://developer.mozilla.org/en-US/docs/Web/API/History/state).

<a name="location.key"></a>

### `location.key`

The `location.key` property is a unique string associated with this location. On the initial location, this will be the string `default`. On all subsequent locations, this string will be a unique identifier.

This can be useful in situations where you need to keep track of 2 different states for the same URL. For example, you could use this as the key to some network or device storage API.

<a name="action"></a>

## Action

An [`Action`](https://github.com/ReactTraining/history/blob/0f992736/packages/history/index.ts#L4) represents a type of change that occurred in the history stack. `Action` is an `enum` with three members:

- <a name="action.pop"></a> `Action.Pop` - A change to an arbitrary index in the stack, such as a back or forward navigation. This does not describe the direction of the navigation, only that the index changed. This is the default action for newly created history objects.
- <a name="action.push"></a> `Action.Push` - Indicates a new entry being added to the history stack, such as when a link is clicked and a new page loads. When this happens, all subsequent entries in the stack are lost.
- <a name="action.replace"></a> `Action.Replace` - Indicates the entry at the current index in the history stack being replaced by a new one.

See [the Getting Started guide](getting-started.md) for more information.

<a name="to"></a>

## To

A [`To`](https://github.com/ReactTraining/history/blob/0f992736/packages/history/index.ts#L212) value represents a destination location, but doesn't contain all the information that a normal [`location`](#location) object does. It is primarily used as the first argument to [`history.push`](#history.push) and [`history.replace`](#history.replace).

See [the Navigation guide](navigation.md) for more information.

<a name="state"></a>

## State

A [`State`](https://github.com/ReactTraining/history/blob/0f992736/packages/history/index.ts#L61) value is an object of extra information that is associated with a [`Location`](#location) but that does not appear in the URL. This value is always associated with that location.

See [the Navigation guide](navigation.md) for more information.

<a name="creating-and-parsing-paths"></a>

## Creating and Parsing Paths

The library also exports `createPath` and `parsePath` methods that are useful when working with URL paths.

```ts
declare createPath(pieces: PathPieces): Path;
declare parsePath(path: Path): PathPieces;

type Path = string;

interface PathPieces {
  pathname?: string;
  search?: string;
  hash?: string;
}
```
