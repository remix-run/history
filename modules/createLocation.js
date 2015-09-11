import warning from 'warning'
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

  let hashIndex = path.indexOf('#')
  if (hashIndex !== -1) {
    pathname = path.substring(0, hashIndex)
    hash = path.substring(hashIndex)
  }

  let searchIndex = path.indexOf('?')
  if (searchIndex !== -1) {
    pathname = path.substring(0, searchIndex)
    search = path.substring(searchIndex)
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

export default createLocation
