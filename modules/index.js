const PopAction = 'POP';
const PushAction = 'PUSH';
const ReplaceAction = 'REPLACE';

const PopStateEvent = 'popstate';
const HashChangeEvent = 'hashchange';

// There's some duplication in this code, but only one create* method
// should ever be used in a given web page, so it's best to just inline
// everything for minification.

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
    key = createKey()
  }) => createReadOnlyObject({ pathname, search, hash, state, key });

  let createNextLocation = (to, state) =>
    createLocation({
      ...(typeof to === 'string' ? parsePath(to) : to),
      state,
      key: createKey()
    });

  let handleAction = (nextIndex, nextAction, nextLocation) => {
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
      index = nextIndex;
      if (nextAction === PushAction) {
        entries.splice(index, entries.length, nextLocation);
      } else if (nextAction === ReplaceAction) {
        entries[index] = nextLocation;
      }
      action = nextAction;
      location = nextLocation || entries[index];
      listeners.call({ action, location });
    }
  };

  let entries = initialEntries.map(entry =>
    createLocation(typeof entry === 'string' ? parsePath(entry) : entry)
  );
  let index = clamp(initialIndex, 0, entries.length - 1);

  let action = PopAction;
  let location = entries[index];
  let blockers = createEvents();
  let listeners = createEvents();

  let history = {
    createHref: createPath,
    block: fn => blockers.push(fn),
    listen: fn => listeners.push(fn),
    push: (to, state) =>
      handleAction(index + 1, PushAction, createNextLocation(to, state)),
    replace: (to, state) =>
      handleAction(index, ReplaceAction, createNextLocation(to, state)),
    go: n => handleAction(clamp(index + n, 0, entries.length - 1), PopAction),
    back: () => history.go(-1),
    forward: () => history.go(1)
  };

  Object.defineProperty(history, 'action', {
    enumerable: true,
    get: () => action
  });

  Object.defineProperty(history, 'location', {
    enumerable: true,
    get: () => location
  });

  return history;
};

export const createBrowserHistory = ({
  window = document.defaultView
} = {}) => {
  let getLocation = () => {
    let { pathname, search, hash } = window.location;
    let { state } = window.history;
    return createReadOnlyObject({
      pathname,
      search,
      hash,
      state: (state && state.user) || null,
      key: (state && state.key) || 'default'
    });
  };

  let createNextLocation = (to, state) =>
    createReadOnlyObject({
      ...(typeof to === 'string'
        ? parsePath(to)
        : { pathname: '/', search: '', hash: '', ...to }),
      state,
      key: createKey()
    });

  // TODO: Support forceRefresh and do NOT notify listeners when used.
  let handleAction = (nextAction, nextLocation) => {
    if (blockers.length) {
      blockers.call({ action: nextAction, location: nextLocation });

      if (nextAction === PopAction) {
        // TODO: revert the POP
      }
    } else {
      let state = { user: nextLocation.state, key: nextLocation.key };
      let url = createPath(nextLocation);

      if (nextAction === PushAction) {
        // try...catch because iOS limits us to 100 pushState calls :/
        try {
          window.history.pushState(state, null, url);
        } catch (error) {
          // They are going to lose state here, but there is no real
          // way to warn them about it since the page will refresh...
          window.location.assign(url);
        }
      } else if (nextAction === ReplaceAction) {
        window.history.replaceState(state, null, url);
      }

      action = nextAction;
      location = getLocation();
      listeners.call({ action, location });
    }
  };

  let action = PopAction;
  let location = getLocation();
  let blockers = createEvents();
  let listeners = createEvents();

  window.addEventListener(PopStateEvent, event => {
    handleAction(PopAction, getLocation());
  });

  let history = {
    createHref: createPath,
    block: fn => blockers.push(fn),
    listen: fn => listeners.push(fn),
    push: (to, state) =>
      handleAction(PushAction, createNextLocation(to, state)),
    replace: (to, state) =>
      handleAction(ReplaceAction, createNextLocation(to, state)),
    go: n => window.history.go(n),
    back: () => history.go(-1),
    forward: () => history.go(1)
  };

  Object.defineProperty(history, 'action', {
    enumerable: true,
    get: () => action
  });

  Object.defineProperty(history, 'location', {
    enumerable: true,
    get: () => location
  });

  return history;
};

export const createHashHistory = ({ window = document.defaultView } = {}) => {
  let getLocation = () => {
    let { pathname, search, hash } = parsePath(window.location.hash.substr(1));
    let { state } = window.history;
    return createReadOnlyObject({
      pathname,
      search,
      hash,
      state: (state && state.user) || null,
      key: (state && state.key) || 'default'
    });
  };

  let createNextLocation = (to, state) =>
    createReadOnlyObject({
      ...(typeof to === 'string'
        ? parsePath(to)
        : { pathname: '/', search: '', hash: '', ...to }),
      state,
      key: createKey()
    });

  let action = PopAction;
  let location = getLocation();
  let blockers = createEvents();
  let listeners = createEvents();

  // TODO: Support forceRefresh and do NOT notify listeners when used.
  let handleAction = (nextAction, nextLocation) => {
    if (__DEV__) {
      if (nextLocation.pathname.charAt(0) !== '/') {
        let arg = createPath(nextLocation);
        let fnCall = `${nextAction.toLowerCase()}("${arg}")`;
        throw new Error(
          `Relative pathnames are not supported in createHashHistory().${fnCall}`
        );
      }
    }

    if (blockers.length) {
      blockers.call({ action: nextAction, location: nextLocation });

      if (nextAction === PopAction) {
        // TODO: revert the POP
      }
    } else {
      let state = { user: nextLocation.state, key: nextLocation.key };
      // TODO: Handle relative paths? Or just warn about them?
      // TODO: Support different "hash types"?
      let url = '#' + createPath(nextLocation);

      if (nextAction === PushAction) {
        // try...catch because iOS limits us to 100 pushState calls :/
        try {
          window.history.pushState(state, null, url);
        } catch (error) {
          // They are going to lose state here, but there is no real
          // way to warn them about it since the page will refresh...
          window.location.assign(url);
        }
      } else if (nextAction === ReplaceAction) {
        window.history.replaceState(state, null, url);
      }

      action = nextAction;
      location = getLocation();
      listeners.call({ action, location });
    }
  };

  window.addEventListener(PopStateEvent, event => {
    handleAction(PopAction, getLocation());
  });

  window.addEventListener(HashChangeEvent, event => {
    let nextLocation = getLocation();

    // Ignore extraneous hashchange events.
    if (createPath(nextLocation) !== createPath(location)) {
      handleAction(PopAction, getLocation());
    }
  });

  let history = {
    createHref: location => {
      let base = document.querySelector('base');
      let href = '';
      if (base && base.getAttribute('href')) {
        href = stripHash(window.location.href);
      }
      return href + '#' + createPath(location);
    },
    block: fn => blockers.push(fn),
    listen: fn => listeners.push(fn),
    push: (to, state) =>
      handleAction(PushAction, createNextLocation(to, state)),
    replace: (to, state) =>
      handleAction(ReplaceAction, createNextLocation(to, state)),
    go: n => window.history.go(n),
    back: () => history.go(-1),
    forward: () => history.go(1)
  };

  Object.defineProperty(history, 'action', {
    enumerable: true,
    get: () => action
  });

  Object.defineProperty(history, 'location', {
    enumerable: true,
    get: () => location
  });

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
    push(fn) {
      handlers.push(fn);
      return () => {
        handlers = handlers.filter(handler => handler !== fn);
      };
    },
    call(...args) {
      handlers.forEach(fn => fn && fn(...args));
    }
  };
};

const clamp = (n, lowerBound, upperBound) =>
  Math.min(Math.max(n, lowerBound), upperBound);
