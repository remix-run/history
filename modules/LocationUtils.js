import warning from 'warning'
import { parsePath } from './PathUtils'

// A private helper function used to create location
// objects from the args to push/replace.
export const createLocation = (path, state, key) => {
  let location
  if (typeof path === 'string') {
    // Two-arg form: push(path, state)
    location = parsePath(path)
    location.state = state
  } else {
    // One-arg form: push(location)
    location = { ...path }

    if (state !== undefined) {
      if (location.state === undefined) {
        location.state = state
      } else {
        warning(
          false,
          'When providing a location-like object with state as the first argument to push/replace ' +
          'you should avoid providing a second "state" argument; it is ignored'
        )
      }
    }
  }

  location.key = key

  return location
}

const looseEqual = (a, b) => {
  if (a == null)
    return a == b

  const typeofA = typeof a
  const typeofB = typeof b

  if (typeofA !== typeofB)
    return false

  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length)
      return false

    return a.every((item, index) => looseEqual(item, b[index]))
  } else if (typeofA === 'object') {
    const keysOfA = Object.keys(a)
    const keysOfB = Object.keys(b)

    if (keysOfA.length !== keysOfB.length)
      return false

    return keysOfA.every(key => looseEqual(a[key], b[key]))
  }

  return a === b
}

export const locationsAreEqual = (a, b) =>
  a.pathname === b.pathname &&
  a.search === b.search &&
  a.hash === b.hash &&
  a.key === b.key &&
  looseEqual(a.state, b.state)
