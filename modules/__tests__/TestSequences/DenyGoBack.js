import expect from 'expect'
import execSteps from './execSteps'

export default (history, done) => {
  let unblock
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

      unblock = history.block(nextLocation => {
        expect(nextLocation).toMatch({
          path: '/'
        })

        return 'Are you sure?'
      })

      history.goBack()
    },
    (location, action) => {
      expect(action).toBe('PUSH')
      expect(location).toMatch({
        path: '/home'
      })

      unblock()
    }
  ]

  execSteps(steps, history, done)
}
