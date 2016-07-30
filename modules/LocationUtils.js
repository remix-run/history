import invariant from 'invariant'
import warning from 'warning'
import { parsePath } from './PathUtils'
import { POP } from './Actions'

export const createQuery = (props) =>
  Object.assign(Object.create(null), props)

export const createLocation = (input = '/', action = POP, key = null) => {
  const object = typeof input === 'string' ? parsePath(input) : input

  warning(
    !object.path,
    'Location descriptor objects should have a `pathname`, not a `path`.'
  )

  const pathname = object.pathname || '/'
  const search = object.search || ''
  const hash = object.hash || ''
  const state = object.state

  return {
    pathname,
    search,
    hash,
    state,
    action,
    key
  }
}

const isDate = (object) =>
  Object.prototype.toString.call(object) === '[object Date]'

export const statesAreEqual = (a, b) => {
  if (a === b)
    return true

  const typeofA = typeof a
  const typeofB = typeof b

  if (typeofA !== typeofB)
    return false

  invariant(
    typeofA !== 'function',
    'You must not store functions in location state'
  )

  // Not the same object, but same type.
  if (typeofA === 'object') {
    invariant(
      !(isDate(a) && isDate(b)),
      'You must not store Date objects in location state'
    )

    if (!Array.isArray(a)) {
      const keysofA = Object.keys(a)
      const keysofB = Object.keys(b)
      return keysofA.length === keysofB.length &&
        keysofA.every(key => statesAreEqual(a[key], b[key]))
    }

    return Array.isArray(b) &&
      a.length === b.length &&
      a.every((item, index) => statesAreEqual(item, b[index]))
  }

  // All other serializable types (string, number, boolean)
  // should be strict equal.
  return false
}

export const locationsAreEqual = (a, b) =>
  a.key === b.key &&
  // a.action === b.action && // Different action !== location change.
  a.pathname === b.pathname &&
  a.search === b.search &&
  a.hash === b.hash &&
  statesAreEqual(a.state, b.state)
