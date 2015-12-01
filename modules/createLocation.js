import { POP } from './Actions'
import parsePath from './parsePath'

function createLocation(location='/', state=null, action=POP, key=null) {
  if (typeof location === 'string')
    location = parsePath(location)

  const pathname = location.pathname || '/'
  const search = location.search || ''
  const hash = location.hash || ''

  // TODO: Deprecate passing state directly into createLocation.
  state = location.state || state

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
