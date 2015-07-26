import invariant from 'invariant';
import { PUSH, REPLACE, POP } from './Actions';
import { canUseDOM } from './ExecutionEnvironment';
import { addEventListener, removeEventListener, readState, saveState, getWindowPath, go, supportsHistory } from './DOMUtils';
import createDOMHistory from './createDOMHistory';
import createLocation from './createLocation';

function getCurrentLocation(historyState) {
  historyState = historyState || window.history.state || {};

  var { key } = historyState;
  var state = key && readState(key);
  var path = getWindowPath();

  return createLocation(path, state, undefined, key);
}

var ignoreNextPopState = false;

function startPopStateListener({ transitionTo }) {
  function listener(event) {
    if (event.state === undefined)
      return; // Ignore extraneous popstate events in WebKit.

    if (ignoreNextPopState) {
      ignoreNextPopState = false;
      return;
    }

    transitionTo(
      getCurrentLocation(event.state)
    );
  }

  addEventListener(window, 'popstate', listener);

  return function () {
    removeEventListener(window, 'popstate', listener);
  };
}

/**
 * Creates and returns a history object that uses HTML5's history API
 * (pushState, replaceState, and the popstate event) to manage history.
 * This is the recommended method of managing history in browsers because
 * it provides the cleanest URLs.
 *
 * Note: In browsers that do not support the HTML5 history API full
 * page reloads will be used to preserve URLs.
 */
function createBrowserHistory(options) {
  var isSupported = supportsHistory();

  function finishTransition(location) {
    var { key, pathname, search } = location;
    var path = pathname + search;
    var historyState = {
      key
    };

    switch (location.action) {
      case PUSH:
        saveState(location.key, location.state);

        if (isSupported) {
          window.history.pushState(historyState, null, path);
        } else {
          window.location.href = path; // Use page reload to preserve the URL.
        }
        break;
      case REPLACE:
        saveState(location.key, location.state);

        if (isSupported) {
          window.history.replaceState(historyState, null, path);
        } else {
          window.location.replace(path); // Use page reload to preserve the URL.
        }
        break;
    }
  }

  function cancelTransition(location) {
    if (location.action === POP) {
      var n = 0; // TODO: Figure out what n will put the URL back.

      if (n) {
        ignoreNextPopState = true;
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

  var listenerCount = 0, stopPopStateListener;

  function listen(listener) {
    invariant(
      canUseDOM,
      'Browser history needs a DOM'
    );

    if (++listenerCount === 1)
      stopPopStateListener = startPopStateListener(history);

    var unlisten = history.listen(listener);

    return function () {
      unlisten();

      if (--listenerCount === 0)
        stopPopStateListener();
    };
  }

  return {
    ...history,
    listen
  };
}

export default createBrowserHistory;
