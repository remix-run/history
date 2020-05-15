# API Reference

This document is an API reference for [the history JavaScript
library](https://github.com/ReactTraining/history).

Although there are several APIs in the history library, the main interfaces are:

- The create* methods:
  - [`createBrowserHistory({ window?: Window })`](#createbrowserhistory-window-window-)
  - [`createHashHistory({ window?: Window })`](#createhashhistory-window-window-)
  - [`createMemoryHistory({ initialEntries?: InitialEntry[], initialIndex?: number })`](#creatememoryhistory-initialentries-initialentry-initialindex-number-)
- The [`History`](#history) interface
  - [`history.action`](#historyaction)
  - [`history.location`](#historylocation)
  - [`history.createHref(to: To)`](#historycreatehrefto-to)
  - [`history.push(to: To, state?: State)`](#historypushto-to-state-state)
  - [`history.replace(to: To, state?: State)`](#historyreplaceto-to-state-state)
  - [`history.go(delta: number)`](#historygodelta-number)
  - [`history.back()`](#historyback)
  - [`history.forward()`](#historyforward)
  - [`history.listen(listener: Listener)`](#historylistenlistener-listener)
  - [`history.block(blocker: Blocker)`](#historyblockblocker-blocker)
- The [`Location`](#location) interface
  - [`location.pathname`](#locationpathname)
  - [`location.search`](#locationsearch)
  - [`location.hash`](#locationhash)
  - [`location.state`](#locationstate)
  - [`location.key`](#locationkey)
- The [`Action`](#action) enum
- The [`To`](#to) type alias

## `createBrowserHistory({ window?: Window })`

Returns a [`BrowserHistory`](https://github.com/ReactTraining/history/blob/0f992736/packages/history/index.ts#L306) instance for the given `window`, which defaults to
[the `defaultView` of the current
`document`](https://developer.mozilla.org/en-US/docs/Web/API/Document/defaultView).

```ts
import { createBrowserHistory } from 'history';
let history = createBrowserHistory();
```

See [the Getting Started guide](getting-started.md) for more information.

## `createHashHistory({ window?: Window })`

Returns a [`HashHistory`](https://github.com/ReactTraining/history/blob/0f992736/packages/history/index.ts#L317) instance for the given `window`, which defaults to [the
`defaultView` of the current
`document`](https://developer.mozilla.org/en-US/docs/Web/API/Document/defaultView).

```ts
import { createHashHistory } from 'history';
let history = createHashHistory();
```

See [the Getting Started guide](getting-started.md) for more information.

## `createMemoryHistory({ initialEntries?: InitialEntry[], initialIndex?: number })`

Returns a [`MemoryHistory`](https://github.com/ReactTraining/history/blob/0f992736/packages/history/index.ts#L324) instance.

```ts
import { createMemoryHistory } from 'history';
let history = createMemoryHistory();
```

You can provide initial entries to this history instance through the
`initialEntries` property, which defaults to `['/']` (a single location at the
root `/` URL). The `initialIndex` defaults to the index of the last item in
`initialEntries`.

<pre>
type InitialEntry = <a href="https://github.com/ReactTraining/history/blob/0f992736/packages/history/index.ts#L32">Path</a> | <a href="https://github.com/ReactTraining/history/blob/0f992736/packages/history/index.ts#L100">LocationPieces</a>;
</pre>

See [the Getting Started guide](getting-started.md) for more information.

## History

A `history` object is similar to a [web browser's
`window.history`](https://developer.mozilla.org/en-US/docs/Web/API/Window/history)
instance but with a smaller API. `history` objects maintain a "stack" of
[`location`](#location) objects that represent a user's browsing history.

A `history` object has the following interface:

<pre>
interface History&lt;S extends <a href="https://github.com/ReactTraining/history/blob/0f992736/packages/history/index.ts#L61">State</a> = <a href="https://github.com/ReactTraining/history/blob/0f992736/packages/history/index.ts#L61">State</a>&gt; {
  readonly <a href="#historyaction">action</a>: <a href="#action">Action</a>;
  readonly <a href="#historylocation">location</a>: <a href="#location">Location</a>&lt;S&gt;;
  <a href="#historycreatehrefto-to">createHref</a>(to: <a href="#to">To</a>): string;
  <a href="#historypushto-to-state-state">push</a>(to: <a href="#to">To</a>, state?: S): void;
  <a href="#historyreplaceto-to-state-state">replace</a>(to: <a href="#to">To</a>, state?: S): void;
  <a href="#historygodelta-number">go</a>(n: number): void;
  <a href="#historyback">back</a>(): void;
  <a href="#historyforward">forward</a>(): void;
  <a href="#historylistenlistener-listener">listen</a>(listener: Listener&lt;S&gt;): () => void;
  <a href="#historyblockblocker-blocker">block</a>(blocker: Blocker&lt;S&gt;): () => void;
}

interface Listener&lt;S extends <a href="https://github.com/ReactTraining/history/blob/0f992736/packages/history/index.ts#L61">State</a> = <a href="https://github.com/ReactTraining/history/blob/0f992736/packages/history/index.ts#L61">State</a>&gt; {
  (update: Update&lt;S&gt;): void;
}

interface Update&lt;S extends <a href="https://github.com/ReactTraining/history/blob/0f992736/packages/history/index.ts#L61">State</a> = <a href="https://github.com/ReactTraining/history/blob/0f992736/packages/history/index.ts#L61">State</a>&gt; {
  action: <a href="#action">Action</a>;
  location: <a href="#location">Location</a>&lt;S&gt;;
}

interface Blocker&lt;S extends <a href="https://github.com/ReactTraining/history/blob/0f992736/packages/history/index.ts#L61">State</a> = <a href="https://github.com/ReactTraining/history/blob/0f992736/packages/history/index.ts#L61">State</a>&gt; {
  (tx: Transition&lt;S&gt;): void;
}

interface Transition&lt;S extends <a href="https://github.com/ReactTraining/history/blob/0f992736/packages/history/index.ts#L61">State</a> = <a href="https://github.com/ReactTraining/history/blob/0f992736/packages/history/index.ts#L61">State</a>&gt; extends Update&lt;S&gt; {
  retry(): void;
}
</pre>

### `history.action`

The current (most recent) [`Action`](#action) that modified the history stack.

### `history.location`

The current [`Location`](#location).

### `history.createHref(to: To)`

Returns a string suitable for use as an `<a href>` value that will navigate to
the given destination.

### `history.push(to: To, state?: State)`

Pushes a new entry onto the stack.

See [the Navigation guide](navigation.md) for more information.

### `history.replace(to: To, state?: State)`

Replaces the current entry in the stack with a new one.

See [the Navigation guide](navigation.md) for more information.

### `history.go(delta: number)`

Navigates back/forward by `delta` entries in the stack.

### `history.back()`

Goes back one entry in the history stack. Alias for `history.go(-1)`.

### `history.forward()`

Goes forward one entry in the history stack. Alias for `history.go(1)`.

### `history.listen(listener: Listener)`

Starts listening for location changes and calls the given callback when it does.

```js
// To start listening for location changes...
let unlisten = history.listen(({ action, location }) => {
  // The current location changed.
});

// Later, when you are done listening for changes...
unlisten();
```

See [the Getting Started guide](getting-started.md#listening) for more
information.

### `history.block(blocker: Blocker)`

Prevents changes to the history stack from happening. This is useful when you
want to prevent the user navigating away from the current page for some reason.

```js
// To start blocking location changes...
let unblock = history.block(({ action, location, retry }) => {
  // A transition was blocked!
});

// Later, when you want to start allowing transitions again...
unblock();
```

See [the guide on Blocking Transitions](blocking-transitions.md) for more
information.

## Location

A `location` is a particular entry in the history stack, usually analogous to a
"page" or "screen" in your app. As the user clicks on links and moves around the
app, the current location changes.

A `location` object has the following interface:

<pre>
interface Location {
  <a href="#locationpathname" title="location.pathname">pathname</a>: string;
  <a href="#locationsearch" title="location.search">search</a>: string;
  <a href="#locationhash" title="location.hash">hash</a>: string;
  <a href="#locationstate" title="location.state">state</a>: object | null;
  <a href="#locationkey" title="location.key">key</a>: string;
}
</pre>

### `location.pathname`

The `location.pathname` property contains an initial `/` followed by the
remainder of the URL up to the `?`.

See also [`URL.pathname`](https://developer.mozilla.org/en-US/docs/Web/API/URL/pathname).

### `location.search`

The `location.search` property contains an initial `?` followed by the
`key=value` pairs in the query string. If there are no parameters, this value
may be the empty string (i.e. `''`).

See also [`URL.search`](https://developer.mozilla.org/en-US/docs/Web/API/URL/search).

### `location.hash`

The `location.hash` property contains an initial `#` followed by fragment
identifier of the URL. If there is no fragment identifier, this value may be the
empty string (i.e. `''`).

See also
[`URL.hash`](https://developer.mozilla.org/en-US/docs/Web/API/URL/hash).

### `location.state`

The `location.state` property contains a user-supplied object of arbitrary data
that is associated with this location. This can be a useful place to store any
information you do not want to put in the URL, e.g. session-specific data.

Note: In web browsers, this state is managed using the browser's built-in
`pushState`, `replaceState`, and `popstate` APIs. See also
[`History.state`](https://developer.mozilla.org/en-US/docs/Web/API/History/state).

### `location.key`

The `location.key` property is a unique string associated with this location. On
the initial location, this will be the string `default`. On all subsequent
locations, this string will be a unique identifier.

This can be useful in situations where you need to keep track of 2 different
states for the same URL. For example, you could use this as the key to some
network or device storage API.

## Action

An "action" represents a type of change that occurred in the history stack.
`Action` is an `enum` with three members:

- `Action.Pop` - A change to an arbitrary index in the stack, such as a back or
  forward navigation. This does not describe the direction of the navigation,
  only that the index changed. This is the default action for newly created
  history objects.
- `Action.Push` - Indicates a new entry being added to the history stack, such
  as when a link is clicked and a new page loads. When this happens, all
  subsequent entries in the stack are lost.
- `Action.Replace` - Indicates the entry at the current index in the history
  stack being replaced by a new one.

## To

A "to" value represents a destination location, but doesn't contain all the
information that a normal [`location`](#location) object does.

<pre>
type To = <a href="https://github.com/ReactTraining/history/blob/0f992736/packages/history/index.ts#L32">Path</a> | <a href="https://github.com/ReactTraining/history/blob/0f992736/packages/history/index.ts#L72">PathPieces</a>;
</pre>
