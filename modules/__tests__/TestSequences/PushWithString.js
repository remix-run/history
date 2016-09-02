import expect from 'expect'
import execSteps from './execSteps'

export default (history, done) => {
  const steps = [
    (location) => {
      expect(location.pathname).toEqual('/')
      expect(location.search).toEqual('')
      expect(location.state).toBe(undefined)
      expect(location.action).toEqual('POP')
      expect(location.key).toBe(null)

      history.push('/home?the=query')
    },
    (location) => {
      expect(location.pathname).toEqual('/home')
      expect(location.search).toEqual('?the=query')
      expect(location.state).toBe(undefined)
      expect(location.action).toEqual('PUSH')
      expect(location.key).toExist()
    }
  ]

  execSteps(steps, history, done)
}
