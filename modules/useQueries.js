import warning from 'warning'
import { parse, stringify } from 'query-string'
import runTransitionHook from './runTransitionHook'

function defaultStringifyQuery(query) {
  return stringify(query).replace(/%20/g, '+')
}

const defaultParseQueryString = parse

function isNestedObject(object) {
  for (const p in object)
    if (object.hasOwnProperty(p) &&
        typeof object[p] === 'object' &&
        !Array.isArray(object[p]) &&
        object[p] !== null)
      return true

  return false
}

/**
 * Returns a new createHistory function that may be used to create
 * history objects that know how to handle URL queries.
 */
function useQueries(createHistory) {
  return function (options={}) {
    let { stringifyQuery, parseQueryString, ...historyOptions } = options

    if (typeof stringifyQuery !== 'function')
      stringifyQuery = defaultStringifyQuery

    if (typeof parseQueryString !== 'function')
      parseQueryString = defaultParseQueryString

    const history = createHistory(historyOptions)

    function decodeQuery(location) {
      if (location.query == null)
        location.query = parseQueryString(location.search.substring(1))

      return location
    }

    function encodeQuery(location) {
      if (typeof location === 'string')
        return location

      const { query, ...rest } = location

      let queryString
      if (!query || (queryString = stringifyQuery(query)) === '')
        return rest

      warning(
        stringifyQuery !== defaultStringifyQuery || !isNestedObject(query),
        'useQueries does not stringify nested query objects by default; ' +
        'use a custom stringifyQuery function'
      )

      const search = '?' + queryString

      return {
        ...rest,
        search
      }
    }

    // Override all read methods with query-aware versions.
    function listenBefore(hook) {
      return history.listenBefore(function (location, callback) {
        runTransitionHook(hook, decodeQuery(location), callback)
      })
    }

    function listen(listener) {
      return history.listen(function (location) {
        listener(decodeQuery(location))
      })
    }

    // Override all write methods with query-aware versions.
    function push(location) {
      history.push(encodeQuery(location))
    }

    function replace(location) {
      history.replace(encodeQuery(location))
    }

    function createPath(location) {
      return history.createPath(encodeQuery(location))
    }

    function createHref(location) {
      return history.createHref(encodeQuery(location))
    }

    function createLocation() {
      return decodeQuery(history.createLocation.apply(history, arguments))
    }

    return {
      ...history,
      listenBefore,
      listen,
      push,
      replace,
      createPath,
      createHref,
      createLocation
    }
  }
}

export default useQueries
