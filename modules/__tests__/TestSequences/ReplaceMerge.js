import expect from 'expect'
import execSteps from './execSteps'

export default (history, done) => {
  let oldLocation

  const steps = [
    (location) => {
      expect(location.pathname).toEqual('/')
      expect(location.search).toEqual('')
      expect(location.state).toBe(undefined)
      expect(location.action).toEqual('POP')

      oldLocation = location

      history.replace({
        ...location,
        search: '?the=query',
        state: { the: 'state' }
      })
    },
    (location) => {
      expect(location.pathname).toEqual(oldLocation.pathname)
      expect(location.search).toEqual('?the=query')
      expect(location.state).toEqual({ the: 'state' })
      expect(location.action).toEqual('REPLACE')
      expect(location.key).toNotEqual(oldLocation.key)
    }
  ]

  execSteps(steps, history, done)
}
