const fsp = require('fs').promises;
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

let createName = text => text.toLowerCase().replace(/[^a-z]+/g, `-`);
let h1 = (text, name = createName(text)) => `${a(name)}\n# ${text}`;
let h2 = (text, name = createName(text)) => `${a(name)}\n## ${text}`;
let h3 = (text, name = createName(text)) => `${a(name)}\n### ${text}`;
let a = name => `<a name="${name}"></a>`;

function createGitHubMarkdown() {
  return `${h1(`history API Reference`)}

This is the API reference for [the history JavaScript library](https://github.com/ReactTraining/history). The source code is TypeScript, but it is compiled to JavaScript before publishing. The function signatures in this reference all include their TypeScript type annotations for conciseness and clarity.

Although there are several APIs in the history library, the main interfaces are:

- The create* methods:
  - [\`createBrowserHistory({ window?: Window })\`](#createbrowserhistory)
  - [\`createHashHistory({ window?: Window })\`](#createhashhistory)
  - [\`createMemoryHistory({ initialEntries?: InitialEntry[], initialIndex?: number })\`](#creatememoryhistory)
- The [\`History\`](#history) interface
  - [\`history.action\`](#history.action)
  - [\`history.location\`](#history.location)
  - [\`history.createHref(to: To)\`](#history.createhref)
  - [\`history.push(to: To, state?: State)\`](#history.push)
  - [\`history.replace(to: To, state?: State)\`](#history.replace)
  - [\`history.go(delta: number)\`](#history.go)
  - [\`history.back()\`](#history.back)
  - [\`history.forward()\`](#history.forward)
  - [\`history.listen(listener: Listener)\`](#history.listen)
  - [\`history.block(blocker: Blocker)\`](#history.block)
- The [\`Location\`](#location) interface
  - [\`location.pathname\`](#location.pathname)
  - [\`location.search\`](#location.search)
  - [\`location.hash\`](#location.hash)
  - [\`location.state\`](#location.state)
  - [\`location.key\`](#location.key)
- The [\`Action\`](#action) enum
- The [\`To\`](#to) type alias
- The [\`State\`](#state) type alias

${h2(`\`createBrowserHistory({ window?: Window })\``, `createbrowserhistory`)}

Returns a [\`BrowserHistory\`](https://github.com/ReactTraining/history/blob/0f992736/packages/history/index.ts#L306) instance for the given \`window\`, which defaults to [the \`defaultView\` of the current \`document\`](https://developer.mozilla.org/en-US/docs/Web/API/Document/defaultView).

\`\`\`ts
import { createBrowserHistory } from 'history';
let history = createBrowserHistory();
\`\`\`

See [the Getting Started guide](getting-started.md) for more information.

${h2(`\`createHashHistory({ window?: Window })\``, `createhashhistory`)}

Returns a [\`HashHistory\`](https://github.com/ReactTraining/history/blob/0f992736/packages/history/index.ts#L317) instance for the given \`window\`, which defaults to [the \`defaultView\` of the current \`document\`](https://developer.mozilla.org/en-US/docs/Web/API/Document/defaultView).

\`\`\`ts
import { createHashHistory } from 'history';
let history = createHashHistory();
\`\`\`

See [the Getting Started guide](getting-started.md) for more information.

${h2(
  `\`createMemoryHistory({ initialEntries?: InitialEntry[], initialIndex?: number })\``,
  `creatememoryhistory`
)}

Returns a [\`MemoryHistory\`](https://github.com/ReactTraining/history/blob/0f992736/packages/history/index.ts#L324) instance.

\`\`\`ts
import { createMemoryHistory } from 'history';
let history = createMemoryHistory();
\`\`\`

You can provide initial entries to this history instance through the \`initialEntries\` property, which defaults to \`['/']\` (a single location at the root \`/\` URL). The \`initialIndex\` defaults to the index of the last item in \`initialEntries\`.

<pre>
type InitialEntry = <a href="https://github.com/ReactTraining/history/blob/0f992736/packages/history/index.ts#L32">Path</a> | <a href="https://github.com/ReactTraining/history/blob/0f992736/packages/history/index.ts#L100">LocationPieces</a>;
</pre>

See [the Getting Started guide](getting-started.md) for more information.

${h2(`History`)}

A \`history\` object is similar to a [web browser's \`window.history\`](https://developer.mozilla.org/en-US/docs/Web/API/Window/history) instance but with a smaller API. \`history\` objects maintain a "stack" of [\`location\`](#location) objects that represent a user's browsing history.

A \`history\` object has the following interface:

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
  <a href="#history.listen">listen</a>(listener: <a href="#listener">Listener</a>&lt;S&gt;): () => void;
  <a href="#history.block">block</a>(blocker: <a href="#blocker">Blocker</a>&lt;S&gt;): () => void;
}

${a(`listener`)}
interface Listener&lt;S extends <a href="#state">State</a> = <a href="#state">State</a>&gt; {
  (update: <a href="#update">Update</a>&lt;S&gt;): void;
}

${a(`update`)}
interface Update&lt;S extends <a href="#state">State</a> = <a href="#state">State</a>&gt; {
  action: <a href="#action">Action</a>;
  location: <a href="#location">Location</a>&lt;S&gt;;
}

${a(`blocker`)}
interface Blocker&lt;S extends <a href="#state">State</a> = <a href="#state">State</a>&gt; {
  (tx: <a href="#transition">Transition</a>&lt;S&gt;): void;
}

${a(`transition`)}
interface Transition&lt;S extends <a href="#state">State</a> = <a href="#state">State</a>&gt; extends Update&lt;S&gt; {
  retry(): void;
}
</pre>

${h3(`\`history.action\``, `history.action`)}

The current (most recent) [\`Action\`](#action) that modified the history stack.

${h3(`\`history.location\``, `history.location`)}

The current [\`Location\`](#location).

${h3(`\`history.createHref(to: To)\``, `history.createhref`)}

Returns a string suitable for use as an \`<a href>\` value that will navigate to
the given destination.

${h3(`\`history.push(to: To, state?: State)\``, `history.push`)}

Pushes a new entry onto the stack.

See [the Navigation guide](navigation.md) for more information.

${h3(`\`history.replace(to: To, state?: State)\``, `history.replace`)}

Replaces the current entry in the stack with a new one.

See [the Navigation guide](navigation.md) for more information.

${h3(`\`history.go(delta: number)\``, `history.go`)}

Navigates back/forward by \`delta\` entries in the stack.

See [the Navigation guide](navigation.md) for more information.

${h3(`\`history.back()\``, `history.back`)}

Goes back one entry in the history stack. Alias for \`history.go(-1)\`.

See [the Navigation guide](navigation.md) for more information.

${h3(`\`history.forward()\``, `history.forward`)}

Goes forward one entry in the history stack. Alias for \`history.go(1)\`.

See [the Navigation guide](navigation.md) for more information.

${h3(`\`history.listen(listener: Listener)\``, `history.listen`)}

Starts listening for location changes and calls the given callback when it does.

\`\`\`ts
// To start listening for location changes...
let unlisten = history.listen(({ action, location }) => {
  // The current location changed.
});

// Later, when you are done listening for changes...
unlisten();
\`\`\`

See [the Getting Started guide](getting-started.md#listening) for more information.

${h3(`\`history.block(blocker: Blocker)\``, `history.block`)}

Prevents changes to the history stack from happening. This is useful when you want to prevent the user navigating away from the current page for some reason.

\`\`\`ts
// To start blocking location changes...
let unblock = history.block(({ action, location, retry }) => {
  // A transition was blocked!
});

// Later, when you want to start allowing transitions again...
unblock();
\`\`\`

See [the guide on Blocking Transitions](blocking-transitions.md) for more
information.

${h2(`Location`)}

A \`location\` is a particular entry in the history stack, usually analogous to a "page" or "screen" in your app. As the user clicks on links and moves around the app, the current location changes.

A \`location\` object has the following interface:

<pre>
interface Location {
  <a href="#location.pathname">pathname</a>: string;
  <a href="#location.search">search</a>: string;
  <a href="#location.hash">hash</a>: string;
  <a href="#location.state">state</a>: <a href="#state">State</a>;
  <a href="#location.key">key</a>: string;
}
</pre>

${h3(`\`location.pathname\``, `location.pathname`)}

The \`location.pathname\` property contains an initial \`/\` followed by the remainder of the URL up to the \`?\`.

See also [\`URL.pathname\`](https://developer.mozilla.org/en-US/docs/Web/API/URL/pathname).

${h3(`\`location.search\``, `location.search`)}

The \`location.search\` property contains an initial \`?\` followed by the \`key=value\` pairs in the query string. If there are no parameters, this value may be the empty string (i.e. \`''\`).

See also [\`URL.search\`](https://developer.mozilla.org/en-US/docs/Web/API/URL/search).

${h3(`\`location.hash\``, `location.hash`)}

The \`location.hash\` property contains an initial \`#\` followed by fragment identifier of the URL. If there is no fragment identifier, this value may be the empty string (i.e. \`''\`).

See also [\`URL.hash\`](https://developer.mozilla.org/en-US/docs/Web/API/URL/hash).

${h3(`\`location.state\``, `location.state`)}

The \`location.state\` property contains a user-supplied [\`State\`](#state) object that is associated with this location. This can be a useful place to store any information you do not want to put in the URL, e.g. session-specific data.

Note: In web browsers, this state is managed using the browser's built-in \`pushState\`, \`replaceState\`, and \`popstate\` APIs. See also [\`History.state\`](https://developer.mozilla.org/en-US/docs/Web/API/History/state).

${h3(`\`location.key\``, `location.key`)}

The \`location.key\` property is a unique string associated with this location. On the initial location, this will be the string \`default\`. On all subsequent locations, this string will be a unique identifier.

This can be useful in situations where you need to keep track of 2 different states for the same URL. For example, you could use this as the key to some network or device storage API.

${h2(`Action`)}

An [\`Action\`](https://github.com/ReactTraining/history/blob/0f992736/packages/history/index.ts#L4) represents a type of change that occurred in the history stack. \`Action\` is an \`enum\` with three members:

- <a name="action.pop"></a> \`Action.Pop\` - A change to an arbitrary index in the
  stack, such as a back or forward navigation. This does not describe the
  direction of the navigation, only that the index changed. This is the default
  action for newly created history objects.
- <a name="action.push"></a> \`Action.Push\` - Indicates a new entry being added
  to the history stack, such as when a link is clicked and a new page loads.
  When this happens, all subsequent entries in the stack are lost.
- <a name="action.replace"></a> \`Action.Replace\` - Indicates the entry at the
  current index in the history stack being replaced by a new one.

See [the Getting Started guide](getting-started.md) for more information.

${h2(`To`)}

A [\`To\`](https://github.com/ReactTraining/history/blob/0f992736/packages/history/index.ts#L212) value represents a destination location, but doesn't contain all the information that a normal [\`location\`](#location) object does. It is primarily used as the first argument to [\`history.push\`](#history.push) and [\`history.replace\`](#history.replace).

See [the Navigation guide](navigation.md) for more information.

${h2(`State`)}

A [\`State\`](https://github.com/ReactTraining/history/blob/0f992736/packages/history/index.ts#L61) value is an object of extra information that is associated with a [\`Location\`](#location) but that does not appear in the URL. This value is always associated with that location.

See [the Navigation guide](navigation.md) for more information.
`;
}

async function run() {
  let markdown = createGitHubMarkdown();
  let file = path.join(rootDir, `docs/api-reference.md`);
  await fsp.writeFile(file, markdown);
  return 0;
}

run().then(code => {
  process.exit(code);
});
