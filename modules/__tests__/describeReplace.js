import expect from 'expect'
import { REPLACE, POP } from '../Actions'
import execSteps from './execSteps'

function describeReplace(createHistory) {
  describe('replace', function () {
    let history, unlisten
    beforeEach(function () {
      history = createHistory()
    })

    afterEach(function () {
      if (unlisten)
        unlisten()
    })

    describe('with a path string', function () {
      it('calls change listeners with the new location', function (done) {
        const steps = [
          function (location) {
            expect(location.pathname).toEqual('/')
            expect(location.search).toEqual('')
            expect(location.state).toEqual(null)
            expect(location.action).toEqual(POP)

            history.replace('/home?the=query')
          },
          function (location) {
            expect(location.pathname).toEqual('/home')
            expect(location.search).toEqual('?the=query')
            expect(location.state).toEqual(null)
            expect(location.action).toEqual(REPLACE)
          }
        ]

        unlisten = history.listen(execSteps(steps, done))
      })
    })

    describe('with a path object', function () {
      it('calls change listeners with the new location', function (done) {
        const steps = [
          function (location) {
            expect(location.pathname).toEqual('/')
            expect(location.search).toEqual('')
            expect(location.state).toEqual(null)
            expect(location.action).toEqual(POP)

            history.replace({
              pathname: '/home',
              search: '?the=query',
              state: { the: 'state' }
            })
          },
          function (location) {
            expect(location.pathname).toEqual('/home')
            expect(location.search).toEqual('?the=query')
            expect(location.state).toEqual({ the: 'state' })
            expect(location.action).toEqual(REPLACE)
          }
        ]

        unlisten = history.listen(execSteps(steps, done))
      })

      it('correctly merges with old location', function (done) {
        let oldLocation

        const steps = [
          function (location) {
            expect(location.pathname).toEqual('/')
            expect(location.search).toEqual('')
            expect(location.state).toEqual(null)
            expect(location.action).toEqual(POP)

            oldLocation = location

            history.replace({
              ...location,
              search: '?the=query',
              state: { the: 'state' }
            })
          },
          function (location) {
            expect(location.pathname).toEqual(oldLocation.pathname)
            expect(location.search).toEqual('?the=query')
            expect(location.state).toEqual({ the: 'state' })
            expect(location.action).toEqual(REPLACE)
            expect(location.key).toNotEqual(oldLocation.key)
          }
        ]

        unlisten = history.listen(execSteps(steps, done))
      })
    })
  })
}

export default describeReplace
