import { POP } from './Actions'
import { parsePath } from './PathUtils'

const createLocation = (location = '/', action = POP, key = null) => {
  const object = typeof location === 'string' ? parsePath(location) : location

  const pathname = object.pathname || '/'
  const search = object.search || ''
  const hash = object.hash || ''
  const state = object.state || null

  return {
    pathname,
    search,
    hash,
    state,
    action,
    key
  }
}

export default createLocation
