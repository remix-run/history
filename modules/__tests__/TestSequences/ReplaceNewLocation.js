import expect from 'expect'
import execSteps from './execSteps'

export default (history, done) => {
  const steps = [
    (location) => {
      expect(location).toMatch({
        path: '/'
      })

      history.replace('/home?the=query#the-hash')
    },
    (location, action) => {
      expect(action).toBe('REPLACE')
      expect(location).toMatch({
        path: '/home?the=query#the-hash'
      })
    }
  ]

  execSteps(steps, history, done)
}
