## Glossary

This is a glossary of common terms used in the history codebase and documentation listed in alphabetical order, along with their [type signatures](http://flowtype.org/docs/quick-reference.html).

* [Action](#action)
* [BeforeUnloadHook](#beforeunloadhook)
* [CreateHistory](#createhistory)
* [CreateHistoryEnhancer](#createhistoryenhancer)
* [Hash](#hash)
* [History](#history)
* [HistoryOptions](#historyoptions)
* [Href](#href)
* [Location](#location)
* [LocationKey](#locationkey)
* [LocationListener](#locationlistener)
* [LocationState](#locationstate)
* [Path](#path)
* [Pathname](#pathname)
* [Query](#query)
* [Search](#search)
* [Transition](#transition)
* [TransitionHook](#transitionhook)

### Action

    type Action = 'PUSH' | 'REPLACE' | 'POP';

An *action* describes the type of change to a URL. Possible values are:

  - `PUSH` – indicates a new item was added to the history
  - `REPLACE` – indicates the current item in history was altered
  - `POP` – indicates there is a new current item, i.e. the "current pointer" changed

### BeforeUnloadHook

    type BeforeUnloadHook = () => ?string;

A *before unload hook* is a function that is used in web browsers to prevent the user from navigating away from the page or closing the window.

### CreateHistory

    type CreateHistory = (options: ?HistoryOptions) => History;

### CreateHistoryEnhancer

    type CreateHistoryEnhancer = (createHistory: CreateHistory) => CreateHistory;

A *createHistory enhancer* (or simply a "history enhancer") is a function that augments the capabilities of a [`createHistory`](#createhistory) function. It usually does this in one of three ways:

  - Adding `options` (i.e. making more options available)
  - Supplying default `options`
  - Augmenting the returned [`history`](#history) object

### Hash

    type Hash = string;

A *hash* is a string that represents the hash portion of the URL. It is synonymous with `window.location.hash` in web browsers.

### History

    type History = {
      listenBefore: (hook: TransitionHook) => Function;
      listen: (listener: LocationListener) => Function;
      transitionTo(location: Location) => void;
      pushState(state: LocationState, path: Path) => void;
      push(path: Path) => void;
      replaceState(state: LocationState, path: Path) => void;
      replace(path: Path) => void;
      go(n: number) => void;
      goBack() => void;
      goForward() => void;
      createKey() => LocationKey;
      createPath(path: Path) => Path;
      createHref(path: Path) => Href;
    };

### HistoryOptions

    type HistoryOptions = Object;

A *history options* object contains options that are used to [create a new history](#createhistory) object.

### Href

    type Href = string;

An *href* is a URL string that may be used as the value of `<a href>`. The main reason to distinguish this type from a [path](#path) is due to the fact that hash history puts a `#` in front of hrefs.

### Location

    type Location = {
      pathname: Pathname;
      search: Search;
      query: Query;
      state: LocationState;
      action: Action;
      key: LocationKey;
    };

A *location* answers two important (philosophical) questions:

  - Where am I?
  - How did I get here?

New locations are typically created each time the URL changes. You can read more about locations in [the `history` docs](https://github.com/rackt/history/blob/master/docs/Location.md).

### LocationKey

    type LocationKey = string;

A *location key* is a string that is unique to a particular [`location`](#location). It is the one piece of data that most accurately answers the question "Where am I?".

### LocationListener

    type LocationListener = (location: Location) => void;

### LocationState

    type LocationState = ?Object;

A *location state* is an arbitrary object of data associated with a particular [`location`](#location). This is basically a way to tie extra state to a location that is not contained in the URL.

This type gets its name from the first argument to HTML5's [`pushState`][pushState] and [`replaceState`][replaceState] methods.

[pushState]: https://developer.mozilla.org/en-US/docs/Web/API/History_API#The_pushState()_method
[replaceState]: https://developer.mozilla.org/en-US/docs/Web/API/History_API#The_replaceState()_method

### Path

    type Path = Pathname + Search + Hash;

A *path* represents a URL path as a string.

### Pathname

    type Pathname = string;

A *pathname* is the portion of a URL that describes a hierarchical path, including the preceding `/`. For example, in `http://example.com/the/path?the=query`, `/the/path` is the pathname. It is synonymous with `window.location.pathname` in web browsers.

### Query

    type Query = Object;

A *query* is the parsed version of a [search string](#search).

### Search

    type Search = string;

A *search* is the portion of the URL that follows the [pathname](#pathname), including any preceding `?`. For example, in `http://example.com/the/path?the=query`, `?the=query` is the search. It is synonymous with `window.location.search` in web browsers.

### Transition

A *transition* is the process of notifying listeners when the [location](#location) changes. It is not an API; rather, it is a concept. Transitions may be interrupted by [transition hooks](#transitionhook).

Note: A transition does not refer to the exact moment the URL actually changes. For example, in web browsers the user may click the back button or otherwise directly manipulate the URL by typing into the address bar. This is not a transition, but a [history](#history) object will start a transition as a result of the URL changing.

### TransitionHook

    type TransitionHook = (location: Location, callback: ?Function) => any;

A *transition hook* is a function that is called just before listeners are notified of a new [location](#location).
