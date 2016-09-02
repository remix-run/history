import expect from 'expect'
import execSteps from './execSteps'

export default (history, done) => {
  let nextLocation
  const steps = [
    () => {
      history.push({
        pathname: '/home',
        search: '?the=query',
        state: { the: 'state' }
      })
    },
    (location) => {
      expect(nextLocation).toBe(location)
    }
  ]

  const unlistenBefore = history.listenBefore(location => {
    nextLocation = location
  })

  execSteps(steps, history, (...args) => {
    unlistenBefore()
    done(...args)
  })
}
