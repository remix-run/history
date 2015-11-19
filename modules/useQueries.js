import qs from 'qs'
import runTransitionHook from './runTransitionHook'
import parsePath from './parsePath'

const SEARCH_BASE_KEY = '$searchBase'

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
      if (location.query == null) {
        const { search } = location
        location.query = parseQueryString(search.substring(1))
        location[SEARCH_BASE_KEY] = { search, searchBase: '' }
      }

      // TODO: Instead of all the book-keeping here, this should just strip the
      // stringified query from the search.

      return location
    }

    function appendQuery(location, query) {
      let queryString
      if (!query || (queryString = stringifyQuery(query)) === '')
        return location

      if (typeof location === 'string')
        location = parsePath(location)

      const searchBaseSpec = location[SEARCH_BASE_KEY]
      let searchBase
      if (searchBaseSpec && location.search === searchBaseSpec.search) {
        searchBase = searchBaseSpec.searchBase
      } else {
        searchBase = location.search || ''
      }

      const search = searchBase + (searchBase ? '&' : '?') + queryString

      return {
        ...location,
        search,
        [SEARCH_BASE_KEY]: { search, searchBase }
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
