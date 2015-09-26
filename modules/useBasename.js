import runTransitionHook from './runTransitionHook'

function useBasename(createHistory) {
  return function (options={}) {
    let { basename, ...historyOptions } = options
    let history = createHistory(historyOptions)

    function stripBasename(location) {
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

    function addBasename(path) {
      return basename ? basename + path : path
    }

    // Override all read methods with basename-aware versions.
    function listenBefore(hook) {
      return history.listenBefore(function (location, callback) {
        runTransitionHook(hook, stripBasename(location), callback)
      })
    }

    function listen(listener) {
      return history.listen(function (location) {
        listener(stripBasename(location))
      })
    }

    // Override all write methods with basename-aware versions.
    function pushState(state, path) {
      history.pushState(state, addBasename(path))
    }

    function replaceState(state, path) {
      history.replaceState(state, addBasename(path))
    }

    function createPath(path) {
      return history.createPath(addBasename(path))
    }

    function createHref(path) {
      return history.createHref(addBasename(path))
    }

    return {
      ...history,
      listenBefore,
      listen,
      pushState,
      replaceState,
      createPath,
      createHref
    }
  }
}

export default useBasename
