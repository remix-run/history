function useBasename(createHistory) {
  return function (options={}) {
    let { basename, ...historyOptions } = options
    let history = createHistory(historyOptions)

    function listen(listener) {
      return history.listen(function (location) {
        if (basename && location.basename == null) {
          if (location.pathname.indexOf(basename) === 0) {
            location.pathname = location.pathname.replace(basename, '')
            location.basename = basename
          } else {
            location.basename = ''
          }
        }

        listener(location)
      })
    }

    // Override all navigation functions with basename-aware versions.
    function pushState(state, path) {
      history.pushState(state, createPath(path))
    }

    function replaceState(state, path) {
      history.replaceState(state, createPath(path))
    }

    function createPath(path) {
      return basename ? basename + path : path
    }

    function createHref(path) {
      return history.createHref(createPath(path))
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

export default useBasename
