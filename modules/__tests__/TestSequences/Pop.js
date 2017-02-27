import expect from 'expect'
import execSteps from './execSteps'

export default (history, done) => {
  const steps = [
    (location) => {
      expect(location).toMatch({
        pathname: '/'
      })

      history.push('/home')
    },
    (location, action) => {
      expect(action).toEqual('PUSH')
      expect(location).toMatch({
        pathname: '/home'
      })

      history.pop()
    },
    (location, action) => {
      expect(action).toEqual('POP')
      expect(location).toMatch({
        pathname: '/'
      })
      expect(history.entries).toMatch([{
        pathname: '/',
      }])
    }
  ]

  execSteps(steps, history, done)
}
