import { createEvents, createKey, createPath, parsePath } from './utils.js';

const PopAction = 'POP';
const PushAction = 'PUSH';
const ReplaceAction = 'REPLACE';

const readOnly = __DEV__ ? obj => Object.freeze(obj) : obj => obj;

function clamp(n, lowerBound, upperBound) {
  return Math.min(Math.max(n, lowerBound), upperBound);
}

/**
 * Memory history stores the current location in memory. It is designed
 * for use in stateful non-browser environments like headless tests (in
 * node.js) and React Native.
 */
export function createHistory({
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
  }

  function replace(to, state) {
    let nextAction = ReplaceAction;
    let nextLocation = getNextLocation(to, state);
    function retry() {
      replace(to, state);
    }

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
