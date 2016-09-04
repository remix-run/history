import warning from 'warning'
import invariant from 'invariant'
import { locationsAreEqual } from './LocationUtils'
import { addLeadingSlash, stripLeadingSlash, stripPrefix } from './PathUtils'
import createTransitionManager from './createTransitionManager'
import { canUseDOM } from './ExecutionEnvironment'
import {
  addEventListener,
  removeEventListener,
  getConfirmation,
  supportsGoWithoutReloadUsingHash
} from './DOMUtils'

const HashChangeEvent = 'hashchange'

const HashPathCoders = {
  hashbang: {
    encodePath: (path) => path.charAt(0) === '!' ? path : '!/' + stripLeadingSlash(path),
    decodePath: (path) => path.charAt(0) === '!' ? path.substr(1) : path
  },
  noslash: {
    encodePath: stripLeadingSlash,
    decodePath: addLeadingSlash
  },
  slash: {
    encodePath: addLeadingSlash,
    decodePath: addLeadingSlash
  }
}

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

const createHashHistory = (props = {}) => {
  invariant(
    canUseDOM,
    'Hash history needs a DOM'
  )

  const canGoWithoutReload = supportsGoWithoutReloadUsingHash()

  const {
    basename = '',
    getUserConfirmation = getConfirmation,
    hashType = 'slash'
  } = props

  const { encodePath, decodePath } = HashPathCoders[hashType]

  const createLocation = () => {
    let path = decodePath(getHashPath())

    if (basename)
      path = stripPrefix(path, basename)

    return {
      path
    }
  }

  // Ensure the hash is encoded properly before doing anything else.
  const path = getHashPath()
  const encodedPath = encodePath(path)

  if (path !== encodedPath)
    replaceHashPath(encodedPath)

  const initialLocation = createLocation()
  const currentState = {
    action: 'POP',
    location: initialLocation,
    allPaths: [ initialLocation.path ]
  }

  const transitionManager = createTransitionManager()

  const setState = (nextState) => {
    Object.assign(currentState, nextState)

    transitionManager.transitionTo(
      currentState.location,
      currentState.action
    )
  }

  let forceNextPop = false
  let ignorePath = null

  const handleHashChange = () => {
    const path = getHashPath()
    const encodedPath = encodePath(path)

    if (path !== encodedPath) {
      // Ensure we always have a properly-encoded hash.
      replaceHashPath(encodedPath)
    } else {
      const location = createLocation()
      const prevLocation = currentState.location

      if (!forceNextPop && locationsAreEqual(prevLocation, location))
        return // A hashchange doesn't always == location change.

      if (ignorePath === location.path)
        return // Ignore this change; we already setState in push/replace.

      ignorePath = null

      handlePop(location)
    }
  }

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
    const { location: toLocation, allPaths } = currentState

    // TODO: We could probably make this more reliable by
    // keeping a list of paths we've seen in sessionStorage.
    // Instead, we just default to 0 for paths we don't know.

    let toIndex = allPaths.lastIndexOf(toLocation.path)

    if (toIndex === -1)
      toIndex = 0

    let fromIndex = allPaths.lastIndexOf(fromLocation.path)

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
    currentState.location || createLocation()

  const push = (path, state) => {
    warning(
      state === undefined,
      'Hash history cannot push state; it will be dropped'
    )

    const action = 'PUSH'
    const location = {
      path
    }

    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, (ok) => {
      if (!ok)
        return

      const encodedPath = encodePath(basename + path)
      const hashChanged = getHashPath() !== encodedPath

      if (hashChanged) {
        // We cannot tell if a hashchange was caused by a PUSH, so we'd
        // rather setState here and ignore the hashchange. The caveat here
        // is that other hash histories in the page will consider it a POP.
        ignorePath = path
        pushHashPath(encodedPath)
      }

      const prevPaths = currentState.allPaths
      const prevIndex = prevPaths.lastIndexOf(currentState.location.path)

      const allPaths = prevPaths.slice(0, prevIndex === -1 ? 0 : prevIndex + 1)
      allPaths.push(location.path)

      setState({
        action,
        location,
        allPaths
      })
    })
  }

  const replace = (path, state) => {
    warning(
      state === undefined,
      'Hash history cannot replace state; it will be dropped'
    )

    const action = 'REPLACE'
    const location = {
      path
    }

    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, (ok) => {
      if (!ok)
        return

      const encodedPath = encodePath(basename + path)
      const hashChanged = getHashPath() !== encodedPath

      if (hashChanged) {
        // We cannot tell if a hashchange was caused by a REPLACE, so we'd
        // rather setState here and ignore the hashchange. The caveat here
        // is that other hash histories in the page will consider it a POP.
        ignorePath = path
        replaceHashPath(encodedPath)
      }

      const allPaths = currentState.allPaths.slice(0)
      const prevIndex = allPaths.indexOf(currentState.location.path)

      if (prevIndex !== -1)
        allPaths[prevIndex] = location.path

      setState({
        action,
        location,
        allPaths
      })
    })
  }

  const go = (n) => {
    warning(
      canGoWithoutReload,
      'Hash history go(n) causes a full page reload in this browser'
    )

    window.history.go(n)
  }

  const goBack = () =>
    go(-1)

  const goForward = () =>
    go(1)

  const block = (prompt = false) =>
    transitionManager.setPrompt(prompt)

  let listenerCount = 0

  const checkDOMListeners = (delta) => {
    listenerCount += delta

    if (listenerCount === 1) {
      addEventListener(window, HashChangeEvent, handleHashChange)
    } else if (listenerCount === 0) {
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

export default createHashHistory
