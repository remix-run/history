import invariant from 'invariant';
import deepEqual from 'deep-equal';
import { PUSH, REPLACE } from './Actions';
import createLocation from './createLocation';

function createRandomKey(length) {
  return Math.random().toString(36).substr(2, length);
}

function locationsAreEqual(a, b) {
  return a.pathname === b.pathname &&
    a.search === b.search &&
    //a.action === b.action && // Different action !== location change.
    a.key === b.key &&
    deepEqual(a.state, b.state);
}

var DefaultKeyLength = 6;

function createHistory(options={}) {
  var { getCurrentLocation, finishTransition, cancelTransition, saveState, go, keyLength, getUserConfirmation } = options;

  if (typeof keyLength !== 'number')
    keyLength = DefaultKeyLength;

  var transitionHooks = [];
  var transitionMiddlewareHandlers = [];
  var changeListeners = [];
  var pendingLocation;
  var location;

  function updateLocation(newLocation) {
    location = newLocation;

    changeListeners.forEach(function (listener) {
      listener(location);
    });
  }

  function addChangeListener(listener) {
    changeListeners.push(listener);
  }

  function removeChangeListener(listener) {
    changeListeners = changeListeners.filter(item => item !== listener);
  }

  function listen(listener) {
    addChangeListener(listener);

    if (location) {
      listener(location);
    } else {
      var currentLocation = getCurrentLocation();
      pendingLocation = currentLocation;
      processMiddleware(function(ok) {
        if (pendingLocation !== currentLocation) {
          return; // An intercepting transition has occured.
        }
        pendingLocation = null;
        if (ok) {
          updateLocation(currentLocation);
        } else {
          invariant(false, 'The initial route location transition was aborted by middleware.');
        }
      });
    }

    return function () {
      removeChangeListener(listener);
    };
  }

  function registerTransitionHook(hook) {
    if (transitionHooks.indexOf(hook) === -1)
      transitionHooks.push(hook);
  }

  function unregisterTransitionHook(hook) {
    transitionHooks = transitionHooks.filter(item => item !== hook);
  }

  function registerTransitionMiddleware(handler) {
    if (transitionMiddlewareHandlers.indexOf(handler) === -1)
      transitionMiddlewareHandlers.push(handler);
    return function() {
      unregisterTransitionMiddleware(handler);
    }
  }

  function unregisterTransitionMiddleware(handler) {
    transitionMiddlewareHandlers = transitionMiddlewareHandlers.filter(item => item !== handler);
  }

  function processMiddleware(callback, optionalMiddleware) {
    let handlers = optionalMiddleware || transitionMiddlewareHandlers;

    // No hanldlers to process? We're done.
    if (handlers.length === 0) {
      callback(true);
      return;
    }

    // Run middleware.
    let pendingLocationCache = pendingLocation;
    handlers[0](pendingLocation, location, function (value) {
        if (pendingLocationCache === pendingLocation) {
          if (arguments.length === 0 || value === true) {
            // No value? Continue.
            processMiddleware(callback, handlers.slice(1));
          } else if (value === false) {
            // Abort on a value of false.
            callback(false);
          } else if (typeof value.pathname === 'string') {
            // Redirect if the value is a location.
            transitionTo(value);
          } else {
            invariant(false, 'Unexpected middleware value "%s"', value);
          }
        }
      }
    );
  }

  function getTransitionConfirmationMessage() {
    var message = null;

    for (var i = 0, len = transitionHooks.length; i < len && message == null; ++i)
      message = transitionHooks[i].call(this);

    return message;
  }

  function confirmTransition(callback) {
    var message = getTransitionConfirmationMessage();

    if (getUserConfirmation && typeof message === 'string') {
      getUserConfirmation(message, function (ok) {
        callback(ok !== false);
      });
    } else {
      callback(message !== false);
    }
  }

  function transitionTo(nextLocation) {
    if (location && locationsAreEqual(location, nextLocation))
      return; // Nothing to do.

    pendingLocation = nextLocation;

    processMiddleware(function(ok) {
      if (pendingLocation !== nextLocation) {
        return; // An interecepting transition has occurred.
      }
      if (ok) {
        confirmTransition(function (ok) {
          if (pendingLocation !== nextLocation) {
            return; // An interecepting transition has occurred.
          }
          pendingLocation = null;
          if (ok) {
            finishTransition(nextLocation);
            updateLocation(nextLocation);
          } else if (cancelTransition) {
            cancelTransition(nextLocation);
          }
        });
      } else if (cancelTransition) {
        pendingLocation = null;
        cancelTransition(nextLocation);
      }
    });
  }

  function pushState(state, path) {
    transitionTo(
      createLocation(path, state, PUSH, createKey())
    );
  }

  function replaceState(state, path) {
    transitionTo(
      createLocation(path, state, REPLACE, createKey())
    );
  }

  function setState(state) {
    if (location) {
      updateLocationState(location, state);
      updateLocation(location);
    } else {
      updateLocationState(getCurrentLocation(), state);
    }
  }

  function updateLocationState(location, state) {
    location.state = { ...location.state, ...state };
    saveState(location.key, location.state);
  }

  function goBack() {
    go(-1);
  }

  function goForward() {
    go(1);
  }

  function createKey() {
    return createRandomKey(keyLength);
  }

  function createHref(path) {
    return path;
  }

  return {
    listen,
    registerTransitionHook,
    unregisterTransitionHook,
    registerTransitionMiddleware,
    unregisterTransitionMiddleware,
    getTransitionConfirmationMessage,
    transitionTo,
    pushState,
    replaceState,
    setState,
    go,
    goBack,
    goForward,
    createKey,
    createHref
  };
}

export default createHistory;
