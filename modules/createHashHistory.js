import warning from 'warning'
import invariant from 'invariant'
import { canUseDOM } from './ExecutionEnvironment'
import { supportsGoWithoutReloadUsingHash } from './DOMUtils'
import * as HashProtocol from './HashProtocol'
import createHistory from './createHistory'

const DefaultQueryKey = '_k'

const createHashHistory = (options = {}) => {
  invariant(
    canUseDOM,
    'Hash history needs a DOM'
  )

  let { queryKey, transformPath } = options

  warning(
    queryKey !== false,
    'Using { queryKey: false } no longer works. Instead, just don\'t ' +
    'use location state if you don\'t want a key in your URL query string'
  )

  const { getUserConfirmation, ensureSlash } = HashProtocol

  if (typeof queryKey !== 'string')
    queryKey = DefaultQueryKey

  if (typeof transformPath !== 'function')
    transformPath = ensureSlash

  const getCurrentLocation = () =>
    HashProtocol.getCurrentLocation(queryKey)

  const pushLocation = (location) =>
    HashProtocol.pushLocation(location, queryKey)

  const replaceLocation = (location) =>
    HashProtocol.replaceLocation(location, queryKey)

  const history = createHistory({
    getUserConfirmation, // User may override in options
    ...options,
    getCurrentLocation,
    pushLocation,
    replaceLocation,
    go: HashProtocol.go
  })

  let listenerCount = 0, stopListener

  const startListener = (listener, before) => {
    if (++listenerCount === 1)
      stopListener = HashProtocol.startListener(
        history.transitionTo,
        queryKey,
        transformPath
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

  const goIsSupportedWithoutReload = supportsGoWithoutReloadUsingHash()

  const go = (n) => {
    warning(
      goIsSupportedWithoutReload,
      'Hash history go(n) causes a full page reload in this browser'
    )

    history.go(n)
  }

  const createHref = (path) =>
    '#' + transformPath(history.createHref(path))

  return {
    ...history,
    listenBefore,
    listen,
    go,
    createHref
  }
}

export default createHashHistory
