import warning from 'warning'
import invariant from 'invariant'
import { PUSH, REPLACE, POP } from './Actions'
import createHistory from './createHistory'
import parsePath from './parsePath'

function createMemoryHistory(options={}) {
  if (Array.isArray(options)) {
    options = { entries: options }
  } else if (typeof options === 'string') {
    options = { entries: [ options ] }
  }

  let { entries, current, ...historyOptions } = options

  if (typeof entries === 'string') {
    entries = [ entries ]
  } else if (!Array.isArray(entries)) {
    entries = [ '/' ]
  }

  const history = createHistory({
    ...historyOptions,
    getCurrentLocation,
    finishTransition,
    go
  })

  // Make sure entries all are valid.
  entries = entries.map(function (entry) {
    if (typeof entry === 'string')
      entry = parsePath(entry)

    invariant(
      entry && typeof entry === 'object',
      'Unable to create history entry from %s',
      entry
    )

    return {
      ...entry,
      key: history.createKey()
    }
  })

  if (current == null) {
    current = entries.length - 1
  } else {
    invariant(
      current >= 0 && current < entries.length,
      'Current index must be >= 0 and < %s, was %s',
      entries.length, current
    )
  }

  function getCurrentLocation() {
    const { key, ...location } = entries[current]
    return history.createLocation(location, undefined, key)
  }

  function finishTransition(location) {
    switch (location.action) {
      case PUSH:
        current += 1

        // If we are not on the top of stack
        // remove rest and push a new entry.
        if (current < entries.length)
          entries.splice(current)

        entries.push(location)
        break
      case REPLACE:
        entries[current] = location
        break
    }
  }

  function canGo(n) {
    const index = current + n
    return index >= 0 && index < entries.length
  }

  function go(n) {
    if (n) {
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

      // change action to POP
      history.transitionTo({ ...currentLocation, action: POP })
    }
  }

  return history
}

export default createMemoryHistory
