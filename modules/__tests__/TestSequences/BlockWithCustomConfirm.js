import expect from 'expect'
import execSteps from './execSteps'

export default (history, done) => {
  const steps = [
    (location) => {
      expect(location).toMatch({
        pathname: '/'
      })

      let wasCurried = false
      const unblock = history.block(() => (callback) => {
        wasCurried = true
        callback(false)
      })

      history.push('/home')

      expect(wasCurried).toBe(true)
      expect(history.location).toMatch({
        pathname: '/'
      })

      unblock()
    }
  ]

  execSteps(steps, history, done)
}
