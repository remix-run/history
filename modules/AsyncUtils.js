export const loopAsync = (turns, work, callback) => {
  let currentTurn = 0, isDone = false
  let sync = false, hasNext = false, doneArgs

  const done = (...args) => {
    isDone = true

    if (sync) {
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

    if (sync)
      return // Iterate instead of recursing if possible.

    sync = true

    while (!isDone && currentTurn < turns && hasNext) {
      hasNext = false
      work.call(this, currentTurn++, next, done)
    }

    sync = false

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
