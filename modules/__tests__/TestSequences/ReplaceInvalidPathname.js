import expect from 'expect'
import execSteps from './execSteps'

export default (history, done) => {
  const steps = [
    () => {
      // encoded string
      const pathname = '/hello%'
      expect(() => {
        history.replace(pathname)
      }).toThrow(
        'You are attempting to create a path that cannot be decoded. ' +
        'Please call encodeURI on the pathname.'
      )
    }
  ]

  let consoleError = console.error // eslint-disable-line no-console

  console.error = () => {} // eslint-disable-line no-console

  execSteps(steps, history, (...args) => {
    console.error = consoleError // eslint-disable-line no-console
    done(...args)
  })
}
