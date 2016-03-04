import expect from 'expect'
import { POP } from '../Actions'
import createMemoryHistory from '../createMemoryHistory'

const describeInitialLocation = (createHistory) => {
  describe('location has key on initial pop', () => {
    let unlisten, history
    beforeEach(() => {
      history = createHistory()
    })

    afterEach(() => {
      if (unlisten)
        unlisten()
    })

    it('replaces state if location key is missing', (done) => {
      unlisten = history.listen((location) => {
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

    it('emits POP with current location key', (done) => {
      // set initial state, this is needed because all implementations gets state from different places
      history.push({
        pathname: '/',
        state: { initial: 'state' }
      })

      // now create history for testing if initial POP event has location.key
      history = createHistory()

      unlisten = history.listen((location) => {
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
