import qs from 'qs'
import runTransitionHook from './runTransitionHook'
import parsePath from './parsePath'

function defaultStringifyQuery(query) {
  return qs.stringify(query, { arrayFormat: 'brackets' }).replace(/%20/g, '+')
}

function defaultParseQueryString(queryString) {
  return qs.parse(queryString.replace(/\+/g, '%20'))
}

/**
 * Returns a new createHistory function that may be used to create
 * history objects that know how to handle URL queries.
 */
function useQueries(createHistory) {
  return function (options={}) {
    let { stringifyQuery, parseQueryString, ...historyOptions } = options
    let history = createHistory(historyOptions)

    if (typeof stringifyQuery !== 'function')
      stringifyQuery = defaultStringifyQuery

    if (typeof parseQueryString !== 'function')
      parseQueryString = defaultParseQueryString

    function addQuery(location) {
      if (location.query == null)
        location.query = parseQueryString(location.search.substring(1))

      return location
    }

    function appendQuery(path, query) {
      let queryString
      if (!query || (queryString = stringifyQuery(query)) === '')
        return path

      if (typeof path === 'string')
        path = parsePath(path)

      const searchBase = path.search ? path.search + '&' : '?'
      const search = searchBase + queryString

      return {
        ...path,
        search
      }
    }

    // Override all read methods with query-aware versions.
    function listenBefore(hook) {
      return history.listenBefore(function (location, callback) {
        runTransitionHook(hook, addQuery(location), callback)
      })
    }

    function listen(listener) {
      return history.listen(function (location) {
        listener(addQuery(location))
      })
    }

    // Override all write methods with query-aware versions.
    function pushState(state, path, query) {
      if (typeof path === 'string')
        path = parsePath(path)

      push({ state, ...path, query })
    }

    function push(location) {
      history.push(appendQuery(location, location.query))
    }

    function replaceState(state, path, query) {
      if (typeof path === 'string')
        path = parsePath(path)

      replace({ state, ...path, query })
    }

    function replace(location) {
      history.replace(appendQuery(location, location.query))
    }

    function createPath(path, query) {
      return history.createPath(appendQuery(path, query))
    }

    function createHref(path, query) {
      return history.createHref(appendQuery(path, query))
    }

    function createLocation() {
      return addQuery(history.createLocation.apply(history, arguments))
    }

    return {
      ...history,
      listenBefore,
      listen,
      pushState,
      push,
      replaceState,
      replace,
      createPath,
      createHref,
      createLocation
    }
  }
}

export default useQueries
