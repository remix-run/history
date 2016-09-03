import warning from 'warning'
import invariant from 'invariant'
import { stripPrefix } from './PathUtils'
import createTransitionManager from './createTransitionManager'
import { canUseDOM } from './ExecutionEnvironment'
import {
  addEventListener,
  removeEventListener,
  getConfirmation,
  supportsHistory,
  supportsPopStateOnHashChange
} from './DOMUtils'

const PopStateEvent = 'popstate'
const HashChangeEvent = 'hashchange'
const BlockAllPrompt = () => false

const getHistoryState = () => {
  try {
    return window.history.state || {}
  } catch (e) {
    // IE 11 sometimes throws when accessing window.history.state
    // See https://github.com/mjackson/history/pull/289
    return {}
  }
}

/**
 * Creates a history object that uses the HTML5 history API including
 * pushState, replaceState, and the popstate event.
 */
const createBrowserHistory = (props = {}) => {
  invariant(
    canUseDOM,
    'Browser history needs a DOM'
  )

  const canUseHistory = supportsHistory()
  const needsHashChangeListener = !supportsPopStateOnHashChange()

  const {
    basename = '',
    forceRefresh = false,
    getUserConfirmation = getConfirmation,
    keyLength = 6
  } = props

  const createLocation = (historyState) => {
    const { key, state } = (historyState || {})
    const { pathname, search, hash } = window.location

    let path = pathname + search + hash

    if (basename)
      path = stripPrefix(path, basename)

    return {
      path,
      state,
      key
    }
  }

  const createKey = () =>
    Math.random().toString(36).substr(2, keyLength)

  const initialLocation = createLocation(getHistoryState())
  const currentState = {
    action: 'POP',
    location: initialLocation,
    allKeys: [ initialLocation.key ]
  }
  
  const transitionManager = createTransitionManager()

  const setState = (nextState) => {
    Object.assign(currentState, nextState)

    transitionManager.transitionTo(
      currentState.location,
      currentState.action
    )
  }

  const handlePopState = (event) => {
    if (event.state === undefined)
      return // Ignore extraneous popstate events in WebKit.

    handlePop(createLocation(event.state))
  }

  const handleHashChange = () => {
    handlePop(createLocation(getHistoryState()))
  }

  let forceNextPop = false

  const handlePop = (location) => {
    if (forceNextPop) {
      forceNextPop = false
      setState()
    } else {
      const action = 'POP'

      transitionManager.confirmTransitionTo(location, action, getUserConfirmation, (ok) => {
        if (ok) {
          setState({ action, location })
        } else {
          revertPop(location)
        }
      })
    }
  }

  const revertPop = (fromLocation) => {
    const { location: toLocation, allKeys } = currentState

    // TODO: We could probably make this more reliable by
    // keeping a list of keys we've seen in sessionStorage.
    // Instead, we just default to 0 for keys we don't know.

    let toIndex = allKeys.indexOf(toLocation.key)

    if (toIndex === -1)
      toIndex = 0

    let fromIndex = allKeys.indexOf(fromLocation.key)

    if (fromIndex === -1)
      fromIndex = 0

    const delta = toIndex - fromIndex

    if (delta) {
      forceNextPop = true
      go(delta)
    }
  }

  // Public interface

  const getCurrentLocation = () =>
    currentState.location || createLocation(getHistoryState())

  const push = (path, state) => {
    const action = 'PUSH'
    const key = createKey()
    const location = {
      path,
      state,
      key
    }

    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, (ok) => {
      if (!ok)
        return

      const url = basename + path

      if (canUseHistory) {
        window.history.pushState({ key, state }, null, url)

        if (forceRefresh) {
          window.location.href = url
        } else {
          const prevKeys = currentState.allKeys
          const prevIndex = prevKeys.indexOf(currentState.location.key)

          const allKeys = prevKeys.slice(0, prevIndex === -1 ? 0 : prevIndex + 1)
          allKeys.push(location.key)

          setState({
            action,
            location,
            allKeys
          })
        }
      } else {
        warning(
          state === undefined,
          'Browser history cannot push state in browsers that do not support HTML5 history'
        )

        window.location.href = url
      }
    })
  }

  const replace = (path, state) => {
    const action = 'REPLACE'
    const key = createKey()
    const location = {
      path,
      state,
      key
    }

    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, (ok) => {
      if (!ok)
        return

      const url = basename + path

      if (canUseHistory) {
        window.history.replaceState({ key, state }, null, url)

        if (forceRefresh) {
          window.location.replace(url)
        } else {
          const allKeys = currentState.allKeys.slice(0)
          const prevIndex = allKeys.indexOf(currentState.location.key)

          if (prevIndex !== -1)
            allKeys[prevIndex] = location.key

          setState({
            action,
            location,
            allKeys
          })
        }
      } else {
        warning(
          state === undefined,
          'Browser history cannot replace state in browsers that do not support HTML5 history'
        )

        window.location.replace(url)
      }
    })
  }

  const go = (n) => {
    window.history.go(n)
  }

  const goBack = () =>
    go(-1)

  const goForward = () =>
    go(1)

  const block = (prompt = BlockAllPrompt) =>
    transitionManager.setPrompt(prompt)

  let listenerCount = 0

  const checkDOMListeners = (delta) => {
    listenerCount += delta

    if (listenerCount === 1) {
      addEventListener(window, PopStateEvent, handlePopState)

      if (needsHashChangeListener)
        addEventListener(window, HashChangeEvent, handleHashChange)
    } else if (listenerCount === 0) {
      removeEventListener(window, PopStateEvent, handlePopState)

      if (needsHashChangeListener)
        removeEventListener(window, HashChangeEvent, handleHashChange)
    }
  }

  const listen = (listener) => {
    const unlisten = transitionManager.appendListener(listener)
    checkDOMListeners(1)

    return () => {
      checkDOMListeners(-1)
      return unlisten()
    }
  }

  return {
    getCurrentLocation,
    push,
    replace,
    go,
    goBack,
    goForward,
    block,
    listen
  }
}

export default createBrowserHistory
