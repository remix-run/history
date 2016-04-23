import warning from 'warning'
import { createLocation } from './LocationUtils'
import { addEventListener, removeEventListener } from './DOMUtils'
import { saveState, readState } from './DOMStateStorage'
import {
  isAbsolutePath,
  addQueryStringValueToPath,
  stripQueryStringValueFromPath,
  getQueryStringValueFromPath,
  parsePath,
  createPath
} from './PathUtils'

const HashChangeEvent = 'hashchange'

const getHashPath = () => {
  // We can't use window.location.hash here because it's not
  // consistent across browsers - Firefox will pre-decode it!
  const href = window.location.href
  const index = href.indexOf('#')
  return index === -1 ? '' : href.substring(index + 1)
}

const pushHashPath = (path) =>
  window.location.hash = path

const replaceHashPath = (path) =>
  window.location.replace(
    window.location.pathname + window.location.search + '#' + path
  )

export const ensureSlash = (path, encode) => {
  if (encode) {
    if (isAbsolutePath(path))
      return path

    return '/' + path
  }

  return path
}

export { getUserConfirmation, go } from './BrowserProtocol'

export const getCurrentLocation = (queryKey, transform) => {
  let path = transform(getHashPath(), false)
  const key = getQueryStringValueFromPath(path, queryKey)

  let state
  if (key) {
    path = stripQueryStringValueFromPath(path, queryKey)
    state = readState(key)
  }

  const init = parsePath(path)
  init.state = state

  return createLocation(init, undefined, key)
}

let prevLocation

export const startListener = (listener, queryKey, transform) => {
  const handleHashChange = () => {
    const transformedPath = transform(getHashPath(), true)

    replaceHashPath(transformedPath)

    const currentLocation = getCurrentLocation(queryKey, transform)

    if (prevLocation && currentLocation.key && prevLocation.key === currentLocation.key)
      return // Ignore extraneous hashchange events

    prevLocation = currentLocation

    listener(currentLocation)
  }

  const path = getHashPath()
  const transformedPath = transform(path, true)

  if (path !== transformedPath)
    replaceHashPath(transformedPath)

  addEventListener(window, HashChangeEvent, handleHashChange)

  return () =>
    removeEventListener(window, HashChangeEvent, handleHashChange)
}

const updateLocation = (location, queryKey, updateHash, transformPath) => {
  const { state, key } = location
  let path = transformPath(createPath(location), true)

  if (state !== undefined) {
    path = addQueryStringValueToPath(path, queryKey, key)
    saveState(key, state)
  }

  prevLocation = location

  updateHash(path)
}

export const pushLocation = (location, queryKey, transformPath) =>
  updateLocation(location, queryKey, (path) => {
    if (getHashPath() !== path) {
      pushHashPath(path)
    } else {
      warning(false, 'You cannot PUSH the same path using hash history')
    }
  }, transformPath)

export const replaceLocation = (location, queryKey, transformPath) =>
  updateLocation(location, queryKey, (path) => {
    if (getHashPath() !== path)
      replaceHashPath(path)
  }, transformPath)
