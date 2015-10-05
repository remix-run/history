import qs from 'qs'
import runTransitionHook from './runTransitionHook'

function defaultStringifyQuery(query) {
  return qs.stringify(query, { arrayFormat: 'brackets' })
}

function defaultParseQueryString(queryString) {
  return qs.parse(queryString)
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

    function appendQuery(pathname, query) {
      let queryString
      if (query && (queryString = stringifyQuery(query)) !== '')
        return pathname + (pathname.indexOf('?') === -1 ? '?' : '&') + queryString

      return pathname
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
    function pushState(state, pathname, query) {
      return history.pushState(state, appendQuery(pathname, query))
    }

    function replaceState(state, pathname, query) {
      return history.replaceState(state, appendQuery(pathname, query))
    }

    function createPath(pathname, query) {
      return history.createPath(appendQuery(pathname, query))
    }

    function createHref(pathname, query) {
      return history.createHref(appendQuery(pathname, query))
    }

    function createLocation() {
      return addQuery(history.createLocation.apply(history, arguments))
    }

    return {
      ...history,
      listenBefore,
      listen,
      pushState,
      replaceState,
      createPath,
      createHref,
      createLocation
    }
  }
}

export default useQueries
