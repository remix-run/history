import warning from 'warning'
import { parse, stringify } from 'query-string'
import runTransitionHook from './runTransitionHook'
import { parsePath } from './PathUtils'

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
    const history = createHistory(options)

    let { stringifyQuery, parseQueryString } = options

    if (typeof stringifyQuery !== 'function')
      stringifyQuery = defaultStringifyQuery

    if (typeof parseQueryString !== 'function')
      parseQueryString = defaultParseQueryString

    function decodeQuery(location) {
      if (location.query == null)
        location.query = parseQueryString(location.search.substring(1))

      return location
    }

    function encodeQuery(location, query) {
      if (query == null)
        return location

      warning(
        stringifyQuery !== defaultStringifyQuery || !isNestedObject(query),
        'useQueries does not stringify nested query objects by default; ' +
        'use a custom stringifyQuery function'
      )

      if (typeof location === 'string')
        location = parsePath(location)

      const queryString = stringifyQuery(query)
      const search = queryString ? '?' + queryString : ''

      return {
        ...location,
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
      history.push(encodeQuery(location, location.query))
    }

    function replace(location) {
      history.replace(encodeQuery(location, location.query))
    }

    function createPath(location) {
      return history.createPath(encodeQuery(location, location.query))
    }

    function createHref(location) {
      return history.createHref(encodeQuery(location, location.query))
    }

    function createLocation(location, ...args) {
      const newLocation =
        history.createLocation(encodeQuery(location, location.query), ...args)

      if (location.query)
        newLocation.query = location.query

      return decodeQuery(newLocation)
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
