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

  const transitionManager = createTransitionManager()

  const setState = (nextState) => {
    Object.assign(history, nextState)

    transitionManager.notifyListeners(
      history.location,
      history.action
    )
  }

  const createKey = () =>
    Math.random().toString(36).substr(2, keyLength)

  const index = clamp(initialIndex, 0, initialEntries.length - 1)
  // Normalize entries based on type.
  const entries = initialEntries.map(entry => (
    typeof entry === 'string' ? { path: entry } : entry
  ))

  // Public interface

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

      const prevIndex = history.index
      const nextIndex = prevIndex + 1

      const nextEntries = history.entries.slice(0)
      if (nextEntries.length > nextIndex) {
        nextEntries.splice(nextIndex, nextEntries.length - nextIndex, location)
      } else {
        nextEntries.push(location)
      }

      setState({
        action,
        location: nextEntries[nextIndex],
        index: nextIndex,
        entries: nextEntries
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

      history.entries[history.index] = location

      setState({ action, location })
    })
  }

  const go = (n) => {
    const nextIndex = clamp(history.index + n, 0, history.entries.length - 1)

    const action = 'POP'
    const location = history.entries[nextIndex]

    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, (ok) => {
      if (ok) {
        setState({
          action,
          location,
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
    const nextIndex = history.index + n
    return nextIndex >= 0 && nextIndex < history.entries.length
  }

  const block = (prompt = false) =>
    transitionManager.setPrompt(prompt)

  const listen = (listener) =>
    transitionManager.appendListener(listener)

  const history = {
    action: 'POP',
    location: entries[index],
    index,
    entries,
    push,
    replace,
    go,
    goBack,
    goForward,
    canGo,
    block,
    listen
  }

  return history
}

export default createMemoryHistory
