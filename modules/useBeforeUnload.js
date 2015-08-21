import { canUseDOM } from './ExecutionEnvironment';
import { addEventListener, removeEventListener } from './DOMUtils';

function startBeforeUnloadListener(getBeforeUnloadPromptMessage) {
  function listener(event) {
    var message = getBeforeUnloadPromptMessage();

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

function useBeforeUnload(createHistory) {
  return function (options) {
    var history = createHistory(options);

    var stopBeforeUnloadListener;
    var beforeUnloadHooks = [];

    function getBeforeUnloadPromptMessage() {
      var message;

      for (var i = 0, len = beforeUnloadHooks.length; message == null && i < len; ++i)
        message = beforeUnloadHooks[i].call();

      return message;
    }

    function registerBeforeUnloadHook(hook) {
      if (canUseDOM && beforeUnloadHooks.indexOf(hook) === -1) {
        beforeUnloadHooks.push(hook);
        
        if (beforeUnloadHooks.length === 1)
          stopBeforeUnloadListener = startBeforeUnloadListener(getBeforeUnloadPromptMessage);
      }
    }

    function unregisterBeforeUnloadHook(hook) {
      if (beforeUnloadHooks.length > 0) {
        beforeUnloadHooks = beforeUnloadHooks.filter(item => item !== hook);

        if (beforeUnloadHooks.length === 0)
          stopBeforeUnloadListener();
      }
    }

    return {
      ...history,
      registerBeforeUnloadHook,
      unregisterBeforeUnloadHook
    };
  };
}

export default useBeforeUnload;
