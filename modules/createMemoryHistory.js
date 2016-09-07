import createTransitionManager from './createTransitionManager'

const clamp = (n, lowerBound, upperBound) =>
  Math.min(Math.max(n, lowerBound), upperBound)

/**
 * Creates a history object that stores locations in memory.
 */
const createMemoryHistory = (props = {}) => {
  const {
    getUserConfirmation,
    initialEntries = [ '/' ],
    initialIndex = 0,
    keyLength = 6
  } = props

  // Normalize entries based on type.
  const entries = initialEntries.map(entry => (
    typeof entry === 'string' ? { path: entry } : entry
  ))

  const currentState = {
    prevIndex: null,
    action: 'POP',
    index: clamp(initialIndex, 0, entries.length - 1),
    entries
  }

  const transitionManager = createTransitionManager()

  const setState = (nextState) => {
    Object.assign(currentState, nextState)

    transitionManager.notifyListeners(
      getCurrentLocation(),
      currentState.action
    )
  }

  const createKey = () =>
    Math.random().toString(36).substr(2, keyLength)

  // Public interface

  const getCurrentLocation = () =>
    currentState.entries[currentState.index]

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

      const prevIndex = currentState.index
      const nextIndex = prevIndex + 1

      const entries = currentState.entries.slice(0)
      if (entries.length > nextIndex) {
        entries.splice(nextIndex, entries.length - nextIndex, location)
      } else {
        entries.push(location)
      }

      setState({
        prevIndex: currentState.index,
        action,
        index: nextIndex,
        entries
      })
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

      const prevIndex = currentState.index
      const entries = currentState.entries.slice(0)

      entries[prevIndex] = location

      setState({
        prevIndex: currentState.index,
        action,
        entries
      })
    })
  }

  const go = (n) => {
    const { index, entries } = currentState
    const nextIndex = clamp(index + n, 0, entries.length - 1)

    const action = 'POP'
    const location = entries[nextIndex]

    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, (ok) => {
      if (ok) {
        setState({
          prevIndex: index,
          action,
          index: nextIndex
        })
      } else {
        // Mimic the behavior of DOM histories by
        // causing a render after a cancelled POP.
        setState()
      }
    })
  }

  const goBack = () =>
    go(-1)

  const goForward = () =>
    go(1)

  const canGo = (n) => {
    const { index, entries } = currentState
    const nextIndex = index + n

    return nextIndex >= 0 && nextIndex < entries.length
  }

  const block = (prompt = false) =>
    transitionManager.setPrompt(prompt)

  const listen = (listener) =>
    transitionManager.appendListener(listener)

  return {
    getCurrentLocation,
    push,
    replace,
    go,
    goBack,
    goForward,
    canGo,
    block,
    listen
  }
}

export default createMemoryHistory
