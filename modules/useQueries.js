import { parse, stringify } from 'query-string'
import runTransitionHook from './runTransitionHook'
import { createQuery } from './LocationUtils'
import { parsePath } from './PathUtils'

const defaultStringifyQuery = (query) =>
  stringify(query).replace(/%20/g, '+')

const defaultParseQueryString = parse

/**
 * Returns a new createHistory function that may be used to create
 * history objects that know how to handle URL queries.
 */
const useQueries = (createHistory) =>
  (options = {}) => {
    const history = createHistory(options)
    let { stringifyQuery, parseQueryString } = options

    if (typeof stringifyQuery !== 'function')
      stringifyQuery = defaultStringifyQuery

    if (typeof parseQueryString !== 'function')
      parseQueryString = defaultParseQueryString

    const decodeQuery = (location) => {
      if (!location)
        return location

      if (location.query == null)
        location.query = parseQueryString(location.search.substring(1))

      return location
    }

    const encodeQuery = (location, query) => {
      if (query == null)
        return location

      const object = typeof location === 'string' ? parsePath(location) : location
      const queryString = stringifyQuery(query)
      const search = queryString ? `?${queryString}` : ''

      return {
        ...object,
        search
      }
    }

    // Override all read methods with query-aware versions.
    const getCurrentLocation = () =>
      decodeQuery(history.getCurrentLocation())

    const listenBefore = (hook) =>
      history.listenBefore(
        (location, callback) =>
          runTransitionHook(hook, decodeQuery(location), callback)
      )

    const listen = (listener) =>
      history.listen(location => listener(decodeQuery(location)))

    // Override all write methods with query-aware versions.
    const push = (location) =>
      history.push(encodeQuery(location, location.query))

    const replace = (location) =>
      history.replace(encodeQuery(location, location.query))

    const createPath = (location) =>
      history.createPath(encodeQuery(location, location.query))

    const createHref = (location) =>
      history.createHref(encodeQuery(location, location.query))

    const createLocation = (location, ...args) => {
      const newLocation =
        history.createLocation(encodeQuery(location, location.query), ...args)

      if (location.query)
        newLocation.query = createQuery(location.query)

      return decodeQuery(newLocation)
    }

    return {
      ...history,
      getCurrentLocation,
      listenBefore,
      listen,
      push,
      replace,
      createPath,
      createHref,
      createLocation
    }
  }

export default useQueries
