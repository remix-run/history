const execSteps = (steps, history, done) => {
  let index = 0, unlisten

  const cleanup = (...args) => {
    unlisten()
    done(...args)
  }

  const execNextStep = (...args) => {
    try {
      steps[index++](...args)

      if (index === steps.length)
        cleanup()
    } catch (error) {
      cleanup(error)
    }
  }

  if (steps.length) {
    unlisten = history.listen(execNextStep)
    execNextStep(history.getCurrentLocation())
  } else {
    done()
  }
}

export default execSteps
