import deepEqual from 'deep-equal'
import { loopAsync } from './AsyncUtils'
import { createPath } from './PathUtils'
import { PUSH, REPLACE, POP } from './Actions'
import runTransitionHook from './runTransitionHook'
import _createLocation from './createLocation'

const DefaultKeyLength = 6

const createRandomKey = (length) =>
  Math.random().toString(36).substr(2, length)

const locationsAreEqual = (a, b) =>
  a.pathname === b.pathname &&
  a.search === b.search &&
  // TODO: Should probably compare hash here too?
  //a.action === b.action && // Different action !== location change.
  a.key === b.key &&
  deepEqual(a.state, b.state)

const createHistory = (options = {}) => {
  const { getCurrentLocation, finishTransition, go, getUserConfirmation } = options
  let { keyLength } = options

  if (typeof keyLength !== 'number')
    keyLength = DefaultKeyLength

  let beforeHooks = []

  const listenBefore = (hook) => {
    beforeHooks.push(hook)

    return () => {
      beforeHooks = beforeHooks.filter(item => item !== hook)
    }
  }

  let allKeys = []
  let changeListeners = []
  let location

  const getCurrent = () => {
    if (pendingLocation && pendingLocation.action === POP) {
      return allKeys.indexOf(pendingLocation.key)
    } else if (location) {
      return allKeys.indexOf(location.key)
    } else {
      return -1
    }
  }

  const updateLocation = (newLocation) => {
    const current = getCurrent()

    location = newLocation

    if (location.action === PUSH) {
      allKeys = [ ...allKeys.slice(0, current + 1), location.key ]
    } else if (location.action === REPLACE) {
      allKeys[current] = location.key
    }

    changeListeners.forEach(listener => listener(location))
  }

  const listen = (listener) => {
    changeListeners.push(listener)

    if (location) {
      listener(location)
    } else {
      const location = getCurrentLocation()
      allKeys = [ location.key ]
      updateLocation(location)
    }

    return () => {
      changeListeners = changeListeners.filter(item => item !== listener)
    }
  }

  const confirmTransitionTo = (location, callback) => {
    loopAsync(beforeHooks.length, (index, next, done) => {
      runTransitionHook(beforeHooks[index], location, (result) => {
        if (result != null) {
          done(result)
        } else {
          next()
        }
      })
    }, (message) => {
      if (getUserConfirmation && typeof message === 'string') {
        getUserConfirmation(message, (ok) => {
          callback(ok !== false)
        })
      } else {
        callback(message !== false)
      }
    })
  }

  let pendingLocation

  const transitionTo = (nextLocation) => {
    if (location && locationsAreEqual(location, nextLocation))
      return // Nothing to do.

    pendingLocation = nextLocation

    confirmTransitionTo(nextLocation, (ok) => {
      if (pendingLocation !== nextLocation)
        return // Transition was interrupted.

      if (ok) {
        // treat PUSH to current path like REPLACE to be consistent with browsers
        if (nextLocation.action === PUSH) {
          const prevPath = createPath(location)
          const nextPath = createPath(nextLocation)

          if (nextPath === prevPath && deepEqual(location.state, nextLocation.state))
            nextLocation.action = REPLACE
        }

        if (finishTransition(nextLocation) !== false)
          updateLocation(nextLocation)
      } else if (location && nextLocation.action === POP) {
        const prevIndex = allKeys.indexOf(location.key)
        const nextIndex = allKeys.indexOf(nextLocation.key)

        if (prevIndex !== -1 && nextIndex !== -1)
          go(prevIndex - nextIndex) // Restore the URL.
      }
    })
  }

  const push = (location) =>
    transitionTo(createLocation(location, PUSH, createKey()))

  const replace = (location) =>
    transitionTo(createLocation(location, REPLACE, createKey()))

  const goBack = () =>
    go(-1)

  const goForward = () =>
    go(1)

  const createKey = () =>
    createRandomKey(keyLength)

  const createHref = (location) =>
    createPath(location)

  const createLocation = (location, action, key = createKey()) =>
    _createLocation(location, action, key)

  return {
    listenBefore,
    listen,
    transitionTo,
    push,
    replace,
    go,
    goBack,
    goForward,
    createKey,
    createPath,
    createHref,
    createLocation
  }
}

export default createHistory
