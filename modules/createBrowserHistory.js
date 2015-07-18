import NavigationTypes from './NavigationTypes';
import { addEventListener, removeEventListener, readState, getWindowPath, go } from './DOMUtils';
import createDOMHistory from './createDOMHistory';
import createLocation from './createLocation';

function getCurrentLocation(historyState) {
  historyState = historyState || window.history.state || {};

  var { key } = historyState;
  var state = key && readState(key);
  var path = getWindowPath();

  return createLocation(key, state, path);
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

function finishTransition(location) {
  var { key, pathname, search } = location;
  var path = pathname + search;
  var state = {
    key
  };

  switch (location.navigationType) {
    case NavigationTypes.PUSH:
      window.history.pushState(state, null, path);
      break;
    case NavigationTypes.REPLACE:
      window.history.replaceState(state, null, path);
      break;
  }
}

function cancelTransition(location) {
  if (location.navigationType === NavigationTypes.POP) {
    var n = 0; // TODO: Figure out what n will put the URL back.

    if (n) {
      ignoreNextPopState = true;
      go(n);
    }
  }
}

function createBrowserHistory(options) {
  var history = createDOMHistory({
    ...options,
    getCurrentLocation,
    finishTransition,
    cancelTransition
  });

  var listenerCount = 0;
  var stopPopStateListener;

  function listen(listener) {
    var unlisten = history.listen(listener);
    listenerCount += 1;

    if (listenerCount === 1)
      stopPopStateListener = startPopStateListener(history);

    return function () {
      unlisten();
      listenerCount -= 1;

      if (listenerCount === 0)
        stopPopStateListener();
    };
  }

  return {
    ...history,
    listen
  };
}

export default createBrowserHistory;
