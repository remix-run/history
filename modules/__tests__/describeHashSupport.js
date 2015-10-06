/*eslint-env mocha */
import expect from 'expect'
import { PUSH, POP } from '../Actions'
import execSteps from './execSteps'

function describeHashSupport(createHistory) {
  describe('when a URL with a hash is pushed', function () {
    let history, unlisten
    beforeEach(function () {
      history = createHistory()
    })

    afterEach(function () {
      if (unlisten)
        unlisten()
    })

    it('preserves the hash', function (done) {
      const steps = [
        function (location) {
          expect(location.pathname).toEqual('/')
          expect(location.search).toEqual('')
          expect(location.hash).toEqual('')
          expect(location.state).toEqual(null)
          expect(location.action).toEqual(POP)

          history.pushState({ the: 'state' }, '/home?the=query#the-hash')
        },
        function (location) {
          expect(location.pathname).toEqual('/home')
          expect(location.search).toEqual('?the=query')
          expect(location.hash).toEqual('#the-hash')
          expect(location.state).toEqual({ the: 'state' })
          expect(location.action).toEqual(PUSH)
        }
      ]

      unlisten = history.listen(execSteps(steps, done))
    })
  })
}

export default describeHashSupport
