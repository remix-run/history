import expect from 'expect'
import execSteps from './execSteps'

export default (history, done) => {
  const steps = [
    (location) => {
      expect(location).toMatch({
        path: '/'
      })

      const unblock = history.block(nextLocation => {
        expect(nextLocation).toMatch({
          path: '/home'
        })

        // Cancel the transition.
        return false
      })

      history.push('/home')

      expect(history.getCurrentLocation()).toMatch({
        path: '/'
      })

      unblock()
    }
  ]

  execSteps(steps, history, done)
}
