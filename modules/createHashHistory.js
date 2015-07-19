import warning from 'warning';
import { PUSH, REPLACE, POP } from './Actions';
import { addEventListener, removeEventListener, readState, getHashPath, replaceHashPath, go } from './DOMUtils';
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

function getQueryStringValueFromPath(path, key) {
  var match = path.match(new RegExp(`\\?.*?\\b${key}=(.+?)\\b`));
  return match && match[1];
}

var DefaultQueryKey = '_k';

function createHashHistory(options={}) {
  var { queryKey } = options;

  if (queryKey && typeof queryKey !== 'string')
    queryKey = DefaultQueryKey;

  function getCurrentLocation() {
    var path = getHashPath();
    
    var key, state;
    if (queryKey) {
      key = getQueryStringValueFromPath(path, queryKey);
      state = key && readState(key);
    }

    return createLocation(key, state, path);
  }

  var ignoreNextHashChange = false;
  var lastHashPath;

  function startHashChangeListener({ transitionTo }) {
    function listener() {
      var hashPath = getHashPath();

      if (!ensureSlash())
        return; // Always make sure hashes are preceeded with a /.

      if (lastHashPath === hashPath)
        return; // Prevent false positives.

      lastHashPath = hashPath;

      if (ignoreNextHashChange) {
        ignoreNextHashChange = false;
        return;
      }

      transitionTo(
        getCurrentLocation()
      );
    }

    ensureSlash();
    addEventListener(window, 'hashchange', listener);

    return function () {
      removeEventListener(window, 'hashchange', listener);
    };
  }

  function finishTransition(location) {
    var { key, pathname, search } = location;
    var path = pathname + search;

    if (queryKey)
      path = addQueryStringValueToPath(path, queryKey, key);

    var hashWillChange = (path !== getHashPath());

    warning(
      hashWillChange,
      'You cannot push/replace the same path using hash history'
    );

    switch (location.action) {
      case PUSH:
        if (hashWillChange) {
          ignoreNextHashChange = true;
          window.location.hash = path;
        }
        break;
      case REPLACE:
        if (hashWillChange) {
          ignoreNextHashChange = true;
          replaceHashPath(path);
        }
        break;
    }
  }

  function cancelTransition(location) {
    if (location.action === POP) {
      var n = 0; // TODO: Figure out what n will put the URL back.

      if (n) {
        ignoreNextHashChange = true;
        go(n);
      }
    }
  }

  var history = createDOMHistory({
    ...options,
    getCurrentLocation,
    finishTransition,
    cancelTransition
  });

  var listenerCount = 0;
  var stopHashChangeListener;

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

  return {
    ...history,
    listen
  };
}

export default createHashHistory;
