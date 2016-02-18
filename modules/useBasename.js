import { canUseDOM } from './ExecutionEnvironment'
import { extractPath, parsePath } from './PathUtils'
import runTransitionHook from './runTransitionHook'

function useBasename(createHistoryOrLocationProvider) {
  return function (options={}) {
    let history, locationProvider
    let { basename } = options

    // Automatically use the value of <base href> in HTML
    // documents as basename if it's not explicitly given.
    if (basename == null && canUseDOM) {
      const base = document.getElementsByTagName('base')[0]

      if (base)
        basename = extractPath(base.href)
    }

    function addBasename(location) {
      if (basename && location.basename == null) {
        if (location.pathname.indexOf(basename) === 0) {
          location.pathname = location.pathname.substring(basename.length)
          location.basename = basename

          if (location.pathname === '')
            location.pathname = '/'
        } else {
          location.basename = ''
        }
      }

      return location
    }

    function prependBasename(location) {
      if (!basename)
        return location

      if (typeof location === 'string')
        location = parsePath(location)

      const pname = location.pathname
      const normalizedBasename = basename.slice(-1) === '/' ? basename : basename + '/'
      const normalizedPathname = pname.charAt(0) === '/' ? pname.slice(1) : pname
      const pathname = normalizedBasename + normalizedPathname

      return {
        ...location,
        pathname
      }
    }

    // Override all read methods with basename-aware versions.
    function listenBefore(hook) {
      return history.listenBefore(function (location, callback) {
        runTransitionHook(hook, addBasename(location), callback)
      })
    }

    function listen(listener) {
      return history.listen(function (location) {
        listener(addBasename(location))
      })
    }

    // Override all write methods with basename-aware versions.
    function push(location) {
      history.push(prependBasename(location))
    }

    function replace(location) {
      history.replace(prependBasename(location))
    }

    function createPath(location) {
      return locationProvider.createPath(prependBasename(location))
    }

    function createHref(location) {
      return locationProvider.createHref(prependBasename(location))
    }

    function createLocation(location, ...args) {
      return addBasename(
        locationProvider.createLocation(prependBasename(location), ...args)
      )
    }

    if (typeof createHistoryOrLocationProvider === 'function') {
      history = createHistoryOrLocationProvider(options)
      locationProvider = history.locationProvider

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
    } else if (typeof createHistoryOrLocationProvider === 'object') {
      locationProvider = createHistoryOrLocationProvider

      return {
        ...locationProvider,
        createPath,
        createHref,
        createLocation
      }
    }
  }
}

export default useBasename
