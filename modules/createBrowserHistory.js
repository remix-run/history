import invariant from 'invariant'
import { PUSH, POP } from './Actions'
import { canUseDOM } from './ExecutionEnvironment'
import { addEventListener, removeEventListener, getWindowPath, supportsHistory } from './DOMUtils'
import { saveState, readState } from './DOMStateStorage'
import createDOMHistory from './createDOMHistory'
import createLocation from './createLocation'

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
  )

  let isSupported = supportsHistory()

  function getCurrentLocation(historyState) {
    historyState = historyState || window.history.state || {}

    let path = getWindowPath()
    let { key } = historyState

    let state
    if (key) {
      state = readState(key)
    } else {
      state = null
      key = history.createKey()
      window.history.replaceState({ ...historyState, key }, null, path)
    }

    return createLocation(path, state, undefined, key)
  }

  function startPopStateListener({ transitionTo }) {
    function popStateListener(event) {
      if (event.state === undefined)
        return // Ignore extraneous popstate events in WebKit.

      transitionTo(
        getCurrentLocation(event.state)
      )
    }

    addEventListener(window, 'popstate', popStateListener)

    return function () {
      removeEventListener(window, 'popstate', popStateListener)
    }
  }

  function finishTransition(location) {
    let { pathname, search, state, action, key } = location

    if (action === POP)
      return // Nothing to do.

    saveState(key, state)

    let path = pathname + search
    let historyState = {
      key
    }

    if (action === PUSH) {
      if (isSupported) {
        window.history.pushState(historyState, null, path)
      } else {
        window.location.href = path // Use page reload to preserve the URL.
      }
    } else { // REPLACE
      if (isSupported) {
        window.history.replaceState(historyState, null, path)
      } else {
        window.location.replace(path) // Use page reload to preserve the URL.
      }
    }
  }

  let history = createDOMHistory({
    ...options,
    getCurrentLocation,
    finishTransition,
    saveState
  })

  let listenerCount = 0, stopPopStateListener

  function listen(listener) {
    if (++listenerCount === 1)
      stopPopStateListener = startPopStateListener(history)

    let unlisten = history.listen(listener)

    return function () {
      unlisten()

      if (--listenerCount === 0)
        stopPopStateListener()
    }
  }

  return {
    ...history,
    listen
  }
}

export default createBrowserHistory
