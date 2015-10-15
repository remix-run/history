/*eslint-disable no-empty */
import warning from 'warning'

const KeyPrefix = '@@History/'

function createKey(key) {
  return KeyPrefix + key
}

export function saveState(key, state) {
  try {
    window.sessionStorage.setItem(createKey(key), JSON.stringify(state))
  } catch (error) {
    // Could be in Safari "private mode" where sessionStorage quota is 0. #42
    // Or cookies are disabled. #97
    warning(
      false,
      '[history] Unable to save state.'
    )
  }
}

export function readState(key) {
  try {
    const json = window.sessionStorage.getItem(createKey(key))
  
    if (json) {
      try {
        return JSON.parse(json)
      } catch (error) {
        // Ignore invalid JSON.
      }
    }
  } catch (error) {
    // Cookies might be disabled. #97
    warning(
      false,
      '[history] Unable to read state.'
    )
  }

  return null
}
