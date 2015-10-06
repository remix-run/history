import warning from 'warning'
import deprecate from './deprecate'
import { POP } from './Actions'

function extractPath(string) {
  let match = string.match(/https?:\/\/[^\/]*/)

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
  path = extractPath(path)

  let pathname = path
  let search = ''
  let hash = ''

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

  return {
    pathname,
    search,
    hash,
    state,
    action,
    key
  }
}

export default deprecate(
  createLocation,
  'Calling createLocation statically is deprecated; instead call the history.createLocation method - see docs/Location.md'
)
