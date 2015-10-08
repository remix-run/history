/*eslint-disable no-empty */
import warning from 'warning'

const KeyPrefix = '@@History/'
const QuotaExceededError = 'QuotaExceededError'

function createKey(key) {
  return KeyPrefix + key
}

export function saveState(key, state) {
  try {
    window.sessionStorage.setItem(createKey(key), JSON.stringify(state))
  } catch (error) {
    if (error.name === QuotaExceededError || window.sessionStorage.length === 0) {
      // Probably in Safari "private mode" where sessionStorage quota is 0. #42
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
  const json = window.sessionStorage.getItem(createKey(key))

  if (json) {
    try {
      return JSON.parse(json)
    } catch (error) {
      // Ignore invalid JSON.
    }
  }

  return null
}
