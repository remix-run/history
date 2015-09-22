function useBasename(createHistory) {
  return function (options={}) {
    let { basename, ...historyOptions } = options
    let history = createHistory(historyOptions)

    function listen(listener) {
      return history.listen(function (location) {
        // When new locations are emitted, remove the
        // basename from the beginning of the pathname.
        if (location.pathname.indexOf(basename) === 0)
          location.pathname = location.pathname.replace(basename, '')

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
      return basename + path
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
