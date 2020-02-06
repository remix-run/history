////////////////////////////////////////////////////////////////////////////////
// TYPES
////////////////////////////////////////////////////////////////////////////////

export type Action = 'POP' | 'PUSH' | 'REPLACE';

export type Path = string;
export type PathPieces = {
  pathname?: string;
  search?: string;
  hash?: string;
};

export type State = object;
export interface Location<S extends State> extends PathPieces {
  pathname: string;
  search: string;
  hash: string;
  state?: S;
  key?: string;
}

export interface Update<S extends State> {
  action: Action;
  location: Location<S>;
}
export interface Listener<S extends State> {
  (update: Update<S>): void;
}
export type Unlistener = () => void;

export interface Transaction<S extends State> extends Update<S> {
  retry(): void;
}
export interface Blocker<S extends State> {
  (tx: Transaction<S>): void;
}
export type Unblocker = () => void;

export interface History<S extends State> {
  action: Action;
  location: Location<S>;
  createHref(to: Path | PathPieces): string;
  push(to: Path | PathPieces, state?: S): void;
  replace(to: Path | PathPieces, state?: S): void;
  go(n: number): void;
  back(): void;
  forward(): void;
  listen(listener: Listener<S>): Unlistener;
  block(blocker: Blocker<S>): Unblocker;
}
export interface MemoryHistory<S extends State> extends History<S> {
  index: number;
}

type HistoryState<S extends State> = {
  usr: S | null | undefined;
  key?: string;
  idx: number;
};

////////////////////////////////////////////////////////////////////////////////
// CONSTANTS
////////////////////////////////////////////////////////////////////////////////

const PopAction: Action = 'POP';
const PushAction: Action = 'PUSH';
const ReplaceAction: Action = 'REPLACE';

const BeforeUnloadEventType = 'beforeunload';
const HashChangeEventType = 'hashchange';
const PopStateEventType = 'popstate';

const readOnly = __DEV__
  ? (obj: any) => Object.freeze(obj)
  : (obj: any) => obj;

function warning(cond: boolean, message: string) {
  if (!cond) {
    // eslint-disable-next-line no-console
    if (typeof console !== 'undefined') console.warn(message);

    // Throw an error so people can use the debugger's "pause on exceptions"
    // function to find the source of warnings.
    try {
      throw new Error(message);
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }
}

function noop() {}

////////////////////////////////////////////////////////////////////////////////
// BROWSER
////////////////////////////////////////////////////////////////////////////////

/**
 * Browser history stores the location in regular URLs. This is the
 * standard for most web apps, but it requires some configuration on
 * the server to ensure you serve the same app at multiple URLs.
 */
export function createBrowserHistory<S extends State = {}>({
  window = document.defaultView!
}: { window?: Window } = {}): History<S> {
  let globalHistory = window.history;

  function getIndexAndLocation(): [number, Location<S>] {
    let { pathname, search, hash } = window.location;
    let state: HistoryState<S> = globalHistory.state || {};
    return [
      state.idx,
      readOnly({
        pathname,
        search,
        hash,
        state: state.usr || null,
        key: state.key || 'default'
      })
    ];
  }

  let blockedPopTx: Transaction<S> | null = null;
  function handlePop(): void {
    if (blockedPopTx) {
      blockers.call(blockedPopTx);
      blockedPopTx = null;
    } else {
      let nextAction = PopAction;
      let [nextIndex, nextLocation] = getIndexAndLocation();

      if (blockers.length) {
        if (nextIndex != null) {
          let n = index - nextIndex;
          if (n) {
            // Revert the POP
            blockedPopTx = {
              action: nextAction,
              location: nextLocation,
              retry() {
                go(n * -1);
              }
            };

            go(n);
          }
        } else {
          // Trying to POP to a location with no index. We did not create
          // this location, so we can't effectively block the navigation.
          warning(
            false,
            // TODO: Write up a doc that explains our blocking strategy in
            // detail and link to it here so people can understand better
            // what is going on and how to avoid it.
            `You are trying to block a POP navigation to a location that was not ` +
              `created by the history library. The block will fail silently in ` +
              `production, but in general you should do all navigation with the ` +
              `history library (instead of using window.history.pushState directly) ` +
              `to avoid this situation.`
          );
        }
      } else {
        applyTx(nextAction);
      }
    }
  }

  window.addEventListener(PopStateEventType, handlePop);

  let action: Action = PopAction;
  let [index, location] = getIndexAndLocation();
  let blockers = createEvents();
  let listeners = createEvents();

  if (index == null) {
    index = 0;
    globalHistory.replaceState({ ...globalHistory.state, idx: index }, '');
  }

  function createHref(to: Path | PathPieces): string {
    return typeof to === 'string' ? to : createPath(to);
  }

  function getNextLocation<S extends State>(
    to: Path | PathPieces,
    state?: S
  ): Location<S> {
    return readOnly({
      ...location,
      ...(typeof to === 'string' ? parsePath(to) : to),
      state,
      key: createKey()
    });
  }

  function getHistoryStateAndUrl<S extends State>(
    nextLocation: Location<S>,
    index: number
  ): [HistoryState<S>, string] {
    return [
      {
        usr: nextLocation.state,
        key: nextLocation.key,
        idx: index
      },
      createHref(nextLocation)
    ];
  }

  function allowTx<S extends State>(
    action: Action,
    location: Location<S>,
    retry: () => void
  ): boolean {
    return (
      !blockers.length || (blockers.call({ action, location, retry }), false)
    );
  }

  function applyTx(nextAction: Action): void {
    action = nextAction;
    [index, location] = getIndexAndLocation();
    listeners.call({ action, location });
  }

  function push<S extends State>(to: Path | PathPieces, state?: S): void {
    let nextAction = PushAction;
    let nextLocation = getNextLocation<S>(to, state);
    function retry() {
      push(to, state);
    }

    if (allowTx<S>(nextAction, nextLocation, retry)) {
      let [historyState, url] = getHistoryStateAndUrl<S>(
        nextLocation,
        index + 1
      );

      // TODO: Support forced reloading
      // try...catch because iOS limits us to 100 pushState calls :/
      try {
        globalHistory.pushState(historyState, '', url);
      } catch (error) {
        // They are going to lose state here, but there is no real
        // way to warn them about it since the page will refresh...
        window.location.assign(url);
      }

      applyTx(nextAction);
    }
  }

  function replace<S extends State>(to: Path | PathPieces, state?: S): void {
    let nextAction = ReplaceAction;
    let nextLocation = getNextLocation(to, state);
    function retry() {
      replace(to, state);
    }

    if (allowTx<S>(nextAction, nextLocation, retry)) {
      let [historyState, url] = getHistoryStateAndUrl<S>(nextLocation, index);

      // TODO: Support forced reloading
      globalHistory.replaceState(historyState, '', url);

      applyTx(nextAction);
    }
  }

  function go(n: number): void {
    globalHistory.go(n);
  }

  let history = {
    get action(): Action {
      return action;
    },
    get location(): Location<S> {
      return location;
    },
    createHref,
    push,
    replace,
    go,
    back(): void {
      go(-1);
    },
    forward(): void {
      go(1);
    },
    listen(listener: Listener<S>): Unlistener {
      return listeners.push(listener);
    },
    block(blocker: Blocker<S> = noop): Unblocker {
      let unblock = blockers.push(blocker);

      if (blockers.length === 1) {
        window.addEventListener(BeforeUnloadEventType, promptBeforeUnload);
      }

      return function() {
        unblock();

        // Remove the beforeunload listener so the document may
        // still be salvageable in the pagehide event.
        // See https://html.spec.whatwg.org/#unloading-documents
        if (!blockers.length) {
          window.removeEventListener(BeforeUnloadEventType, promptBeforeUnload);
        }
      };
    }
  };

  return history;
}

////////////////////////////////////////////////////////////////////////////////
// HASH
////////////////////////////////////////////////////////////////////////////////

/**
 * Hash history stores the location in window.location.hash. This makes
 * it ideal for situations where you don't want to send the location to
 * the server for some reason, either because you do cannot configure it
 * or the URL space is reserved for something else.
 */
export function createHashHistory<S extends State = {}>({
  window = document.defaultView!
}: { window?: Window } = {}): History<S> {
  let globalHistory = window.history;

  function getIndexAndLocation(): [number, Location<S>] {
    let { pathname = '/', search = '', hash = '' } = parsePath(
      window.location.hash.substr(1)
    );
    let state: HistoryState<S> = globalHistory.state || {};
    return [
      state.idx,
      readOnly({
        pathname,
        search,
        hash,
        state: state.usr || null,
        key: state.key || 'default'
      })
    ];
  }

  let blockedPopTx: Transaction<S> | null = null;
  function handlePop(): void {
    if (blockedPopTx) {
      blockers.call(blockedPopTx);
      blockedPopTx = null;
    } else {
      let nextAction = PopAction;
      let [nextIndex, nextLocation] = getIndexAndLocation();

      if (blockers.length) {
        if (nextIndex != null) {
          let n = index - nextIndex;
          if (n) {
            // Revert the POP
            blockedPopTx = {
              action: nextAction,
              location: nextLocation,
              retry() {
                go(n * -1);
              }
            };

            go(n);
          }
        } else {
          // Trying to POP to a location with no index. We did not create
          // this location, so we can't effectively block the navigation.
          warning(
            false,
            // TODO: Write up a doc that explains our blocking strategy in
            // detail and link to it here so people can understand better
            // what is going on and how to avoid it.
            `You are trying to block a POP navigation to a location that was not ` +
              `created by the history library. The block will fail silently in ` +
              `production, but in general you should do all navigation with the ` +
              `history library (instead of using window.history.pushState directly) ` +
              `to avoid this situation.`
          );
        }
      } else {
        applyTx(nextAction);
      }
    }
  }

  window.addEventListener(PopStateEventType, handlePop);

  // TODO: Is this still necessary? Which browsers do
  // not trigger popstate when the hash changes?
  window.addEventListener(HashChangeEventType, event => {
    let [, nextLocation] = getIndexAndLocation();

    // Ignore extraneous hashchange events.
    if (createPath(nextLocation) !== createPath(location)) {
      handlePop();
    }
  });

  let action = PopAction;
  let [index, location] = getIndexAndLocation();
  let blockers = createEvents();
  let listeners = createEvents();

  if (index == null) {
    index = 0;
    globalHistory.replaceState({ ...globalHistory.state, idx: index }, '');
  }

  function getBaseHref(): string {
    let base = document.querySelector('base');
    let href = '';

    if (base && base.getAttribute('href')) {
      let url = window.location.href;
      let hashIndex = url.indexOf('#');
      href = hashIndex === -1 ? url : url.slice(0, hashIndex);
    }

    return href;
  }

  function createHref(to: Path | PathPieces): string {
    return getBaseHref() + '#' + (typeof to === 'string' ? to : createPath(to));
  }

  function getNextLocation(to: Path | PathPieces, state?: S): Location<S> {
    return readOnly({
      ...location,
      ...(typeof to === 'string' ? parsePath(to) : to),
      state,
      key: createKey()
    });
  }

  function getHistoryStateAndUrl(
    nextLocation: Location<S>,
    index: number
  ): [HistoryState<S>, string] {
    return [
      {
        usr: nextLocation.state,
        key: nextLocation.key,
        idx: index
      },
      createHref(nextLocation)
    ];
  }

  function allowTx(
    action: Action,
    location: Location<S>,
    retry: () => void
  ): boolean {
    return (
      !blockers.length || (blockers.call({ action, location, retry }), false)
    );
  }

  function applyTx(nextAction: Action): void {
    action = nextAction;
    [index, location] = getIndexAndLocation();
    listeners.call({ action, location });
  }

  function push(to: Path | PathPieces, state?: S): void {
    let nextAction = PushAction;
    let nextLocation = getNextLocation(to, state);
    function retry() {
      push(to, state);
    }

    warning(
      nextLocation.pathname.charAt(0) === '/',
      `Relative pathnames are not supported in hash history.push(${JSON.stringify(
        to
      )})`
    );

    if (allowTx(nextAction, nextLocation, retry)) {
      let [historyState, url] = getHistoryStateAndUrl(nextLocation, index + 1);

      // TODO: Support forced reloading
      // try...catch because iOS limits us to 100 pushState calls :/
      try {
        globalHistory.pushState(historyState, '', url);
      } catch (error) {
        // They are going to lose state here, but there is no real
        // way to warn them about it since the page will refresh...
        window.location.assign(url);
      }

      applyTx(nextAction);
    }
  }

  function replace(to: Path | PathPieces, state?: S): void {
    let nextAction = ReplaceAction;
    let nextLocation = getNextLocation(to, state);
    function retry() {
      replace(to, state);
    }

    warning(
      nextLocation.pathname.charAt(0) === '/',
      `Relative pathnames are not supported in hash history.replace(${JSON.stringify(
        to
      )})`
    );

    if (allowTx(nextAction, nextLocation, retry)) {
      let [historyState, url] = getHistoryStateAndUrl(nextLocation, index);

      // TODO: Support forced reloading
      globalHistory.replaceState(historyState, '', url);

      applyTx(nextAction);
    }
  }

  function go(n: number): void {
    globalHistory.go(n);
  }

  let history = {
    get action(): Action {
      return action;
    },
    get location(): Location<S> {
      return location;
    },
    createHref,
    push,
    replace,
    go,
    back(): void {
      go(-1);
    },
    forward(): void {
      go(1);
    },
    listen(listener: Listener<S>): Unlistener {
      return listeners.push(listener);
    },
    block(blocker: Blocker<S> = noop): Unblocker {
      let unblock = blockers.push(blocker);

      if (blockers.length === 1) {
        window.addEventListener(BeforeUnloadEventType, promptBeforeUnload);
      }

      return function() {
        unblock();

        // Remove the beforeunload listener so the document may
        // still be salvageable in the pagehide event.
        // See https://html.spec.whatwg.org/#unloading-documents
        if (!blockers.length) {
          window.removeEventListener(BeforeUnloadEventType, promptBeforeUnload);
        }
      };
    }
  };

  return history;
}

////////////////////////////////////////////////////////////////////////////////
// MEMORY
////////////////////////////////////////////////////////////////////////////////

/**
 * Memory history stores the current location in memory. It is designed
 * for use in stateful non-browser environments like headless tests (in
 * node.js) and React Native.
 */
export function createMemoryHistory<S extends State = {}>({
  initialEntries = ['/'],
  initialIndex = 0
} = {}): MemoryHistory<S> {
  let entries = initialEntries.map(entry => {
    let location = readOnly({
      pathname: '/',
      search: '',
      hash: '',
      state: null,
      key: createKey(),
      ...(typeof entry === 'string' ? parsePath(entry) : entry)
    });

    warning(
      location.pathname.charAt(0) === '/',
      `Relative pathnames are not supported in createMemoryHistory({ initialEntries }) (invalid entry: ${JSON.stringify(
        entry
      )})`
    );

    return location;
  });
  let index = clamp(initialIndex, 0, entries.length - 1);

  let action = PopAction;
  let location = entries[index];
  let blockers = createEvents();
  let listeners = createEvents();

  function createHref(to: Path | PathPieces): string {
    return typeof to === 'string' ? to : createPath(to);
  }

  function getNextLocation(to: Path | PathPieces, state?: S): Location<S> {
    return readOnly({
      ...location,
      ...(typeof to === 'string' ? parsePath(to) : to),
      state,
      key: createKey()
    });
  }

  function allowTx(
    action: Action,
    location: Location<S>,
    retry: () => void
  ): boolean {
    return (
      !blockers.length || (blockers.call({ action, location, retry }), false)
    );
  }

  function applyTx(nextAction: Action, nextLocation: Location<S>): void {
    action = nextAction;
    location = nextLocation;
    listeners.call({ action, location });
  }

  function push(to: Path | PathPieces, state?: S): void {
    let nextAction = PushAction;
    let nextLocation = getNextLocation(to, state);
    function retry() {
      push(to, state);
    }

    warning(
      location.pathname.charAt(0) === '/',
      `Relative pathnames are not supported in memory history.push(${JSON.stringify(
        to
      )})`
    );

    if (allowTx(nextAction, nextLocation, retry)) {
      index += 1;
      entries.splice(index, entries.length, nextLocation);
      applyTx(nextAction, nextLocation);
    }
  }

  function replace(to: Path | PathPieces, state?: S): void {
    let nextAction = ReplaceAction;
    let nextLocation = getNextLocation(to, state);
    function retry() {
      replace(to, state);
    }

    warning(
      location.pathname.charAt(0) === '/',
      `Relative pathnames are not supported in memory history.replace(${JSON.stringify(
        to
      )})`
    );

    if (allowTx(nextAction, nextLocation, retry)) {
      entries[index] = nextLocation;
      applyTx(nextAction, nextLocation);
    }
  }

  function go(n: number): void {
    let nextIndex = clamp(index + n, 0, entries.length - 1);
    let nextAction = PopAction;
    let nextLocation = entries[nextIndex];
    function retry() {
      go(n);
    }

    if (allowTx(nextAction, nextLocation, retry)) {
      index = nextIndex;
      applyTx(nextAction, nextLocation);
    }
  }

  let history = {
    get index(): number {
      return index;
    },
    get action(): Action {
      return action;
    },
    get location(): Location<S> {
      return location;
    },
    createHref,
    push,
    replace,
    go,
    back(): void {
      go(-1);
    },
    forward(): void {
      go(1);
    },
    listen(listener: Listener<S>) {
      return listeners.push(listener);
    },
    block(blocker: Blocker<S> = noop): Unblocker {
      return blockers.push(blocker);
    }
  };

  return history;
}

function clamp(n: number, lowerBound: number, upperBound: number) {
  return Math.min(Math.max(n, lowerBound), upperBound);
}

////////////////////////////////////////////////////////////////////////////////
// UTILS
////////////////////////////////////////////////////////////////////////////////

function promptBeforeUnload(event: BeforeUnloadEvent) {
  // Cancel the event.
  event.preventDefault();
  // Chrome (and legacy IE) requires returnValue to be set.
  event.returnValue = '';
}

function createEvents() {
  let handlers: ((arg: any) => void)[] = [];

  return {
    get length() {
      return handlers.length;
    },
    push(fn: (arg: any) => void) {
      handlers.push(fn);
      return function() {
        handlers = handlers.filter(handler => handler !== fn);
      };
    },
    call(arg: any) {
      handlers.forEach(fn => fn && fn(arg));
    }
  };
}

function createKey() {
  return Math.random()
    .toString(36)
    .substr(2, 8);
}

export function createPath({
  pathname = '/',
  search = '',
  hash = ''
}: PathPieces): Path {
  return pathname + search + hash;
}

export function parsePath(path: Path): PathPieces {
  let pieces: PathPieces = {};

  if (path) {
    let hashIndex = path.indexOf('#');
    if (hashIndex >= 0) {
      pieces.hash = path.substr(hashIndex);
      path = path.substr(0, hashIndex);
    }

    let searchIndex = path.indexOf('?');
    if (searchIndex >= 0) {
      pieces.search = path.substr(searchIndex);
      path = path.substr(0, searchIndex);
    }

    if (path) {
      pieces.pathname = path;
    }
  }

  return pieces;
}
