import { createLocation } from './LocationUtils'
import { createPath } from './PathUtils'

export { getUserConfirmation, go } from './BrowserProtocol'

export const getCurrentLocation = () =>
  createLocation(window.location)

export const pushLocation = (location) => {
  window.location.href = createPath(location)
  return false // Don't update location
}

export const replaceLocation = (location) => {
  window.location.replace(createPath(location))
  return false // Don't update location
}
