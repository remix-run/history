import warning from 'warning'
import { POP } from './Actions'

function extractPath(string) {
  const match = string.match(/https?:\/\/[^\/]*/)

  if (match == null)
    return string

  warning(
    false,
    'Location path must be pathname + query string only, not a fully qualified URL like "%s"',
    string
  )

  return string.substring(match[0].length)
}

function createLocation(path='/', state=null, action=POP, key=null) {
  let pathname, search, hash
  if (typeof path === 'string') {
    pathname = extractPath(path)
    search = ''
    hash = ''

    let hashIndex = pathname.indexOf('#')
    if (hashIndex !== -1) {
      hash = pathname.substring(hashIndex)
      pathname = pathname.substring(0, hashIndex)
    }

    let searchIndex = pathname.indexOf('?')
    if (searchIndex !== -1) {
      search = pathname.substring(searchIndex)
      pathname = pathname.substring(0, searchIndex)
    }

    if (pathname === '')
      pathname = '/'
  } else {
    pathname = path.pathname || '/'
    search = path.search || ''
    hash = path.hash || ''
  }

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
