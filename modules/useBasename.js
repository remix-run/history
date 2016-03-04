import { canUseDOM } from './ExecutionEnvironment'
import { extractPath, parsePath } from './PathUtils'
import runTransitionHook from './runTransitionHook'

const useBasename = (createHistory) =>
  (options = {}) => {
    const history = createHistory(options)
    let { basename } = options

    // Automatically use the value of <base href> in HTML
    // documents as basename if it's not explicitly given.
    if (basename == null && canUseDOM) {
      const base = document.getElementsByTagName('base')[0]

      if (base)
        basename = extractPath(base.href)
    }

    const addBasename = (location) => {
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
