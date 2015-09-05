const KeyPrefix = '@@History/'

function createKey(key) {
  return KeyPrefix + key
}

export function saveState(key, state) {
  window.sessionStorage.setItem(createKey(key), JSON.stringify(state))
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
