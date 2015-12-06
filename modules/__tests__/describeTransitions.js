import assert from 'assert'
import expect from 'expect'
import { PUSH } from '../Actions'
import execSteps from './execSteps'

function describeTransitions(createHistory) {
  describe('a synchronous transition hook', function () {
    let history, unlisten, unlistenBefore
    beforeEach(function () {
      history = createHistory()
    })

    afterEach(function () {
      if (unlistenBefore)
        unlistenBefore()

      if (unlisten)
        unlisten()
    })

    it('receives the next location', function (done) {
      let steps = [
        function () {
          history.push({
            pathname: '/home',
            search: '?the=query',
            state: { the: 'state' }
          })
        },
        function (location) {
          expect(nextLocation).toBe(location)
        }
      ]

      let nextLocation
      unlistenBefore = history.listenBefore(function (location) {
        nextLocation = location
      })

      unlisten = history.listen(execSteps(steps, done))
    })
  })

  describe('an asynchronous transition hook', function () {
    let history, unlisten, unlistenBefore
    beforeEach(function () {
      history = createHistory()
    })

    afterEach(function () {
      if (unlistenBefore)
        unlistenBefore()

      if (unlisten)
        unlisten()
    })

    it('receives the next location', function (done) {
      let steps = [
        function () {
          history.push({
            pathname: '/home',
            search: '?the=query',
            state: { the: 'state' }
          })
        },
        function (location) {
          expect(nextLocation).toBe(location)
        }
      ]

      let nextLocation
      unlistenBefore = history.listenBefore(function (location, callback) {
        nextLocation = location
        setTimeout(callback)
      })

      unlisten = history.listen(execSteps(steps, done))
    })
  })

  describe('when the user confirms a transition', function () {
    let confirmationMessage, location, history, unlisten, unlistenBefore
    beforeEach(function () {
      location = null
      confirmationMessage = 'Are you sure?'

      history = createHistory({
        getUserConfirmation(message, callback) {
          expect(message).toBe(confirmationMessage)
          callback(true)
        }
      })

      unlistenBefore = history.listenBefore(function () {
        return confirmationMessage
      })

      unlisten = history.listen(function (loc) {
        location = loc
      })
    })

    afterEach(function () {
      if (unlistenBefore)
        unlistenBefore()

      if (unlisten)
        unlisten()
    })

    it('updates the location', function () {
      let prevLocation = location
      history.push({
        pathname: '/home',
        search: '?the=query',
        state: { the: 'state' }
      })
      expect(prevLocation).toNotBe(location)

      assert(location)
      expect(location.pathname).toEqual('/home')
      expect(location.search).toEqual('?the=query')
      expect(location.state).toEqual({ the: 'state' })
      expect(location.action).toEqual(PUSH)
      assert(location.key)
    })
  })

  describe('when the user cancels a transition', function () {
    let confirmationMessage, location, history, unlisten, unlistenBefore
    beforeEach(function () {
      location = null
      confirmationMessage = 'Are you sure?'

      history = createHistory({
        getUserConfirmation(message, callback) {
          expect(message).toBe(confirmationMessage)
          callback(false)
        }
      })

      unlistenBefore = history.listenBefore(function () {
        return confirmationMessage
      })

      unlisten = history.listen(function (loc) {
        location = loc
      })
    })

    afterEach(function () {
      if (unlistenBefore)
        unlistenBefore()

      if (unlisten)
        unlisten()
    })

    it('does not update the location', function () {
      let prevLocation = location
      history.push('/home')
      expect(prevLocation).toBe(location)
    })
  })

  describe('when the transition hook cancels a transition', function () {
    let location, history, unlisten, unlistenBefore
    beforeEach(function () {
      location = null

      history = createHistory()

      unlistenBefore = history.listenBefore(function () {
        return false
      })

      unlisten = history.listen(function (loc) {
        location = loc
      })
    })

    afterEach(function () {
      if (unlistenBefore)
        unlistenBefore()

      if (unlisten)
        unlisten()
    })

    it('does not update the location', function () {
      let prevLocation = location
      history.push('/home')
      expect(prevLocation).toBe(location)
    })
  })
}

export default describeTransitions
