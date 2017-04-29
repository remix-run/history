import expect from 'expect'
import execSteps from './execSteps'

export default (history, done) => {
  const steps = [
    (location) => {
      expect(location).toMatch({
        pathname: '/'
      })

      history.navigate('/home#room')
    },
    (location, action) => {
      expect(action).toBe('PUSH')
      expect(location).toMatch({
        pathname: '/home',
        hash: '#room'
      })

      history.navigate('/home#stead')
    },
    (location, action) => {
      expect(action).toBe('PUSH')
      expect(location).toMatch({
        pathname: '/home',
        hash: '#stead'
      })
    }
  ]

  execSteps(steps, history, done)
}
