import warning from 'warning'
import invariant from 'invariant'
import { canUseDOM } from './ExecutionEnvironment'
import { supportsGoWithoutReloadUsingHash } from './DOMUtils'
import * as HashProtocol from './HashProtocol'
import createHistory from './createHistory'

const DefaultQueryKey = '_k'

const addLeadingSlash = (path) =>
  path.charAt(0) === '/' ? path : '/' + path

const HashPathCoders = {
  hashbang: {
    encodePath: (path) => path.charAt(0) === '!' ? path : '!' + path,
    decodePath: (path) => path.charAt(0) === '!' ? path.substring(1) : path
  },
  noslash: {
    encodePath: (path) => path.charAt(0) === '/' ? path.substring(1) : path,
    decodePath: addLeadingSlash
  },
  slash: {
    encodePath: addLeadingSlash,
    decodePath: addLeadingSlash
  }
}

const createHashHistory = (options = {}) => {
  invariant(
    canUseDOM,
    'Hash history needs a DOM'
  )

  let { queryKey, hashType } = options

  warning(
    queryKey !== false,
    'Using { queryKey: false } no longer works. Instead, just don\'t ' +
    'use location state if you don\'t want a key in your URL query string'
  )

  if (typeof queryKey !== 'string')
    queryKey = DefaultQueryKey

  if (hashType == null)
    hashType = 'slash'

  if (!(hashType in HashPathCoders)) {
    warning(
      false,
      'Invalid hash type: %s',
      hashType
    )

    hashType = 'slash'
  }

  const pathCoder = HashPathCoders[hashType]

  const { getUserConfirmation } = HashProtocol

  const getCurrentLocation = () =>
    HashProtocol.getCurrentLocation(pathCoder, queryKey)

  const pushLocation = (location) =>
    HashProtocol.pushLocation(location, pathCoder, queryKey)

  const replaceLocation = (location) =>
    HashProtocol.replaceLocation(location, pathCoder, queryKey)

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
        pathCoder,
        queryKey
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
    '#' + pathCoder.encodePath(history.createHref(path))

  return {
    ...history,
    listenBefore,
    listen,
    go,
    createHref
  }
}

export default createHashHistory
