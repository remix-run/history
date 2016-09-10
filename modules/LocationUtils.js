import { parsePath } from './PathUtils'

export const createLocation = (to, key) => {
  const location = typeof to === 'string' ? parsePath(to) : { ...to }
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
