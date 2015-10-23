import warning from 'warning'

function extractPath(string) {
  const match = string.match(/^https?:\/\/[^\/]*/)

  if (match == null)
    return string

  warning(
    false,
    'A path must be pathname + search + hash only, not a fully qualified URL like "%s"',
    string
  )

  return string.substring(match[0].length)
}

function parsePath(path) {
  let pathname = extractPath(path)
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
    hash
  }
}

export default parsePath
