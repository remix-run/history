import warning from 'warning'
import { createLocation } from './LocationUtils'
import { addEventListener, removeEventListener } from './DOMUtils'
import { saveState, readState } from './DOMStateStorage'
import {
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
  const hashIndex = href.indexOf('#')
  return hashIndex === -1 ? '' : href.substring(hashIndex + 1)
}

const pushHashPath = (path) =>
  window.location.hash = path

const replaceHashPath = (path) => {
  const hashIndex = window.location.href.indexOf('#')

  window.location.replace(
    window.location.href.slice(0, hashIndex >= 0 ? hashIndex : 0) + '#' + path
  )
}

export { getUserConfirmation, go } from './BrowserProtocol'

export const getCurrentLocation = (pathCoder, queryKey) => {
  let path = pathCoder.decodePath(getHashPath())
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

export const startListener = (listener, pathCoder, queryKey) => {
  const handleHashChange = () => {
    const path = getHashPath()
    const encodedPath = pathCoder.encodePath(path)

    if (path !== encodedPath) {
      // Always be sure we have a properly-encoded hash.
      replaceHashPath(encodedPath)
    } else {
      const currentLocation = getCurrentLocation(pathCoder, queryKey)

      if (prevLocation && currentLocation.key && prevLocation.key === currentLocation.key)
        return // Ignore extraneous hashchange events

      prevLocation = currentLocation

      listener(currentLocation)
    }
  }

  // Ensure the hash is encoded properly.
  const path = getHashPath()
  const encodedPath = pathCoder.encodePath(path)

  if (path !== encodedPath)
    replaceHashPath(encodedPath)

  addEventListener(window, HashChangeEvent, handleHashChange)

  return () =>
    removeEventListener(window, HashChangeEvent, handleHashChange)
}

const updateLocation = (location, pathCoder, queryKey, updateHash) => {
  const { state, key } = location

  let path = pathCoder.encodePath(createPath(location))

  if (state !== undefined) {
    path = addQueryStringValueToPath(path, queryKey, key)
    saveState(key, state)
  }

  prevLocation = location

  updateHash(path)
}

export const pushLocation = (location, pathCoder, queryKey) =>
  updateLocation(location, pathCoder, queryKey, (path) => {
    if (getHashPath() !== path) {
      pushHashPath(path)
    } else {
      warning(false, 'You cannot PUSH the same path using hash history')
    }
  })

export const replaceLocation = (location, pathCoder, queryKey) =>
  updateLocation(location, pathCoder, queryKey, (path) => {
    if (getHashPath() !== path)
      replaceHashPath(path)
  })
