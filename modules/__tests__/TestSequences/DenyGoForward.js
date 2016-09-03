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

      history.goBack()
    },
    (location, action) => {
      expect(action).toBe('POP')
      expect(location).toMatch({
        path: '/'
      })

      unblock = history.block(nextLocation => {
        expect(nextLocation).toMatch({
          path: '/home'
        })

        return 'Are you sure?'
      })

      history.goForward()
    },
    (location, action) => {
      expect(action).toBe('POP')
      expect(location).toMatch({
        path: '/'
      })

      unblock()
    }
  ]

  execSteps(steps, history, done)
}
