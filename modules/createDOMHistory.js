import invariant from 'invariant';
import { canUseDOM } from './ExecutionEnvironment';
import { addEventListener, removeEventListener, go } from './DOMUtils';
import createHistory from './createHistory';

function getUserConfirmation(message, callback) {
  callback(window.confirm(message));
}

function startBeforeUnloadListener({ getTransitionConfirmationMessage }) {
  function listener(event) {
    var message = getTransitionConfirmationMessage();

    if (typeof message === 'string') {
      (event || window.event).returnValue = message;
      return message;
    }
  }

  addEventListener(window, 'beforeunload', listener);

  return function () {
    removeEventListener(window, 'beforeunload', listener);
  };
}

function createDOMHistory(options) {
  var history = createHistory({
    getUserConfirmation,
    ...options,
    go
  });

  var listenerCount = 0;
  var stopBeforeUnloadListener;

  function listen(listener) {
    invariant(
      canUseDOM,
      'DOM history needs a DOM'
    );

    if (++listenerCount === 1)
      stopBeforeUnloadListener = startBeforeUnloadListener(history);

    var unlisten = history.listen(listener);

    return function () {
      unlisten();

      if (--listenerCount === 0)
        stopBeforeUnloadListener();
    };
  }

  return {
    ...history,
    listen
  };
}

export default createDOMHistory;
