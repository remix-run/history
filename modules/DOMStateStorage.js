import warning from 'warning'

/*eslint-disable no-empty */
const KeyPrefix = '@@History/'

function createKey(key) {
  return KeyPrefix + key
}

export function saveState(key, state) {
  try {
    window.sessionStorage.setItem(createKey(key), JSON.stringify(state))
  } catch (error) {
    if (error.name === 'QuotaExceededError')
      return warning(null, 'sessionStore is not accessible in incognito mode')

    throw error
  }
}

export function readState(key) {
  let json = window.sessionStorage.getItem(createKey(key))

  if (json) {
    try {
      return JSON.parse(json)
    } catch (error) {
      // Ignore invalid JSON.
    }
  }

  return null
}
