import warning from 'warning'
import invariant from 'invariant'
import { PUSH, POP } from './Actions'
import { canUseDOM } from './ExecutionEnvironment'
import { addEventListener, removeEventListener, getHashPath, replaceHashPath, supportsGoWithoutReloadUsingHash } from './DOMUtils'
import { saveState, readState } from './DOMStateStorage'
import createDOMHistory from './createDOMHistory'
import parsePath from './parsePath'

function isAbsolutePath(path) {
  return typeof path === 'string' && path.charAt(0) === '/'
}

function ensureSlash() {
  let path = getHashPath()

  if (isAbsolutePath(path))
    return true

  replaceHashPath('/' + path)

  return false
}

function addQueryStringValueToPath(path, key, value) {
  return path + (path.indexOf('?') === -1 ? '?' : '&') + `${key}=${value}`
}

function stripQueryStringValueFromPath(path, key) {
  return path.replace(new RegExp(`[?&]?${key}=[a-zA-Z0-9]+`), '')
}

function getQueryStringValueFromPath(path, key) {
  let match = path.match(new RegExp(`\\?.*?\\b${key}=(.+?)\\b`))
  return match && match[1]
}

const DefaultQueryKey = '_k'

function createHashHistory(options={}) {
  invariant(
    canUseDOM,
    'Hash history needs a DOM'
  )

  let { queryKey, ...historyOptions } = options

  if (queryKey === undefined || !!queryKey)
    queryKey = typeof queryKey === 'string' ? queryKey : DefaultQueryKey

  function getCurrentLocation() {
    let path = getHashPath()

    let key, state
    if (queryKey) {
      key = getQueryStringValueFromPath(path, queryKey)
      path = stripQueryStringValueFromPath(path, queryKey)

      if (key) {
        state = readState(key)
      } else {
        state = null
        key = history.createKey()
        replaceHashPath(addQueryStringValueToPath(path, queryKey, key))
      }
    } else {
      key = state = null
    }

    const location = parsePath(path)

    return history.createLocation({ ...location, state }, undefined, key)
  }

  function startHashChangeListener({ transitionTo }) {
    function hashChangeListener() {
      if (!ensureSlash())
        return // Always make sure hashes are preceeded with a /.

      transitionTo(
        getCurrentLocation()
      )
    }

    ensureSlash()
    addEventListener(window, 'hashchange', hashChangeListener)

    return function () {
      removeEventListener(window, 'hashchange', hashChangeListener)
    }
  }

  function finishTransition(location) {
    let { basename, pathname, search, state, action, key } = location

    if (action === POP)
      return // Nothing to do.

    let path = (basename || '') + pathname + search

    if (queryKey) {
      path = addQueryStringValueToPath(path, queryKey, key)
      saveState(key, state)
    } else {
      // Drop key and state.
      location.key = location.state = null
    }

    let currentHash = getHashPath()

    if (action === PUSH) {
      if (currentHash !== path) {
        window.location.hash = path
      } else {
        warning(
          false,
          'You cannot PUSH the same path using hash history'
        )
      }
    } else if (currentHash !== path) { // REPLACE
      replaceHashPath(path)
    }
  }

  const history = createDOMHistory({
    ...historyOptions,
    getCurrentLocation,
    finishTransition
  })

  let listenerCount = 0, stopHashChangeListener

  function listenBefore(listener) {
    if (++listenerCount === 1)
      stopHashChangeListener = startHashChangeListener(history)

    let unlisten = history.listenBefore(listener)

    return function () {
      unlisten()

      if (--listenerCount === 0)
        stopHashChangeListener()
    }
  }

  function listen(listener) {
    if (++listenerCount === 1)
      stopHashChangeListener = startHashChangeListener(history)

    let unlisten = history.listen(listener)

    return function () {
      unlisten()

      if (--listenerCount === 0)
        stopHashChangeListener()
    }
  }

  function push(location) {
    warning(
      queryKey || location.state == null,
      'You cannot use state without a queryKey it will be dropped'
    )

    history.push(location)
  }

  function replace(location) {
    warning(
      queryKey || location.state == null,
      'You cannot use state without a queryKey it will be dropped'
    )

    history.replace(location)
  }

  let goIsSupportedWithoutReload = supportsGoWithoutReloadUsingHash()

  function go(n) {
    warning(
      goIsSupportedWithoutReload,
      'Hash history go(n) causes a full page reload in this browser'
    )

    history.go(n)
  }

  function createHref(path) {
    return '#' + history.createHref(path)
  }

  return {
    ...history,
    listenBefore,
    listen,
    push,
    replace,
    go,
    createHref
  }
}

export default createHashHistory
