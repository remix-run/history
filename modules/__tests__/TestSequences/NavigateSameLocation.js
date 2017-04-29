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

      history.navigate('/home#room')
    },
    (location, action) => {
      expect(action).toBe('REPLACE')
      expect(location).toMatch({
        pathname: '/home',
        hash: '#room'
      })

      history.navigate({ pathname: '/home', hash: '#room' })
    },
    (location, action) => {
      expect(action).toBe('REPLACE')
      expect(location).toMatch({
        pathname: '/home',
        hash: '#room'
      })

      history.goBack()
    },
    (location, action) => {
      expect(action).toBe('POP')
      expect(location).toMatch({
        pathname: '/'
      })
    }
  ]

  execSteps(steps, history, done)
}
