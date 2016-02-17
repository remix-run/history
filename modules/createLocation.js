import { POP } from './Actions'
import { parsePath } from './PathUtils'

function createLocation(location='/', action=POP, key=null) {
  if (typeof location === 'string')
    location = parsePath(location)

  const pathname = location.pathname || '/'
  const search = location.search || ''
  const hash = location.hash || ''
  const state = location.state || null

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
