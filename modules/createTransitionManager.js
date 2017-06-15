const runHook = (i, fns, ...args) => {
  if (i === fns.length) return Promise.resolve()
  return Promise.resolve(fns[i](...args))
    .then(res => res ? res : runHook(i+1, fns, ...args))
}

const createTransitionManager = () => {
  let preListeners = []

  const confirmTransitionTo = (location, action) => {
    // TODO: If another transition starts while we're still confirming
    // the previous one, we may end up in a weird state. Figure out the
    // best way to handle this.
    return runHook(0, preListeners, location, action)
      // If any hook returns truthy, not confirmed
      .then(res => !res)
      // If an error was thrown, don't block the transition
      .catch(() => true)
  }

  const before = hook => {
    preListeners.push(hook)

    return () => {
      preListeners = preListeners.filter(fn => fn !== hook)
    }
  }

  let listeners = []

  const appendListener = (fn) => {
    let isActive = true

    const listener = (...args) => {
      if (isActive)
        fn(...args)
    }

    listeners.push(listener)

    return () => {
      isActive = false
      listeners = listeners.filter(item => item !== listener)
    }
  }

  const notifyListeners = (...args) => {
    listeners.forEach(listener => listener(...args))
  }

  return {
    before,
    confirmTransitionTo,
    appendListener,
    notifyListeners
  }
}

export default createTransitionManager
