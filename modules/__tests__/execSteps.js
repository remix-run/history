const execSteps = (steps, done) => {
  let index = 0

  return (...args) => {
    if (steps.length === 0) {
      done()
    } else {
      try {
        steps[index++](...args)

        if (index === steps.length)
          done()
      } catch (error) {
        done(error)
      }
    }
  }
}

export default execSteps
