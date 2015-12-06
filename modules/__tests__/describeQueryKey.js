import expect from 'expect'
import { PUSH, POP } from '../Actions'
import execSteps from './execSteps'

function describeQueryKey(createHistory) {
  describe('when the user does not want to persist a state', function () {
    let history, unlisten
    beforeEach(function () {
      history = createHistory({ queryKey: false })
    })

    afterEach(function () {
      if (unlisten)
        unlisten()
    })

    it('forgets state across transitions', function (done) {
      const steps = [
        function (location) {
          expect(location.pathname).toEqual('/')
          expect(location.search).toEqual('')
          expect(location.state).toEqual(null)
          expect(location.action).toEqual(POP)

          history.push('/home?the=query')
        },
        function (location) {
          expect(location.pathname).toEqual('/home')
          expect(location.search).toEqual('?the=query')
          expect(location.state).toEqual(null)
          expect(location.action).toEqual(PUSH)

          history.goBack()
        },
        function (location) {
          expect(location.pathname).toEqual('/')
          expect(location.search).toEqual('')
          expect(location.state).toEqual(null)
          expect(location.action).toEqual(POP)

          history.goForward()
        },
        function (location) {
          expect(location.pathname).toEqual('/home')
          expect(location.search).toEqual('?the=query')
          expect(location.state).toEqual(null) // State is missing.
          expect(location.action).toEqual(POP)
        }
      ]

      unlisten = history.listen(execSteps(steps, done))
    })
  })

  describe('when the user wants to persist state', function () {
    let history, unlisten
    beforeEach(function () {
      history = createHistory({ queryKey: 'a' })
    })

    afterEach(function () {
      if (unlisten)
        unlisten()
    })

    it('remembers state across transitions', function (done) {
      const steps = [
        function (location) {
          expect(location.pathname).toEqual('/')
          expect(location.search).toEqual('')
          expect(location.state).toEqual(null)
          expect(location.action).toEqual(POP)

          history.push({
            pathname: '/home',
            search: '?the=query',
            state: { the: 'state' }
          })
        },
        function (location) {
          expect(location.pathname).toEqual('/home')
          expect(location.search).toEqual('?the=query')
          expect(location.state).toEqual({ the: 'state' })
          expect(location.action).toEqual(PUSH)

          history.goBack()
        },
        function (location) {
          expect(location.pathname).toEqual('/')
          expect(location.search).toEqual('')
          expect(location.state).toEqual(null)
          expect(location.action).toEqual(POP)

          history.goForward()
        },
        function (location) {
          expect(location.pathname).toEqual('/home')
          expect(location.search).toEqual('?the=query')
          expect(location.state).toEqual({ the: 'state' }) // State is present.
          expect(location.action).toEqual(POP)
        }
      ]

      unlisten = history.listen(execSteps(steps, done))
    })
  })
}

export default describeQueryKey
