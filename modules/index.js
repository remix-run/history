const PopAction = 'POP';
const PushAction = 'PUSH';
const ReplaceAction = 'REPLACE';

const BeforeUnloadEventType = 'beforeunload';
const PopStateEventType = 'popstate';
const HashChangeEventType = 'hashchange';

// There's some duplication in this code, but only one create* method
// should ever be used in a given web page, so it's best for minifying
// to just inline everything.

/**
 * Memory history stores the current location in memory. It is designed
 * for use in stateful non-browser environments like headless tests (in
 * node.js) and React Native.
 */
export const createMemoryHistory = ({
  initialEntries = ['/'],
  initialIndex = 0
} = {}) => {
  let entries = initialEntries.map(entry => {
    let location = createReadOnlyObject({
      pathname: '/',
      search: '',
      hash: '',
      state: null,
      key: createKey(),
      ...(typeof entry === 'string' ? parsePath(entry) : entry)
    });

    if (__DEV__) {
      if (location.pathname.charAt(0) !== '/') {
        let arg = JSON.stringify(entry);
        throw new Error(
          `Relative pathnames are not supported in createMemoryHistory({ initialEntries }) (invalid entry: ${arg})`
        );
      }
    }

    return location;
  });
  let index = clamp(initialIndex, 0, entries.length - 1);

  let action = PopAction;
  let location = entries[index];
  let blockers = createEvents();
  let listeners = createEvents();

  let createHref = createPath;

  let getNextLocation = (to, state = null) =>
    createReadOnlyObject({
      ...location,
      ...(typeof to === 'string' ? parsePath(to) : to),
      state,
      key: createKey()
    });

  let allowTx = (action, location, retry) =>
    !blockers.length || (blockers.call({ action, location, retry }), false);

  let applyTx = (nextAction, nextLocation) => {
    action = nextAction;
    location = nextLocation;
    listeners.call({ action, location });
  };

  let push = (to, state) => {
    let nextAction = PushAction;
    let nextLocation = getNextLocation(to, state);
    let retry = () => push(to, state);

    if (__DEV__) {
      if (nextLocation.pathname.charAt(0) !== '/') {
        let arg = JSON.stringify(to);
        throw new Error(
          `Relative pathnames are not supported in createMemoryHistory().push(${arg})`
        );
      }
    }

    if (allowTx(nextAction, nextLocation, retry)) {
      index += 1;
      entries.splice(index, entries.length, nextLocation);
      applyTx(nextAction, nextLocation);
    }
  };

  let replace = (to, state) => {
    let nextAction = ReplaceAction;
    let nextLocation = getNextLocation(to, state);
    let retry = () => replace(to, state);

    if (__DEV__) {
      if (nextLocation.pathname.charAt(0) !== '/') {
        let arg = JSON.stringify(to);
        throw new Error(
          `Relative pathnames are not supported in createMemoryHistory().replace(${arg})`
        );
      }
    }

    if (allowTx(nextAction, nextLocation, retry)) {
      entries[index] = nextLocation;
      applyTx(nextAction, nextLocation);
    }
  };

  let go = n => {
    let nextIndex = clamp(index + n, 0, entries.length - 1);
    let nextAction = PopAction;
    let nextLocation = entries[nextIndex];
    let retry = () => {
      go(n);
    };

    if (allowTx(nextAction, nextLocation, retry)) {
      index = nextIndex;
      applyTx(nextAction, nextLocation);
    }
  };

  let back = () => {
    go(-1);
  };

  let forward = () => {
    go(1);
  };

  let listen = fn => listeners.push(fn);

  let block = fn => blockers.push(fn);

  let history = {
    get action() {
      return action;
    },
    get location() {
      return location;
    },
    createHref,
    push,
    replace,
    go,
    back,
    forward,
    listen,
    block
  };

  return history;
};

/**
 * Browser history stores the location in regular URLs. This is the
 * standard for most web apps, but it requires some configuration on
 * the server to ensure you serve the same app at multiple URLs.
 */
export const createBrowserHistory = ({
  window = document.defaultView
} = {}) => {
  let globalHistory = window.history;

  let getIndexAndLocation = () => {
    let { pathname, search, hash } = window.location;
    let state = globalHistory.state || {};
    return [
      state.idx,
      createReadOnlyObject({
        pathname,
        search,
        hash,
        state: state.usr || null,
        key: state.key || 'default'
      })
    ];
  };

  let blockedPopTx = null;
  let handlePop = () => {
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
              retry: () => {
                go(n * -1);
              }
            };

            go(n);
          }
        } else {
          // Trying to POP to a location with no index. We did not create
          // this location, so we can't effectively block the navigation.
          if (__DEV__) {
            // TODO: Write up a doc that explains our blocking strategy in
            // detail and link to it here so people can understand better
            // what is going on and how to avoid it.
            throw new Error(
              `You are trying to block a POP navigation to a location that was not ` +
                `created by the history library. The block will fail silently in ` +
                `production, but in general you should do all navigation with the ` +
                `history library (instead of using window.history.pushState directly) ` +
                `to avoid this situation.`
            );
          }
        }
      } else {
        applyTx(nextAction);
      }
    }
  };

  window.addEventListener(PopStateEventType, handlePop);

  let action = PopAction;
  let [index, location] = getIndexAndLocation();
  let blockers = createEvents();
  let listeners = createEvents();

  if (index == null) {
    index = 0;
    globalHistory.replaceState({ ...globalHistory.state, idx: index }, null);
  }

  let createHref = createPath;

  let getNextLocation = (to, state = null) =>
    createReadOnlyObject({
      ...location,
      ...(typeof to === 'string' ? parsePath(to) : to),
      state,
      key: createKey()
    });

  let getHistoryStateAndUrl = (nextLocation, index) => [
    {
      usr: nextLocation.state,
      key: nextLocation.key,
      idx: index
    },
    createHref(nextLocation)
  ];

  let allowTx = (action, location, retry) =>
    !blockers.length || (blockers.call({ action, location, retry }), false);

  let applyTx = nextAction => {
    action = nextAction;
    [index, location] = getIndexAndLocation();
    listeners.call({ action, location });
  };

  let push = (to, state) => {
    let nextAction = PushAction;
    let nextLocation = getNextLocation(to, state);
    let retry = () => push(to, state);

    if (allowTx(nextAction, nextLocation, retry)) {
      let [historyState, url] = getHistoryStateAndUrl(nextLocation, index + 1);

      // TODO: Support forced reloading
      // try...catch because iOS limits us to 100 pushState calls :/
      try {
        globalHistory.pushState(historyState, null, url);
      } catch (error) {
        // They are going to lose state here, but there is no real
        // way to warn them about it since the page will refresh...
        window.location.assign(url);
      }

      applyTx(nextAction);
    }
  };

  let replace = (to, state) => {
    let nextAction = ReplaceAction;
    let nextLocation = getNextLocation(to, state);
    let retry = () => replace(to, state);

    if (allowTx(nextAction, nextLocation, retry)) {
      let [historyState, url] = getHistoryStateAndUrl(nextLocation, index);

      // TODO: Support forced reloading
      globalHistory.replaceState(historyState, null, url);

      applyTx(nextAction);
    }
  };

  let go = n => {
    globalHistory.go(n);
  };

  let back = () => {
    go(-1);
  };

  let forward = () => {
    go(1);
  };

  let listen = fn => listeners.push(fn);

  let block = fn => {
    let unblock = blockers.push(fn);

    if (blockers.length === 1) {
      window.addEventListener(BeforeUnloadEventType, promptBeforeUnload);
    }

    return () => {
      unblock();

      // Remove the beforeunload listener so the document may
      // still be salvageable in the pagehide event.
      // See https://html.spec.whatwg.org/#unloading-documents
      if (!blockers.length) {
        window.removeEventListener(BeforeUnloadEventType, promptBeforeUnload);
      }
    };
  };

  let history = {
    get action() {
      return action;
    },
    get location() {
      return location;
    },
    createHref,
    push,
    replace,
    go,
    back,
    forward,
    listen,
    block
  };

  return history;
};

/**
 * Hash history stores the location in window.location.hash. This makes
 * it ideal for situations where you don't want to send the location to
 * the server for some reason, either because you do cannot configure it
 * or the URL space is reserved for something else.
 */
export const createHashHistory = ({ window = document.defaultView } = {}) => {
  let globalHistory = window.history;

  let getIndexAndLocation = () => {
    let { pathname = '/', search = '', hash = '' } = parsePath(
      window.location.hash.substr(1)
    );
    let state = globalHistory.state || {};
    return [
      state.idx,
      createReadOnlyObject({
        pathname,
        search,
        hash,
        state: state.usr || null,
        key: state.key || 'default'
      })
    ];
  };

  let blockedPopTx = null;
  let handlePop = () => {
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
              retry: () => {
                go(n * -1);
              }
            };

            go(n);
          }
        } else {
          // Trying to POP to a location with no index. We did not create
          // this location, so we can't effectively block the navigation.
          if (__DEV__) {
            // TODO: Write up a doc that explains our blocking strategy in
            // detail and link to it here so people can understand better
            // what is going on and how to avoid it.
            throw new Error(
              `You are trying to block a POP navigation to a location that was not ` +
                `created by the history library. The block will fail silently in ` +
                `production, but in general you should do all navigation with the ` +
                `history library (instead of using window.history.pushState directly) ` +
                `to avoid this situation.`
            );
          }
        }
      } else {
        applyTx(nextAction);
      }
    }
  };

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
    globalHistory.replaceState({ ...globalHistory.state, idx: index }, null);
  }

  let createHref = location => {
    let base = document.querySelector('base');
    let href = '';

    if (base && base.getAttribute('href')) {
      let url = window.location.href;
      let hashIndex = url.indexOf('#');
      href = hashIndex === -1 ? url : url.slice(0, hashIndex);
    }

    return href + '#' + createPath(location);
  };

  let getNextLocation = (to, state = null) =>
    createReadOnlyObject({
      ...location,
      ...(typeof to === 'string' ? parsePath(to) : to),
      state,
      key: createKey()
    });

  let getHistoryStateAndUrl = (nextLocation, index) => [
    {
      usr: nextLocation.state,
      key: nextLocation.key,
      idx: index
    },
    createHref(nextLocation)
  ];

  let allowTx = (action, location, retry) =>
    !blockers.length || (blockers.call({ action, location, retry }), false);

  let applyTx = nextAction => {
    action = nextAction;
    [index, location] = getIndexAndLocation();
    listeners.call({ action, location });
  };

  let push = (to, state) => {
    let nextAction = PushAction;
    let nextLocation = getNextLocation(to, state);
    let retry = () => push(to, state);

    if (__DEV__) {
      if (nextLocation.pathname.charAt(0) !== '/') {
        let arg = JSON.stringify(to);
        throw new Error(
          `Relative pathnames are not supported in createHashHistory().push(${arg})`
        );
      }
    }

    if (allowTx(nextAction, nextLocation, retry)) {
      let [historyState, url] = getHistoryStateAndUrl(nextLocation, index + 1);

      // TODO: Support forced reloading
      // try...catch because iOS limits us to 100 pushState calls :/
      try {
        globalHistory.pushState(historyState, null, url);
      } catch (error) {
        // They are going to lose state here, but there is no real
        // way to warn them about it since the page will refresh...
        window.location.assign(url);
      }

      applyTx(nextAction);
    }
  };

  let replace = (to, state) => {
    let nextAction = ReplaceAction;
    let nextLocation = getNextLocation(to, state);
    let retry = () => replace(to, state);

    if (__DEV__) {
      if (nextLocation.pathname.charAt(0) !== '/') {
        let arg = JSON.stringify(to);
        throw new Error(
          `Relative pathnames are not supported in createHashHistory().replace(${arg})`
        );
      }
    }

    if (allowTx(nextAction, nextLocation, retry)) {
      let [historyState, url] = getHistoryStateAndUrl(nextLocation, index);

      // TODO: Support forced reloading
      globalHistory.replaceState(historyState, null, url);

      applyTx(nextAction);
    }
  };

  let go = n => {
    globalHistory.go(n);
  };

  let back = () => {
    go(-1);
  };

  let forward = () => {
    go(1);
  };

  let listen = fn => listeners.push(fn);

  let block = fn => {
    let unblock = blockers.push(fn);

    if (blockers.length === 1) {
      window.addEventListener(BeforeUnloadEventType, promptBeforeUnload);
    }

    return () => {
      unblock();

      // Remove the beforeunload listener so the document may
      // still be salvageable in the pagehide event.
      // See https://html.spec.whatwg.org/#unloading-documents
      if (!blockers.length) {
        window.removeEventListener(BeforeUnloadEventType, promptBeforeUnload);
      }
    };
  };

  let history = {
    get action() {
      return action;
    },
    get location() {
      return location;
    },
    createHref,
    push,
    replace,
    go,
    back,
    forward,
    listen,
    block
  };

  return history;
};

// Utils

const promptBeforeUnload = event => {
  // Cancel the event.
  event.preventDefault();
  // Chrome (and legacy IE) requires returnValue to be set.
  event.returnValue = '';
};

const createKey = () =>
  Math.random()
    .toString(36)
    .substr(2, 8);

// TODO: Probably only do this in dev?
const createReadOnlyObject = props =>
  Object.keys(props).reduce(
    (obj, key) =>
      Object.defineProperty(obj, key, { enumerable: true, value: props[key] }),
    Object.create(null)
  );

const createPath = ({ pathname = '/', search = '', hash = '' }) =>
  pathname + search + hash;

let parsePath = path => {
  let pieces = {};

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
};

const createEvents = () => {
  let handlers = [];

  return {
    get length() {
      return handlers.length;
    },
    push: fn =>
      handlers.push(fn) &&
      (() => {
        handlers = handlers.filter(handler => handler !== fn);
      }),
    call: arg => {
      handlers.forEach(fn => fn && fn(arg));
    }
  };
};

const clamp = (n, lowerBound, upperBound) =>
  Math.min(Math.max(n, lowerBound), upperBound);
