import expect from 'expect'
import { POP } from '../Actions'
import createMemoryHistory from '../createMemoryHistory'

function describeInitialLocation(createHistory) {
  describe('location has key on initial pop', function () {
    let unlisten, history
    beforeEach(function () {
      history = createHistory()
    })

    afterEach(function () {
      if (unlisten)
        unlisten()
    })

    it('replaces state if location key is missing', function (done) {
      unlisten = history.listen(function (location) {
        try {
          expect(location.action).toEqual(POP)
          expect(location.key).toNotEqual(null)
          expect(location.state).toEqual(null)
          done()
        } catch (error) {
          done(error)
        }
      })
    })

    it('emits POP with current location key', function (done) {
      // set initial state, this is needed because all implementations gets state from different places
      history.push({
        pathname: '/',
        state: { initial: 'state' }
      })

      // now create history for testing if initial POP event has location.key
      history = createHistory()

      unlisten = history.listen(function (location) {
        try {
          expect(location.action).toEqual(POP)
          expect(location.key).toNotEqual(null)

          if (createHistory === createMemoryHistory) {
            // MemoryHistory does not share state storage between
            // instances, so we can't expect the state to be there.
            expect(location.state).toEqual(null)
          } else {
            expect(location.state).toEqual({ initial: 'state' })
          }

          done()
        } catch (error) {
          done(error)
        }
      })
    })
  })
}

export default describeInitialLocation
