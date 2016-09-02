import warning from 'warning'
import invariant from 'invariant'
import { createLocation } from './LocationUtils'
import { createPath, parsePath } from './PathUtils'
import createHistory from './createHistory'
import { POP } from './Actions'

const createStateStorage = (entries) =>
  entries
    .filter(entry => entry.state)
    .reduce((memo, entry) => {
      memo[entry.key] = entry.state
      return memo
    }, {})

const createMemoryHistory = (options = {}) => {
  if (Array.isArray(options)) {
    options = { entries: options }
  } else if (typeof options === 'string') {
    options = { entries: [ options ] }
  }

  const getCurrentLocation = () => {
    const entry = entries[current]
    const path = createPath(entry)

    let key, state
    if (entry.key) {
      key = entry.key
      state = readState(key)
    }

    const init = parsePath(path)

    return createLocation({ ...init, state }, undefined, key)
  }

  const canGo = (n) => {
    const index = current + n
    return index >= 0 && index < entries.length
  }

  const go = (n) => {
    if (!n)
      return

    if (!canGo(n)) {
      warning(
        false,
        'Cannot go(%s) there is not enough history',
        n
      )

      return
    }

    current += n
    const currentLocation = getCurrentLocation()

    // Change action to POP
    history.transitionTo({ ...currentLocation, action: POP })
  }

  const pushLocation = (location) => {
    current += 1

    if (current < entries.length)
      entries.splice(current)

    entries.push(location)

    saveState(location.key, location.state)
  }

  const replaceLocation = (location) => {
    entries[current] = location
    saveState(location.key, location.state)
  }

  const history = createHistory({
    ...options,
    getCurrentLocation,
    pushLocation,
    replaceLocation,
    go
  })

  let { entries, current } = options

  if (typeof entries === 'string') {
    entries = [ entries ]
  } else if (!Array.isArray(entries)) {
    entries = [ '/' ]
  }

  entries = entries.map(entry => createLocation(entry))

  if (current == null) {
    current = entries.length - 1
  } else {
    invariant(
      current >= 0 && current < entries.length,
      'Current index must be >= 0 and < %s, was %s',
      entries.length, current
    )
  }

  const storage = createStateStorage(entries)

  const saveState = (key, state) =>
    storage[key] = state

  const readState = (key) =>
    storage[key]

  return {
    ...history,
    canGo
  }
}

export default createMemoryHistory
