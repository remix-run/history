import { POP } from './Actions'
import parsePath from './parsePath'

function createLocation(path='/', state=null, action=POP, key=null) {
  if (typeof path === 'string')
    path = parsePath(path)

  const pathname = path.pathname || '/'
  const search = path.search || ''
  const hash = path.hash || ''

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
