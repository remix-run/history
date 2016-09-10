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

        return 'Are you sure?'
      })

      history.push('/home')

      expect(history.location).toMatch({
        path: '/'
      })

      unblock()
    }
  ]

  execSteps(steps, history, done)
}
