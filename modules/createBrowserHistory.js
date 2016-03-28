import invariant from 'invariant'
import { canUseDOM } from './ExecutionEnvironment'
import * as BrowserProtocol from './BrowserProtocol'
import * as RefreshProtocol from './RefreshProtocol'
import { supportsHistory } from './DOMUtils'
import createHistory from './createHistory'

/**
 * Creates and returns a history object that uses HTML5's history API
 * (pushState, replaceState, and the popstate event) to manage history.
 * This is the recommended method of managing history in browsers because
 * it provides the cleanest URLs.
 *
 * Note: In browsers that do not support the HTML5 history API full
 * page reloads will be used to preserve clean URLs. You can force this
 * behavior using { forceRefresh: true } in options.
 */
const createBrowserHistory = (options = {}) => {
  invariant(
    canUseDOM,
    'Browser history needs a DOM'
  )

  const useRefresh = options.forceRefresh || !supportsHistory()
  const Protocol = useRefresh ? RefreshProtocol : BrowserProtocol

  const {
    getUserConfirmation,
    getCurrentLocation,
    pushLocation,
    replaceLocation,
    go
  } = Protocol

  const history = createHistory({
    getUserConfirmation, // User may override in options
    ...options,
    getCurrentLocation,
    pushLocation,
    replaceLocation,
    go
  })

  let listenerCount = 0, stopListener

  const startListener = (listener, before) => {
    if (++listenerCount === 1)
      stopListener = BrowserProtocol.startListener(
        history.transitionTo
      )

    const unlisten = before
      ? history.listenBefore(listener)
      : history.listen(listener)

    return () => {
      unlisten()

      if (--listenerCount === 0)
        stopListener()
    }
  }

  const listenBefore = (listener) =>
    startListener(listener, true)

  const listen = (listener) =>
    startListener(listener, false)

  return {
    ...history,
    listenBefore,
    listen
  }
}

export default createBrowserHistory
