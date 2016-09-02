import expect from 'expect'
import execSteps from './execSteps'

export default (history, done) => {
  let initialLocation
  const steps = [
    (location) => {
      initialLocation = location
      history.push('/home')
    },
    (location) => {
      expect(initialLocation).toMatch(location)
    }
  ]

  const unlistenBefore = history.listenBefore(() => 'Are you sure?')

  execSteps(steps, history, (...args) => {
    unlistenBefore()
    done(...args)
  })
}
