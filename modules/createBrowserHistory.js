import invariant from 'invariant';
import { PUSH, REPLACE, POP } from './Actions';
import { canUseDOM } from './ExecutionEnvironment';
import { addEventListener, removeEventListener, getWindowPath, go, supportsHistory } from './DOMUtils';
import { saveState, readState } from './DOMStateStorage';
import createDOMHistory from './createDOMHistory';
import createLocation from './createLocation';

function getCurrentLocation(historyState) {
  historyState = historyState || window.history.state || {};

  var { key } = historyState;
  var state = key && readState(key);
  var path = getWindowPath();

  return createLocation(path, state, undefined, key);
}

function startPopStateListener({ transitionTo }) {
  function popStateListener(event) {
    if (event.state === undefined)
      return; // Ignore extraneous popstate events in WebKit.

    transitionTo(
      getCurrentLocation(event.state)
    );
  }

  addEventListener(window, 'popstate', popStateListener);

  return function () {
    removeEventListener(window, 'popstate', popStateListener);
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
  invariant(
    canUseDOM,
    'Browser history needs a DOM'
  );

  var isSupported = supportsHistory();

  function finishTransition(location) {
    var { pathname, search, state, action, key } = location;

    if (action === POP)
      return; // Nothing to do.

    saveState(key, state);

    var path = pathname + search;
    var historyState = {
      key
    };

    if (action === PUSH) {
      if (isSupported) {
        window.history.pushState(historyState, null, path);
      } else {
        window.location.href = path; // Use page reload to preserve the URL.
      }
    } else { // REPLACE
      if (isSupported) {
        window.history.replaceState(historyState, null, path);
      } else {
        window.location.replace(path); // Use page reload to preserve the URL.
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

  var listenerCount = 0, stopPopStateListener;

  function listen(listener) {
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
