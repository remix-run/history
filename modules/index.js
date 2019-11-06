const PopAction = 'POP';
const PushAction = 'PUSH';
const ReplaceAction = 'REPLACE';

const BeforeUnloadEvent = 'beforeunload';
const PopStateEvent = 'popstate';
const HashChangeEvent = 'hashchange';

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
  let createLocation = ({
    pathname = '/',
    search = '',
    hash = '',
    state = null,
    // Auto-assign keys to entries that don't already have them.
    key = createKey(),
    index
  }) => createReadOnlyObject({ pathname, search, hash, state, key, index });

  let handleNavigation = (nextAction, nextLocation) => {
    if (__DEV__) {
      if (nextLocation && nextLocation.pathname.charAt(0) !== '/') {
        let arg = createPath(nextLocation);
        let fnCall = `${nextAction.toLowerCase()}("${arg}")`;
        throw new Error(
          `Relative pathnames are not supported in createMemoryHistory().${fnCall}`
        );
      }
    }

    if (blockers.length) {
      blockers.call({ action: nextAction, location: nextLocation });
    } else {
      if (nextAction === PushAction) {
        entries.splice(nextLocation.index, entries.length, nextLocation);
      } else if (nextAction === ReplaceAction) {
        entries[nextLocation.index] = nextLocation;
      }
      action = nextAction;
      location = nextLocation;
      listeners.call({ action, location });
    }
  };

  let entries = initialEntries.map((entry, index) =>
    createLocation({
      ...(typeof entry === 'string' ? parsePath(entry) : entry),
      index
    })
  );

  let action = PopAction;
  let location = entries[clamp(initialIndex, 0, entries.length - 1)];
  let blockers = createEvents();
  let listeners = createEvents();

  let history = {
    get action() {
      return action;
    },
    get location() {
      return location;
    },
    createHref: createPath,
    block: fn => blockers.push(fn),
    listen: fn => listeners.push(fn),
    navigate: (to, { replace = false, state = null } = {}) =>
      handleNavigation(
        replace ? ReplaceAction : PushAction,
        createLocation({
          ...(typeof to === 'string' ? parsePath(to) : to),
          state,
          key: createKey(),
          index: location.index + (replace ? 0 : 1)
        })
      ),
    retry: tx =>
      history.navigate(createPath(tx.location), {
        replace: tx.action === ReplaceAction,
        state: tx.location.state
      }),
    go: n =>
      handleNavigation(
        PopAction,
        entries[clamp(location.index + n, 0, entries.length - 1)]
      ),
    back: () => history.go(-1),
    forward: () => history.go(1)
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

  let getLocation = () => {
    let { pathname, search, hash } = window.location;
    let state = globalHistory.state || {};
    return createReadOnlyObject({
      pathname,
      search,
      hash,
      state: state.usr || null,
      key: state.key || 'default',
      index: state.idx
    });
  };

  let blockedPopTx = null;

  // TODO: Add reload arg to force page refresh
  let handleNavigation = (nextAction, nextLocation) => {
    if (nextAction === PopAction && blockedPopTx) {
      blockers.call(blockedPopTx);
      blockedPopTx = null;
    } else if (blockers.length) {
      let tx = { action: nextAction, location: nextLocation };

      if (nextAction === PopAction) {
        if (nextLocation.index != null) {
          let n = location.index - nextLocation.index;
          if (n) {
            // Revert the POP
            tx.delta = n * -1;
            blockedPopTx = tx;
            history.go(n);
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
        blockers.call(tx);
      }
    } else {
      let state = {
        usr: nextLocation.state,
        key: nextLocation.key,
        idx: nextLocation.index
      };
      let url = createPath(nextLocation);

      if (nextAction === PushAction) {
        // try...catch because iOS limits us to 100 pushState calls :/
        try {
          globalHistory.pushState(state, null, url);
        } catch (error) {
          // They are going to lose state here, but there is no real
          // way to warn them about it since the page will refresh...
          window.location.assign(url);
        }
      } else if (nextAction === ReplaceAction) {
        globalHistory.replaceState(state, null, url);
      }

      action = nextAction;
      // Get the location fresh so we can support relative paths.
      location = getLocation();
      listeners.call({ action, location });
    }
  };

  let toggleBeforeUnloadBlocker = on =>
    window[`${on ? 'add' : 'remove'}EventListener`](
      BeforeUnloadEvent,
      preventUnload
    );

  // Initialize the index for this document.
  globalHistory.replaceState({ ...globalHistory.state, idx: 0 }, null);

  window.addEventListener(PopStateEvent, event => {
    handleNavigation(PopAction, getLocation());
  });

  let action = PopAction;
  let location = getLocation();
  let blockers = createEvents();
  let listeners = createEvents();

  let history = {
    get action() {
      return action;
    },
    get location() {
      return location;
    },
    createHref: createPath,
    block: fn => {
      let unblock = blockers.push(fn);
      if (blockers.length === 1) toggleBeforeUnloadBlocker(1);
      return () => {
        unblock();
        // Remove the beforeunload listener so the document may
        // still be salvageable in the pagehide event.
        // See https://html.spec.whatwg.org/#unloading-documents
        if (!blockers.length) toggleBeforeUnloadBlocker(0);
      };
    },
    listen: fn => listeners.push(fn),
    navigate: (to, { replace = false, state = null } = {}) =>
      handleNavigation(
        replace ? ReplaceAction : PushAction,
        createReadOnlyObject({
          ...(typeof to === 'string'
            ? parsePath(to)
            : { pathname: '/', search: '', hash: '', ...to }),
          state,
          key: createKey(),
          index: location.index + (replace ? 0 : 1)
        })
      ),
    retry: tx =>
      tx.delta
        ? history.go(tx.delta)
        : history.navigate(createPath(tx.location), {
            replace: tx.action === ReplaceAction,
            state: tx.location.state
          }),
    go: n => globalHistory.go(n),
    back: () => history.go(-1),
    forward: () => history.go(1)
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

  let getLocation = () => {
    let { pathname, search, hash } = parsePath(window.location.hash.substr(1));
    let state = globalHistory.state || {};
    return createReadOnlyObject({
      pathname,
      search,
      hash,
      state: state.usr || null,
      key: state.key || 'default',
      index: state.idx
    });
  };

  let blockedPopTx = null;

  // TODO: Add reload arg
  let handleNavigation = (nextAction, nextLocation) => {
    if (__DEV__) {
      if (nextLocation.pathname.charAt(0) !== '/') {
        let arg = createPath(nextLocation);
        let fnCall = `${nextAction.toLowerCase()}("${arg}")`;
        throw new Error(
          `Relative pathnames are not supported in createHashHistory().${fnCall}`
        );
      }
    }

    if (nextAction === PopAction && blockedPopTx) {
      // Now that we are back at the original URL,
      // call blockers with the transition we blocked.
      blockers.call(blockedPopTx);
      blockedPopTx = null;
    } else if (blockers.length) {
      let tx = { action: nextAction, location: nextLocation };

      if (nextAction === PopAction) {
        if (nextLocation.index != null) {
          let n = location.index - nextLocation.index;
          if (n) {
            // Revert the POP
            tx.delta = n * -1;
            blockedPopTx = tx;
            history.go(n);
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
        blockers.call(tx);
      }
    } else {
      let state = {
        usr: nextLocation.state,
        key: nextLocation.key,
        idx: nextLocation.index
      };
      // TODO: Support different "hash types"?
      let url = '#' + createPath(nextLocation);

      if (nextAction === PushAction) {
        // try...catch because iOS limits us to 100 pushState calls :/
        try {
          globalHistory.pushState(state, null, url);
        } catch (error) {
          // They are going to lose state here, but there is no real
          // way to warn them about it since the page will refresh...
          window.location.assign(url);
        }
      } else if (nextAction === ReplaceAction) {
        globalHistory.replaceState(state, null, url);
      }

      action = nextAction;
      location = getLocation();
      listeners.call({ action, location });
    }
  };

  let toggleBeforeUnloadBlocker = on =>
    window[`${on ? 'add' : 'remove'}EventListener`](
      BeforeUnloadEvent,
      preventUnload
    );

  // Initialize the index for this document.
  globalHistory.replaceState({ ...globalHistory.state, idx: 0 }, null);

  window.addEventListener(PopStateEvent, event => {
    handleNavigation(PopAction, getLocation());
  });

  // TODO: Is this still necessary? Which browsers do
  // not trigger popstate when the hash changes?
  window.addEventListener(HashChangeEvent, event => {
    let nextLocation = getLocation();

    // Ignore extraneous hashchange events.
    if (createPath(nextLocation) !== createPath(location)) {
      handleNavigation(PopAction, nextLocation);
    }
  });

  let action = PopAction;
  let location = getLocation();
  let blockers = createEvents();
  let listeners = createEvents();

  let history = {
    get action() {
      return action;
    },
    get location() {
      return location;
    },
    createHref: location => {
      let base = document.querySelector('base');
      let href = '';
      if (base && base.getAttribute('href')) {
        href = stripHash(window.location.href);
      }
      return href + '#' + createPath(location);
    },
    block: fn => {
      let unblock = blockers.push(fn);
      if (blockers.length === 1) toggleBeforeUnloadBlocker(1);
      return () => {
        unblock();
        // Remove the beforeunload listener so the document may
        // still be salvageable in the pagehide event.
        // See https://html.spec.whatwg.org/#unloading-documents
        if (!blockers.length) toggleBeforeUnloadBlocker(0);
      };
    },
    listen: fn => listeners.push(fn),
    navigate: (to, { replace = false, state = null } = {}) =>
      handleNavigation(
        replace ? ReplaceAction : PushAction,
        createReadOnlyObject({
          ...(typeof to === 'string'
            ? parsePath(to)
            : { pathname: '/', search: '', hash: '', ...to }),
          state,
          key: createKey(),
          index: location.index + (replace ? 0 : 1)
        })
      ),
    retry: tx =>
      tx.delta
        ? history.go(tx.delta)
        : history.navigate(createPath(tx.location), {
            replace: tx.action === ReplaceAction,
            state: tx.location.state
          }),
    go: n => globalHistory.go(n),
    back: () => history.go(-1),
    forward: () => history.go(1)
  };

  return history;
};

// Utils

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

const stripHash = url => {
  let hashIndex = url.indexOf('#');
  return hashIndex === -1 ? url : url.slice(0, hashIndex);
};

const createPath = ({ pathname = '/', search = '', hash = '' }) =>
  pathname + search + hash;

const parsePath = path => {
  let pathname = path || '/';
  let search = '';
  let hash = '';

  let hashIndex = pathname.indexOf('#');
  if (hashIndex >= 0) {
    hash = pathname.substr(hashIndex);
    pathname = pathname.substr(0, hashIndex);
  }

  let searchIndex = pathname.indexOf('?');
  if (searchIndex >= 0) {
    search = pathname.substr(searchIndex);
    pathname = pathname.substr(0, searchIndex);
  }

  return { pathname, search, hash };
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
    call: arg => handlers.map(fn => fn && fn(arg))
  };
};

const clamp = (n, lowerBound, upperBound) =>
  Math.min(Math.max(n, lowerBound), upperBound);

const preventUnload = event => {
  // Cancel the event.
  event.preventDefault();
  // Chrome (and legacy IE) requires returnValue to be set.
  event.returnValue = '';
};
