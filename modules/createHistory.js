import { PUSH, REPLACE } from './Actions';
import createLocation from './createLocation';

var DefaultKeyLength = 6;

function createRandomKey(length) {
  return Math.random().toString(36).substr(2, length);
}

function createHistory(options={}) {
  var transitionHooks = [];
  var changeListeners = [];
  var location, pendingLocation;

  var { getCurrentLocation, finishTransition, cancelTransition, go, keyLength, getUserConfirmation } = options;

  if (typeof keyLength !== 'number')
    keyLength = DefaultKeyLength;

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
      updateLocation(getCurrentLocation());
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

    for (var i = 0, len = transitionHooks.length; i < len && typeof message !== 'string'; ++i)
      message = transitionHooks[i].call(this);

    return message;
  }

  function confirmTransition(callback) {
    var message;

    if (getUserConfirmation && (message = getTransitionConfirmationMessage())) {
      getUserConfirmation(message, function (ok) {
        callback(ok !== false);
      });
    } else {
      callback(true);
    }
  }

  function transitionTo(nextLocation) {
    pendingLocation = nextLocation;

    confirmTransition(function (ok) {
      if (pendingLocation !== nextLocation)
        return; // Last transitionTo wins.

      if (ok) {
        finishTransition(nextLocation);
        updateLocation(nextLocation);
      } else if (cancelTransition) {
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

  function goBack() {
    go(-1);
  }

  function goForward() {
    go(1);
  }

  function createKey() {
    return createRandomKey(keyLength);
  }

  return {
    listen,
    registerTransitionHook,
    unregisterTransitionHook,
    getTransitionConfirmationMessage,
    transitionTo,
    pushState,
    replaceState,
    go,
    goBack,
    goForward,
    createKey
  };
}

export default createHistory;
