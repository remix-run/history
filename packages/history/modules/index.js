const PopAction = 'POP';
const PushAction = 'PUSH';
const ReplaceAction = 'REPLACE';

const BeforeUnloadEventType = 'beforeunload';
const HashChangeEventType = 'hashchange';
const PopStateEventType = 'popstate';

const readOnly = __DEV__ ? obj => Object.freeze(obj) : obj => obj;

function warning(cond, message) {
  if (!cond) {
    // eslint-disable-next-line no-console
    if (typeof console !== 'undefined') console.warn(message);

    try {
      throw new Error(message);
      // eslint-disable-next-line no-empty
    } catch (e) {}
  }
}

////////////////////////////////////////////////////////////////////////////////
// BROWSER
////////////////////////////////////////////////////////////////////////////////

/**
 * Browser history stores the location in regular URLs. This is the
 * standard for most web apps, but it requires some configuration on
 * the server to ensure you serve the same app at multiple URLs.
 */
export function createBrowserHistory({ window = document.defaultView } = {}) {
  let globalHistory = window.history;

  function getIndexAndLocation() {
    let { pathname, search, hash } = window.location;
    let state = globalHistory.state || {};
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

  let blockedPopTx = null;
  function handlePop() {
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

  let action = PopAction;
  let [index, location] = getIndexAndLocation();
  let blockers = createEvents();
  let listeners = createEvents();

  if (index == null) {
    index = 0;
    globalHistory.replaceState({ ...globalHistory.state, idx: index }, null);
  }

  function createHref(to) {
    return typeof to === 'string' ? to : createPath(to);
  }

  function getNextLocation(to, state = null) {
    return readOnly({
      ...location,
      ...(typeof to === 'string' ? parsePath(to) : to),
      state,
      key: createKey()
    });
  }

  function getHistoryStateAndUrl(nextLocation, index) {
    return [
      {
        usr: nextLocation.state,
        key: nextLocation.key,
        idx: index
      },
      createHref(nextLocation)
    ];
  }

  function allowTx(action, location, retry) {
    return (
      !blockers.length || (blockers.call({ action, location, retry }), false)
    );
  }

  function applyTx(nextAction) {
    action = nextAction;
    [index, location] = getIndexAndLocation();
    listeners.call({ action, location });
  }

  function push(to, state) {
    let nextAction = PushAction;
    let nextLocation = getNextLocation(to, state);
    function retry() {
      push(to, state);
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
  }

  function replace(to, state) {
    let nextAction = ReplaceAction;
    let nextLocation = getNextLocation(to, state);
    function retry() {
      replace(to, state);
    }

    if (allowTx(nextAction, nextLocation, retry)) {
      let [historyState, url] = getHistoryStateAndUrl(nextLocation, index);

      // TODO: Support forced reloading
      globalHistory.replaceState(historyState, null, url);

      applyTx(nextAction);
    }
  }

  function go(n) {
    globalHistory.go(n);
  }

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
    back() {
      go(-1);
    },
    forward() {
      go(1);
    },
    listen(fn) {
      return listeners.push(fn);
    },
    block(fn) {
      let unblock = blockers.push(fn);

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
export function createHashHistory({ window = document.defaultView } = {}) {
  let globalHistory = window.history;

  function getIndexAndLocation() {
    let { pathname = '/', search = '', hash = '' } = parsePath(
      window.location.hash.substr(1)
    );
    let state = globalHistory.state || {};
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

  let blockedPopTx = null;
  function handlePop() {
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
    globalHistory.replaceState({ ...globalHistory.state, idx: index }, null);
  }

  function getBaseHref() {
    let base = document.querySelector('base');
    let href = '';

    if (base && base.getAttribute('href')) {
      let url = window.location.href;
      let hashIndex = url.indexOf('#');
      href = hashIndex === -1 ? url : url.slice(0, hashIndex);
    }

    return href;
  }

  function createHref(to) {
    return getBaseHref() + '#' + (typeof to === 'string' ? to : createPath(to));
  }

  function getNextLocation(to, state = null) {
    return readOnly({
      ...location,
      ...(typeof to === 'string' ? parsePath(to) : to),
      state,
      key: createKey()
    });
  }

  function getHistoryStateAndUrl(nextLocation, index) {
    return [
      {
        usr: nextLocation.state,
        key: nextLocation.key,
        idx: index
      },
      createHref(nextLocation)
    ];
  }

  function allowTx(action, location, retry) {
    return (
      !blockers.length || (blockers.call({ action, location, retry }), false)
    );
  }

  function applyTx(nextAction) {
    action = nextAction;
    [index, location] = getIndexAndLocation();
    listeners.call({ action, location });
  }

  function push(to, state) {
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
        globalHistory.pushState(historyState, null, url);
      } catch (error) {
        // They are going to lose state here, but there is no real
        // way to warn them about it since the page will refresh...
        window.location.assign(url);
      }

      applyTx(nextAction);
    }
  }

  function replace(to, state) {
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
      globalHistory.replaceState(historyState, null, url);

      applyTx(nextAction);
    }
  }

  function go(n) {
    globalHistory.go(n);
  }

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
    back() {
      go(-1);
    },
    forward() {
      go(1);
    },
    listen(fn) {
      return listeners.push(fn);
    },
    block(fn) {
      let unblock = blockers.push(fn);

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
export function createMemoryHistory({
  initialEntries = ['/'],
  initialIndex = 0
} = {}) {
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

  function createHref(to) {
    return typeof to === 'string' ? to : createPath(to);
  }

  function getNextLocation(to, state = null) {
    return readOnly({
      ...location,
      ...(typeof to === 'string' ? parsePath(to) : to),
      state,
      key: createKey()
    });
  }

  function allowTx(action, location, retry) {
    return (
      !blockers.length || (blockers.call({ action, location, retry }), false)
    );
  }

  function applyTx(nextAction, nextLocation) {
    action = nextAction;
    location = nextLocation;
    listeners.call({ action, location });
  }

  function push(to, state) {
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

  function replace(to, state) {
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

  function go(n) {
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
    get index() {
      return index;
    },
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
    back() {
      go(-1);
    },
    forward() {
      go(1);
    },
    listen(fn) {
      return listeners.push(fn);
    },
    block(fn) {
      return blockers.push(fn);
    }
  };

  return history;
}

function clamp(n, lowerBound, upperBound) {
  return Math.min(Math.max(n, lowerBound), upperBound);
}

////////////////////////////////////////////////////////////////////////////////
// UTILS
////////////////////////////////////////////////////////////////////////////////

function promptBeforeUnload(event) {
  // Cancel the event.
  event.preventDefault();
  // Chrome (and legacy IE) requires returnValue to be set.
  event.returnValue = '';
}

function createEvents() {
  let handlers = [];

  return {
    get length() {
      return handlers.length;
    },
    push(fn) {
      handlers.push(fn);
      return function() {
        handlers = handlers.filter(handler => handler !== fn);
      };
    },
    call(arg) {
      handlers.forEach(fn => fn && fn(arg));
    }
  };
}

function createKey() {
  return Math.random()
    .toString(36)
    .substr(2, 8);
}

export function createPath({ pathname = '/', search = '', hash = '' }) {
  return pathname + search + hash;
}

export function parsePath(path) {
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
}
