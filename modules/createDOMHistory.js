import { addEventListener, removeEventListener, saveState, readState, go } from './DOMUtils';
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
    saveState,
    readState,
    go
  });

  var listenerCount = 0;
  var stopBeforeUnloadListener;

  function listen(listener) {
    var unlisten = history.listen(listener);

    listenerCount += 1;

    if (listenerCount === 1)
      stopBeforeUnloadListener = startBeforeUnloadListener(history);

    return function () {
      unlisten();
      listenerCount -= 1;

      if (listenerCount === 0)
        stopBeforeUnloadListener();
    };
  }

  return {
    ...history,
    listen
  };
}

export default createDOMHistory;
