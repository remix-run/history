import { canUseDOM } from './ExecutionEnvironment'
import { addEventListener, removeEventListener } from './DOMUtils'

function startBeforeUnloadListener(getBeforeUnloadPromptMessage) {
  function listener(event) {
    let message = getBeforeUnloadPromptMessage()

    if (typeof message === 'string') {
      (event || window.event).returnValue = message
      return message
    }
  }

  addEventListener(window, 'beforeunload', listener)

  return function () {
    removeEventListener(window, 'beforeunload', listener)
  }
}

/**
 * Returns a new createHistory function that can be used to create
 * history objects that know how to use the beforeunload event in web
 * browsers to cancel navigation.
 */
function useBeforeUnload(createHistory) {
  return function (options) {
    let history = createHistory(options)

    let stopBeforeUnloadListener
    let beforeUnloadHooks = []

    function getBeforeUnloadPromptMessage() {
      let message

      for (let i = 0, len = beforeUnloadHooks.length; message == null && i < len; ++i)
        message = beforeUnloadHooks[i].call()

      return message
    }

    function registerBeforeUnloadHook(hook) {
      if (canUseDOM && beforeUnloadHooks.indexOf(hook) === -1) {
        beforeUnloadHooks.push(hook)
        
        if (beforeUnloadHooks.length === 1)
          stopBeforeUnloadListener = startBeforeUnloadListener(getBeforeUnloadPromptMessage)
      }
    }

    function unregisterBeforeUnloadHook(hook) {
      if (beforeUnloadHooks.length > 0) {
        beforeUnloadHooks = beforeUnloadHooks.filter(item => item !== hook)

        if (beforeUnloadHooks.length === 0)
          stopBeforeUnloadListener()
      }
    }

    return {
      ...history,
      registerBeforeUnloadHook,
      unregisterBeforeUnloadHook
    }
  }
}

export default useBeforeUnload
