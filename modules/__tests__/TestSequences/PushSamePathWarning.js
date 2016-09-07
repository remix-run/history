import expect from 'expect'
import execSteps from './execSteps'

export default (history, done) => {
  let prevLocation

  const steps = [
    (location) => {
      expect(location).toMatch({
        path: '/'
      })

      history.push('/home')
    },
    (location, action) => {
      expect(action).toBe('PUSH')
      expect(location).toMatch({
        path: '/home'
      })

      prevLocation = location

      history.push('/home')
    },
    (location, action) => {
      expect(action).toBe('PUSH')
      expect(location).toMatch({
        path: '/home'
      })

      // We should get the SAME location object. Nothing
      // new was added to the history stack.
      expect(location).toBe(prevLocation)

      // We should see a warning message.
      expect(warningMessage).toMatch('Hash history cannot PUSH the same path; a new entry will not be added to the history stack')

      history.goBack()
    },
    (location, action) => {
      expect(action).toBe('POP')
      expect(location).toMatch({
        path: '/'
      })
    }
  ]

  let consoleError = console.error
  let warningMessage

  console.error = (message) => {
    warningMessage = message
  }

  execSteps(steps, history, (...args) => {
    console.error = consoleError
    done(...args)
  })
}
