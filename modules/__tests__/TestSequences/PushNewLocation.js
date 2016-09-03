import expect from 'expect'
import execSteps from './execSteps'

export default (history, done) => {
  const steps = [
    (location) => {
      expect(location).toMatch({
        path: '/'
      })

      history.push('/home?the=query#the-hash')
    },
    (location, action) => {
      expect(action).toBe('PUSH')
      expect(location).toMatch({
        path: '/home?the=query#the-hash'
      })
    }
  ]

  execSteps(steps, history, done)
}
