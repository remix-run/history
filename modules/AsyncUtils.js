export const loopAsync = (turns, work, callback) => {
  let currentTurn = 0, isDone = false
  let isSync = false, hasNext = false, doneArgs

  const done = (...args) => {
    isDone = true

    if (isSync) {
      // Iterate instead of recursing if possible.
      doneArgs = args
      return
    }

    callback(...args)
  }

  const next = () => {
    if (isDone)
      return

    hasNext = true

    if (isSync)
      return // Iterate instead of recursing if possible.

    isSync = true

    while (!isDone && currentTurn < turns && hasNext) {
      hasNext = false
      work(currentTurn++, next, done)
    }

    isSync = false

    if (isDone) {
      // This means the loop finished synchronously.
      callback(...doneArgs)
      return
    }

    if (currentTurn >= turns && hasNext) {
      isDone = true
      callback()
    }
  }

  next()
}
