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
      expect(location.basename).toEqual('')

      history.push('/home')
    },
    (location) => {
      expect(location.pathname).toEqual('/home')
      expect(location.search).toEqual('')
      expect(location.state).toBe(undefined)
      expect(location.action).toEqual('PUSH')
      expect(location.key).toExist()
      expect(location.basename).toEqual('/base/url')
    }
  ]

  execSteps(steps, history, done)
}
