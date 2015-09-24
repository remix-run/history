import qs from 'qs'

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

    function listen(listener) {
      return history.listen(function (location) {
        if (location.query == null)
          location.query = parseQueryString(location.search.substring(1))

        listener(location)
      })
    }

    function addQuery(pathname, query) {
      let queryString
      if (query && (queryString = stringifyQuery(query)) !== '')
        return pathname + (pathname.indexOf('?') === -1 ? '?' : '&') + queryString

      return pathname
    }

    function pushState(state, pathname, query) {
      return history.pushState(state, addQuery(pathname, query))
    }

    function replaceState(state, pathname, query) {
      return history.replaceState(state, addQuery(pathname, query))
    }

    function createPath(pathname, query) {
      return history.createPath(addQuery(pathname, query))
    }

    function createHref(pathname, query) {
      return history.createHref(addQuery(pathname, query))
    }

    return {
      ...history,
      listen,
      pushState,
      replaceState,
      createPath,
      createHref
    }
  }
}

export default useQueries
