import invariant from 'invariant';
import deepEqual from 'deep-equal';
import { PUSH, REPLACE, POP } from './Actions';
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
  var { getCurrentLocation, finishTransition, saveState, go, keyLength, getUserConfirmation } = options;

  if (typeof keyLength !== 'number')
    keyLength = DefaultKeyLength;

  var transitionHooks = [];
  var changeListeners = [];
  var location;

  var allKeys = [];

  function getCurrent() {
    if (location) {
      return location.current;
    }

    return -1;
  }

  function updateLocation(newLocation) {
    var current = getCurrent();
    if (newLocation.action === PUSH) {
      allKeys = [...allKeys.slice(0, current + 1), newLocation.key];
    } else if (newLocation.action === REPLACE) {
      allKeys[current] = newLocation.key;
    }

    newLocation.current = allKeys.indexOf(newLocation.key);

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
      var location = getCurrentLocation();
      allKeys = [location.key];
      updateLocation(location);
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

  var pendingLocation;

  function transitionTo(nextLocation) {
    if (nextLocation.action === POP) {
      var current = getCurrent();
      var next = allKeys.indexOf(nextLocation.key);
      if (next < 0) {
        // edge case (e.g. hash change with BrowserHistory)
        allKeys = [...allKeys.slice(0, current + 1), nextLocation.key];
        next = allKeys.length - 1;
      }

      nextLocation.current = next;
    }

    if (location && locationsAreEqual(location, nextLocation))
      return; // Nothing to do.

    invariant(
      pendingLocation == null,
      'transitionTo: Another transition is already in progress'
    );

    pendingLocation = nextLocation;

    confirmTransition(function (ok) {
      pendingLocation = null;

      if (ok) {
        finishTransition(nextLocation);
        updateLocation(nextLocation);
      } else if (location && nextLocation.action === POP) {
        var prevIndex = location.current;
        var nextIndex = nextLocation.current;

        if (prevIndex !== -1 && nextIndex !== -1)
          go(prevIndex - nextIndex); // Restore the URL.
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
