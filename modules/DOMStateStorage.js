/* eslint-disable no-empty */
import warning from 'warning'

const QuotaExceededErrors = [
  'QuotaExceededError',
  'QUOTA_EXCEEDED_ERR'
]

const SecurityError = 'SecurityError'
const KeyPrefix = '@@History/'
const STORAGE = window.sessionStorage || (() => {
      let storage = {}

      return {
        removeItem(key) {
          delete storage[key]
          storage.length = Object.keys(storage)
        },
        setItem(key, item) {
          storage[key] = item
          storage.length = Object.keys(storage)
        },
        getItem(key) {
          return storage[key]
        },
        clear() {
          storage = {}
          storage.length = 0
        }
      }
    })()

const createKey = (key) =>
KeyPrefix + key

export const saveState = (key, state) => {
  try {
    if (state == null) {
      STORAGE.removeItem(createKey(key))
    } else {
      STORAGE.setItem(createKey(key), JSON.stringify(state))
    }
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

    if (QuotaExceededErrors.indexOf(error.name) >= 0 && STORAGE.length === 0) {
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

export const readState = (key) => {
  let json
  try {
    json = STORAGE.getItem(createKey(key))
  } catch (error) {
    if (error.name === SecurityError) {
      // Blocking cookies in Chrome/Firefox/Safari throws SecurityError on any
      // attempt to access window.sessionStorage.
      warning(
        false,
        '[history] Unable to read state; sessionStorage is not available due to security settings'
      )

      return undefined
    }
  }

  if (json) {
    try {
      return JSON.parse(json)
    } catch (error) {
      // Ignore invalid JSON.
    }
  }

  return undefined
}
