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
      expect(location.key).toBe(null)

      oldLocation = location

      history.push({
        ...location,
        search: '?the=query',
        state: { the: 'state' }
      })
    },
    (location) => {
      expect(location.pathname).toEqual(oldLocation.pathname)
      expect(location.search).toEqual('?the=query')
      expect(location.state).toEqual({ the: 'state' })
      expect(location.action).toEqual('PUSH')
      expect(location.key).toExist()
      expect(location.key).toNotEqual(oldLocation.key)
    }
  ]

  execSteps(steps, history, done)
}
