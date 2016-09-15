import expect from 'expect'
import execSteps from './execSteps'

export default (history, done) => {
  const steps = [
    (location) => {
      expect(location).toMatch({
        pathname: '/'
      })

      history.push({
        pathname: null,
        search: 'the=query',
        hash: 'the-hash'
      })
    },
    (location, action) => {
      expect(action).toBe('PUSH')
      expect(location).toMatch({
        pathname: '/',
        search: '?the=query',
        hash: '#the-hash'
      })
    }
  ]

  execSteps(steps, history, done)
}
