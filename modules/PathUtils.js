export const addLeadingSlash = (path) =>
  path.charAt(0) === '/' ? path : '/' + path

export const stripLeadingSlash = (path) =>
  path.charAt(0) === '/' ? path.substr(1) : path

export const hasBasename = (path, prefix) => 
  (new RegExp('^' + prefix + '(\\/|\\?|#|$)', 'i')).test(path)

export const stripBasename = (path, prefix) =>
  hasBasename(path, prefix) ? path.substr(prefix.length) : path

export const addTrailingSlash = (path) =>
  path.charAt(path.length - 1) === '/' ? path : path + '/'

export const stripTrailingSlash = (path) =>
  path.charAt(path.length - 1) === '/' ? path.slice(0, -1) : path

export const parsePath = (path) => {
  let pathname = path || '/'
  let search = ''
  let hash = ''

  const hashIndex = pathname.indexOf('#')
  if (hashIndex !== -1) {
    hash = pathname.substr(hashIndex)
    pathname = pathname.substr(0, hashIndex)
  }

  const searchIndex = pathname.indexOf('?')
  if (searchIndex !== -1) {
    search = pathname.substr(searchIndex)
    pathname = pathname.substr(0, searchIndex)
  }
  
  pathname = decodeURI(pathname)

  return {
    pathname,
    search: search === '?' ? '' : search,
    hash: hash === '#' ? '' : hash
  }
}

export const normalizePath = (path) =>
  path ? stripTrailingSlash(addLeadingSlash(path)) : ''

const combinePathSearchHash = (path, search, hash) => {
  if (search && search !== '?')
    path += (search.charAt(0) === '?' ? search : `?${search}`)

  if (hash && hash !== '#')
    path += (hash.charAt(0) === '#' ? hash : `#${hash}`)

  return path
}

export const createPath = (location) => {
  const { pathname, search, hash } = location

  let path = encodeURI(pathname || '/')

  return combinePathSearchHash(path, search, hash)
}

export const createHref = (basename, location, trailingSlashOptions) => {
  trailingSlashOptions = trailingSlashOptions || {}
  const normBase = normalizePath(basename, true)
  const { pathname, search, hash } = location
  let normPath = addLeadingSlash(pathname)
  if (!trailingSlashOptions.basePath && normPath === '/') {
    normPath = ''
  }
  let fullPath = normBase + normPath
  if (typeof trailingSlashOptions.enforcePolicy !== 'undefined') {
    fullPath = (trailingSlashOptions.enforcePolicy ?
      addTrailingSlash : 
      stripTrailingSlash)(fullPath)
  }
  fullPath = encodeURI(fullPath || '/')
  return combinePathSearchHash(fullPath, search, hash)
  /*
  trailingSlashOptions?: {
    enforcePolicy?: boolean, //if not undefined, determines whether
                             //hrefs will have trailing slash.
                             //if undefined, keeps format of location.pathname
    basePath?: boolean       //how to handle non-empty basename and
                             //location.pathname == "/".
                             //if truthy, '/the/base/'.
                             //if falsey, '/the/base'.
  }
  */
}