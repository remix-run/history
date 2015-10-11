import runTransitionHook from './runTransitionHook'
import parsePath from './parsePath'

function useBasename(createHistory) {
  return function (options={}) {
    let { basename, ...historyOptions } = options
    let history = createHistory(historyOptions)

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

    function prependBasename(path) {
      if (!basename)
        return path

      if (typeof path === 'string')
        path = parsePath(path)

      const pathname = basename + path.pathname

      return {
        ...path,
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
    function pushState(state, path) {
      history.pushState(state, prependBasename(path))
    }

    function replaceState(state, path) {
      history.replaceState(state, prependBasename(path))
    }

    function createPath(path) {
      return history.createPath(prependBasename(path))
    }

    function createHref(path) {
      return history.createHref(prependBasename(path))
    }

    function createLocation() {
      return addBasename(history.createLocation.apply(history, arguments))
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

export default useBasename
