import runTransitionHook from './runTransitionHook'
import { parsePath } from './PathUtils'

const useBasename = (createHistory) =>
  (options = {}) => {
    const history = createHistory(options)
    const { basename } = options

    const addBasename = (location) => {
      if (!location)
        return location

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

    const prependBasename = (location) => {
      if (!basename)
        return location

      const object = typeof location === 'string' ? parsePath(location) : location
      const pname = object.pathname
      const normalizedBasename = basename.slice(-1) === '/' ? basename : `${basename}/`
      const normalizedPathname = pname.charAt(0) === '/' ? pname.slice(1) : pname
      const pathname = normalizedBasename + normalizedPathname

      return {
        ...object,
        pathname
      }
    }

    // Override all read methods with basename-aware versions.
    const getCurrentLocation = () =>
      addBasename(history.getCurrentLocation())

    const listenBefore = (hook) =>
      history.listenBefore(
        (location, callback) =>
          runTransitionHook(hook, addBasename(location), callback)
      )

    const listen = (listener) =>
      history.listen(location => listener(addBasename(location)))

    // Override all write methods with basename-aware versions.
    const push = (location) =>
      history.push(prependBasename(location))

    const replace = (location) =>
      history.replace(prependBasename(location))

    const createPath = (location) =>
      history.createPath(prependBasename(location))

    const createHref = (location) =>
      history.createHref(prependBasename(location))

    const createLocation = (location, ...args) =>
      addBasename(history.createLocation(prependBasename(location), ...args))

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

export default useBasename
