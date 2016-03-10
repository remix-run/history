import deepEqual from 'deep-equal'
import { parsePath } from './PathUtils'
import { POP } from './Actions'

export const locationsAreEqual = (a, b) =>
  a.pathname === b.pathname &&
  a.search === b.search &&
  a.hash === b.hash &&
  // a.action === b.action && // Different action !== location change.
  a.key === b.key &&
  deepEqual(a.state, b.state)

export const createLocation = (input = '/', action = POP, key = null) => {
  const object = typeof input === 'string' ? parsePath(input) : input

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
