import warning from 'warning';
import invariant from 'invariant';
import { PUSH, REPLACE, POP } from './Actions';
import { canUseDOM } from './ExecutionEnvironment';
import { addEventListener, removeEventListener, readState, saveState, getHashPath, replaceHashPath, supportsGoWithoutReloadUsingHash } from './DOMUtils';
import createDOMHistory from './createDOMHistory';
import createLocation from './createLocation';

function isAbsolutePath(path) {
  return typeof path === 'string' && path.charAt(0) === '/';
}

function ensureSlash() {
  var path = getHashPath();

  if (isAbsolutePath(path))
    return true;

  replaceHashPath('/' + path);

  return false;
}

function addQueryStringValueToPath(path, key, value) {
  return path + (path.indexOf('?') === -1 ? '?' : '&') + `${key}=${value}`;
}

function stripQueryStringValueFromPath(path, key) {
  return path.replace(new RegExp(`[?&]?${key}=[a-zA-Z0-9]+`), '');
}

function getQueryStringValueFromPath(path, key) {
  var match = path.match(new RegExp(`\\?.*?\\b${key}=(.+?)\\b`));
  return match && match[1];
}

var DefaultQueryKey = '_k';

function createHashHistory(options={}) {
  invariant(
    canUseDOM,
    'Hash history needs a DOM'
  );

  var { queryKey } = options;

  if (queryKey === undefined || !!queryKey)
    queryKey = typeof queryKey === 'string' ? queryKey : DefaultQueryKey;

  function getCurrentLocation() {
    var path = getHashPath();
    
    var key, state;
    if (queryKey) {
      key = getQueryStringValueFromPath(path, queryKey);
      path = stripQueryStringValueFromPath(path, queryKey);
      state = key && readState(key);
    }

    return createLocation(path, state, undefined, key);
  }

  function startHashChangeListener({ transitionTo }) {
    function hashChangeListener() {
      if (!ensureSlash())
        return; // Always make sure hashes are preceeded with a /.

      transitionTo(
        getCurrentLocation()
      );
    };

    ensureSlash();
    addEventListener(window, 'hashchange', hashChangeListener);

    return function () {
      removeEventListener(window, 'hashchange', hashChangeListener);
    };
  }

  function finishTransition(location) {
    var { key, pathname, search, action } = location;

    if (action === POP)
      return; // Nothing to do.

    var path = pathname + search;

    if (queryKey)
      path = addQueryStringValueToPath(path, queryKey, key);

    if (path === getHashPath()) {
      warning(
        false,
        'You cannot %s the same path using hash history',
        action
      );
    } else {
      if (queryKey) {
        saveState(location.key, location.state);
      } else {
        // Drop key and state.
        location.key = location.state = null;
      }

      if (action === PUSH) {
        window.location.hash = path;
      } else {
        replaceHashPath(path);
      }
    }
  }

  function cancelTransition(location) {
    if (location.action === POP) {
      var n = 0; // TODO: Figure out what n will put the URL back.
      go(n);
    }
  }

  var history = createDOMHistory({
    ...options,
    getCurrentLocation,
    finishTransition,
    cancelTransition
  });

  var listenerCount = 0, stopHashChangeListener;

  function listen(listener) {
    if (++listenerCount === 1)
      stopHashChangeListener = startHashChangeListener(history);

    var unlisten = history.listen(listener);

    return function () {
      unlisten();

      if (--listenerCount === 0)
        stopHashChangeListener();
    };
  }

  function pushState(state, path) {
    warning(
      queryKey || state == null,
      'You cannot use state without a queryKey; it will be dropped'
    );

    history.pushState(state, path);
  }

  function replaceState(state, path) {
    warning(
      queryKey || state == null,
      'You cannot use state without a queryKey; it will be dropped'
    );

    history.replaceState(state, path);
  }

  var goIsSupportedWithoutReload = supportsGoWithoutReloadUsingHash();

  function go(n) {
    warning(
      goIsSupportedWithoutReload,
      'Hash history go(n) causes a full page reload in this browser'
    );

    history.go(n);
  }

  function createHref(path) {
    return '#' + history.createHref(path);
  }

  return {
    ...history,
    listen,
    pushState,
    replaceState,
    go,
    createHref
  };
}

export default createHashHistory;
