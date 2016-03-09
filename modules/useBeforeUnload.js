import invariant from 'invariant'
import { addEventListener, removeEventListener } from './DOMUtils'
import { canUseDOM } from './ExecutionEnvironment'

const startListener = (getPromptMessage) => {
  const handleBeforeUnload = (event) => {
    const message = getPromptMessage()

    if (typeof message === 'string') {
      (event || window.event).returnValue = message
      return message
    }

    return undefined
  }

  addEventListener(window, 'beforeunload', handleBeforeUnload)

  return () =>
    removeEventListener(window, 'beforeunload', handleBeforeUnload)
}

/**
 * Returns a new createHistory function that can be used to create
 * history objects that know how to use the beforeunload event in web
 * browsers to cancel navigation.
 */
const useBeforeUnload = (createHistory) => {
  invariant(
    canUseDOM,
    'useBeforeUnload only works in DOM environments'
  )

  return (options) => {
    const history = createHistory(options)

    let listeners = []
    let stopListener

    const getPromptMessage = () => {
      let message
      for (let i = 0, len = listeners.length; message == null && i < len; ++i)
        message = listeners[i].call()

      return message
    }

    const listenBeforeUnload = (listener) => {
      if (listeners.push(listener) === 1)
        stopListener = startListener(getPromptMessage)

      return () => {
        listeners = listeners.filter(item => item !== listener)

        if (listeners.length === 0 && stopListener) {
          stopListener()
          stopListener = null
        }
      }
    }

    return {
      ...history,
      listenBeforeUnload
    }
  }
}

export default useBeforeUnload
