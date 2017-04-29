import expect from 'expect'
import execSteps from './execSteps'

export default (history, done) => {
  const steps = [
    (location) => {
      expect(location).toMatch({
        pathname: '/'
      })

      history.navigate({
        pathname: '/home',
        state: { 'push': true }
      })
    },
    (location, action) => {
      expect(action).toBe('PUSH')
      expect(location).toMatch({
        pathname: '/home',
        state: { 'push': true }
      })

      history.navigate({
        pathname: '/home',
        state: { 'push': false }
      })
    },
    (location, action) => {
      expect(action).toBe('REPLACE')
      expect(location).toMatch({
        pathname: '/home',
        state: { 'push': false }
      })
    }
  ]

  execSteps(steps, history, done)
}
