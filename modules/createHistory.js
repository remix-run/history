import warning from 'warning'
import deepEqual from 'deep-equal'
import { loopAsync } from './AsyncUtils'
import { PUSH, REPLACE, POP } from './Actions'
import runTransitionHook from './runTransitionHook'
import deprecate from './deprecate'

function createRandomKey(length) {
  return Math.random().toString(36).substr(2, length)
}

function extractPath(string) {
  let match = string.match(/^https?:\/\/[^\/]*/)

  if (match == null)
    return string

  warning(
    false,
    'Location path must be pathname + query string only, not a fully qualified URL like "%s"',
    string
  )

  return string.substring(match[0].length)
}

function locationsAreEqual(a, b) {
  return a.pathname === b.pathname &&
    a.search === b.search &&
    //a.action === b.action && // Different action !== location change.
    a.key === b.key &&
    deepEqual(a.state, b.state)
}

const DefaultKeyLength = 6

function createHistory(options={}) {
  let { getCurrentLocation, finishTransition, saveState, go, keyLength, getUserConfirmation } = options

  if (typeof keyLength !== 'number')
    keyLength = DefaultKeyLength

  let transitionHooks = []

  function listenBefore(hook) {
    transitionHooks.push(hook)

    return function () {
      transitionHooks = transitionHooks.filter(item => item !== hook)
    }
  }

  let allKeys = []
  let changeListeners = []
  let location

  function getCurrent() {
    if (pendingLocation && pendingLocation.action === POP) {
      return allKeys.indexOf(pendingLocation.key)
    } else if (location) {
      return allKeys.indexOf(location.key)
    } else {
      return -1
    }
  }

  function updateLocation(newLocation) {
    let current = getCurrent()

    location = newLocation

    if (location.action === PUSH) {
      allKeys = [ ...allKeys.slice(0, current + 1), location.key ]
    } else if (location.action === REPLACE) {
      allKeys[current] = location.key
    }

    changeListeners.forEach(function (listener) {
      listener(location)
    })
  }

  function listen(listener) {
    changeListeners.push(listener)

    if (location) {
      listener(location)
    } else {
      let location = getCurrentLocation()
      allKeys = [ location.key ]
      updateLocation(location)
    }

    return function () {
      changeListeners = changeListeners.filter(item => item !== listener)
    }
  }

  function confirmTransitionTo(location, callback) {
    loopAsync(transitionHooks.length, function (index, next, done) {
      runTransitionHook(transitionHooks[index], location, function (result) {
        if (result != null) {
          done(result)
        } else {
          next()
        }
      })
    }, function (message) {
      if (getUserConfirmation && typeof message === 'string') {
        getUserConfirmation(message, function (ok) {
          callback(ok !== false)
        })
      } else {
        callback(message !== false)
      }
    })
  }

  let pendingLocation

  function transitionTo(nextLocation) {
    if (location && locationsAreEqual(location, nextLocation))
      return // Nothing to do.

    pendingLocation = nextLocation

    confirmTransitionTo(nextLocation, function (ok) {
      if (pendingLocation !== nextLocation)
        return // Transition was interrupted.

      if (ok) {
        finishTransition(nextLocation)
        updateLocation(nextLocation)
      } else if (location && nextLocation.action === POP) {
        let prevIndex = allKeys.indexOf(location.key)
        let nextIndex = allKeys.indexOf(nextLocation.key)

        if (prevIndex !== -1 && nextIndex !== -1)
          go(prevIndex - nextIndex) // Restore the URL.
      }
    })
  }

  function pushState(state, path) {
    transitionTo(
      createLocation(path, state, PUSH, createKey())
    )
  }

  function replaceState(state, path) {
    transitionTo(
      createLocation(path, state, REPLACE, createKey())
    )
  }

  function goBack() {
    go(-1)
  }

  function goForward() {
    go(1)
  }

  function createKey() {
    return createRandomKey(keyLength)
  }

  function createPath(path) {
    return path
  }

  function createHref(path) {
    return path
  }

  function createLocation(path='/', state=null, action=POP, key=createKey()) {
    let pathname = extractPath(path)
    let search = ''
    let hash = ''

    let hashIndex = pathname.indexOf('#')
    if (hashIndex !== -1) {
      hash = pathname.substring(hashIndex)
      pathname = pathname.substring(0, hashIndex)
    }

    let searchIndex = pathname.indexOf('?')
    if (searchIndex !== -1) {
      search = pathname.substring(searchIndex)
      pathname = pathname.substring(0, searchIndex)
    }

    if (pathname === '')
      pathname = '/'

    return {
      pathname,
      search,
      hash,
      state,
      action,
      key
    }
  }

  // deprecated
  function setState(state) {
    if (location) {
      updateLocationState(location, state)
      updateLocation(location)
    } else {
      updateLocationState(getCurrentLocation(), state)
    }
  }

  function updateLocationState(location, state) {
    location.state = { ...location.state, ...state }
    saveState(location.key, location.state)
  }

  // deprecated
  function registerTransitionHook(hook) {
    if (transitionHooks.indexOf(hook) === -1)
      transitionHooks.push(hook)
  }

  // deprecated
  function unregisterTransitionHook(hook) {
    transitionHooks = transitionHooks.filter(item => item !== hook)
  }

  return {
    listenBefore,
    listen,
    transitionTo,
    pushState,
    replaceState,
    go,
    goBack,
    goForward,
    createKey,
    createPath,
    createHref,
    createLocation,

    setState: deprecate(
      setState,
      'setState is deprecated; use location.key to save state instead'
    ),
    registerTransitionHook: deprecate(
      registerTransitionHook,
      'registerTransitionHook is deprecated; use listenBefore instead'
    ),
    unregisterTransitionHook: deprecate(
      unregisterTransitionHook,
      'unregisterTransitionHook is deprecated; use the callback returned from listenBefore instead'
    )
  }
}

export default createHistory
