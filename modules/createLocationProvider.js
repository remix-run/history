import { createPath } from './PathUtils'
import createLocation from './createLocation'

function createLocationProvider() {
  function createHref(location) {
    return createPath(location)
  }

  return {
    createLocation,
    createPath,
    createHref
  }
}

export default createLocationProvider
