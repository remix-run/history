import { createLocation } from './LocationUtils'
import {
  addEventListener,
  removeEventListener,
  supportsPopstateOnHashchange
} from './DOMUtils'
import { saveState, readState } from './DOMStateStorage'
import { createPath } from './PathUtils'

import { canUseDOM } from './ExecutionEnvironment'

const PopStateEvent = 'popstate'
const HashChangeEvent = 'hashchange'

const needsHashchangeListener = canUseDOM && !supportsPopstateOnHashchange()

const _createLocation = (historyState) => {
  const key = historyState && historyState.key

  return createLocation({
    pathname: window.location.pathname,
    search: window.location.search,
    hash: window.location.hash,
    state: (key ? readState(key) : undefined)
  }, undefined, key)
}

export const getCurrentLocation = () => {
  let historyState
  try {
    historyState = window.history.state || {}
  } catch (error) {
    // IE 11 sometimes throws when accessing window.history.state
    // See https://github.com/ReactTraining/history/pull/289
    historyState = {}
  }

  return _createLocation(historyState)
}

export const getUserConfirmation = (message, callback) =>
  callback(window.confirm(message)) // eslint-disable-line no-alert

export const startListener = (listener) => {
  const handlePopState = (event) => {
    if (event.state !== undefined) // Ignore extraneous popstate events in WebKit
      listener(_createLocation(event.state))
  }

  addEventListener(window, PopStateEvent, handlePopState)

  const handleUnpoppedHashChange = () =>
    listener(getCurrentLocation())

  if (needsHashchangeListener) {
    addEventListener(window, HashChangeEvent, handleUnpoppedHashChange)
  }

  return () => {
    removeEventListener(window, PopStateEvent, handlePopState)

    if (needsHashchangeListener) {
      removeEventListener(window, HashChangeEvent, handleUnpoppedHashChange)
    }
  }
}

const updateLocation = (location, updateState) => {
  const { state, key } = location

  if (state !== undefined)
    saveState(key, state)

  updateState({ key }, createPath(location))
}

export const pushLocation = (location) =>
  updateLocation(location, (state, path) =>
    window.history.pushState(state, null, path)
  )

export const replaceLocation = (location) =>
  updateLocation(location, (state, path) =>
    window.history.replaceState(state, null, path)
  )

export const go = (n) => {
  if (n)
    window.history.go(n)
}
