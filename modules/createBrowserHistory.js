import invariant from 'invariant'
import { PUSH, REPLACE, POP } from './Actions'
import { parsePath } from './PathUtils'
import { canUseDOM } from './ExecutionEnvironment'
import { addEventListener, removeEventListener, getWindowPath, supportsHistory } from './DOMUtils'
import { saveState, readState } from './DOMStateStorage'
import createDOMHistory from './createDOMHistory'

/**
 * Creates and returns a history object that uses HTML5's history API
 * (pushState, replaceState, and the popstate event) to manage history.
 * This is the recommended method of managing history in browsers because
 * it provides the cleanest URLs.
 *
 * Note: In browsers that do not support the HTML5 history API full
 * page reloads will be used to preserve URLs.
 */
const createBrowserHistory = (options = {}) => {
  invariant(
    canUseDOM,
    'Browser history needs a DOM'
  )

  const { forceRefresh } = options
  const isSupported = supportsHistory()
  const useRefresh = !isSupported || forceRefresh

  const getCurrentLocation = (historyState = window.history.state || {}) => {
    const path = getWindowPath()
    let { key } = historyState

    let state
    if (key) {
      state = readState(key)
    } else {
      state = null
      key = history.createKey()

      if (isSupported)
        window.history.replaceState({ ...historyState, key }, null, path)
    }

    const location = parsePath(path)

    return history.createLocation({ ...location, state }, undefined, key)
  }

  const startPopStateListener = ({ transitionTo }) => {
    const popStateListener = (event) => {
      if (event.state === undefined)
        return // Ignore extraneous popstate events in WebKit.

      transitionTo(
        getCurrentLocation(event.state)
      )
    }

    addEventListener(window, 'popstate', popStateListener)

    return () =>
      removeEventListener(window, 'popstate', popStateListener)
  }

  const finishTransition = (location) => {
    /* eslint-disable consistent-return, no-else-return */
    const { basename, pathname, search, hash, state, action, key } = location

    if (action === POP)
      return // Nothing to do.

    saveState(key, state)

    const path = (basename || '') + pathname + search + hash
    const historyState = {
      key
    }

    if (action === PUSH) {
      if (useRefresh) {
        window.location.href = path
        return false // Prevent location update.
      } else {
        window.history.pushState(historyState, null, path)
      }
    } else if (action === REPLACE) {
      if (useRefresh) {
        window.location.replace(path)
        return false // Prevent location update.
      } else {
        window.history.replaceState(historyState, null, path)
      }
    }
  }

  const history = createDOMHistory({
    ...options,
    getCurrentLocation,
    finishTransition,
    saveState
  })

  let listenerCount = 0, stopPopStateListener

  const listenBefore = (listener) => {
    if (++listenerCount === 1)
      stopPopStateListener = startPopStateListener(history)

    const unlisten = history.listenBefore(listener)

    return () => {
      unlisten()

      if (--listenerCount === 0)
        stopPopStateListener()
    }
  }

  const listen = (listener) => {
    if (++listenerCount === 1)
      stopPopStateListener = startPopStateListener(history)

    const unlisten = history.listen(listener)

    return () => {
      unlisten()

      if (--listenerCount === 0)
        stopPopStateListener()
    }
  }

  return {
    ...history,
    listenBefore,
    listen
  }
}

export default createBrowserHistory
