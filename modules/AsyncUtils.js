export function loopAsync(turns, work, callback) {
  let currentTurn = 0
  let isDone = false

  function done() {
    isDone = true
    callback.apply(this, arguments)
  }

  function next() {
    if (isDone)
      return

    if (currentTurn < turns) {
      work.call(this, currentTurn++, next, done)
    } else {
      done.apply(this, arguments)
    }
  }

  next()
}
