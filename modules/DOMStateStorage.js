/*eslint-disable no-empty */
import warning from 'warning'

const KeyPrefix = '@@History/'
const QuotaExceededError = 'QuotaExceededError'
const SecurityError = 'SecurityError'

function createKey(key) {
  return KeyPrefix + key
}

export function saveState(key, state) {
  try {
    window.sessionStorage.setItem(createKey(key), JSON.stringify(state))
  } catch (error) {
    if (error.name === SecurityError) {
      // Blocking cookies in Chrome/Firefox/Safari throws SecurityError on any
      // attempt to access window.sessionStorage.
      warning(
        false,
        '[history] Unable to save state; sessionStorage is not available due to security settings'
      )

      return
    }

    if (error.name === QuotaExceededError && window.sessionStorage.length === 0) {
      // Safari "private mode" throws QuotaExceededError.
      warning(
        false,
        '[history] Unable to save state; sessionStorage is not available in Safari private mode'
      )

      return
    }

    throw error
  }
}

export function readState(key) {
  let json
  try {
    json = window.sessionStorage.getItem(createKey(key))
  } catch (error) {
    if (error.name === SecurityError) {
      // Blocking cookies in Chrome/Firefox/Safari throws SecurityError on any
      // attempt to access window.sessionStorage.
      warning(
        false,
        '[history] Unable to read state; sessionStorage is not available due to security settings'
      )

      return null
    }
  }

  if (json) {
    try {
      return JSON.parse(json)
    } catch (error) {
      // Ignore invalid JSON.
    }
  }

  return null
}
