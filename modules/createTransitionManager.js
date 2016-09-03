import warning from 'warning'
import invariant from 'invariant'

const createTransitionManager = () => {
  let prompt = null

  const setPrompt = (nextPrompt) => {
    invariant(
      typeof nextPrompt === 'string' || typeof nextPrompt === 'function',
      'A history prompt must be a string or a function'
    )

    warning(
      prompt == null,
      'A history supports only one prompt at a time'
    )

    prompt = nextPrompt

    return () => {
      if (prompt === nextPrompt)
        prompt = null
    }
  }

  const confirmTransitionTo = (location, action, getUserConfirmation, callback) => {
    // TODO: If another transition starts while we're still confirming
    // the previous one, we may end up in a weird state. Figure out the
    // best way to handle this.
    if (prompt) {
      if (typeof getUserConfirmation === 'function') {
        const message = typeof prompt === 'function' ? prompt(location, action) : prompt

        if (message) {
          getUserConfirmation(message, callback)
        } else {
          // No message means they decided not to prompt the user.
          callback(true)
        }
      } else {
        warning(
          false,
          'A history needs a getUserConfirmation function in order to use a prompt'
        )

        callback(true)
      }
    } else {
      callback(true)
    }
  }

  let listeners = []

  const appendListener = (listener) => {
    listeners.push(listener)

    return () => {
      listeners = listeners.filter(item => item !== listener)
    }
  }

  const transitionTo = (...args) =>
    listeners.forEach(listener => listener(...args))

  return {
    setPrompt,
    confirmTransitionTo,
    appendListener,
    transitionTo
  }
}

export default createTransitionManager
