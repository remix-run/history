/*eslint-env mocha */
import expect from 'expect'
import { PUSH, REPLACE, POP } from '../Actions'
import useBasename from '../useBasename'
import execSteps from './execSteps'

function stripHash(path) {
  return path.replace(/^#/, '')
}

function describeBasename(createHistory) {
  describe('basename handling', function () {
    let history, unlisten
    beforeEach(function () {
      history = useBasename(createHistory)({
        basename: '/base/url'
      })
    })

    afterEach(function () {
      if (unlisten)
        unlisten()
    })

    describe('in push', function () {
      it('works', function (done) {
        let steps = [
          function (location) {
            expect(location.pathname).toEqual('/')
            expect(location.search).toEqual('')
            expect(location.state).toEqual(null)
            expect(location.action).toEqual(POP)

            history.push('/home', { the: 'state' })
          },
          function (location) {
            expect(location.pathname).toEqual('/home')
            expect(location.search).toEqual('')
            expect(location.state).toEqual({ the: 'state' })
            expect(location.action).toEqual(PUSH)
          }
        ]

        unlisten = history.listen(execSteps(steps, done))
      })
    })

    describe('in pushState', function () {
      it('works', function (done) {
        let steps = [
          function (location) {
            expect(location.pathname).toEqual('/')
            expect(location.search).toEqual('')
            expect(location.state).toEqual(null)
            expect(location.action).toEqual(POP)

            history.pushState({ the: 'state' }, '/home')
          },
          function (location) {
            expect(location.pathname).toEqual('/home')
            expect(location.search).toEqual('')
            expect(location.state).toEqual({ the: 'state' })
            expect(location.action).toEqual(PUSH)
          }
        ]

        unlisten = history.listen(execSteps(steps, done))
      })
    })

    describe('in replaceState', function () {
      it('works', function (done) {
        let steps = [
          function (location) {
            expect(location.pathname).toEqual('/')
            expect(location.search).toEqual('')
            expect(location.state).toEqual(null)
            expect(location.action).toEqual(POP)

            history.replaceState({ the: 'state' }, '/home')
          },
          function (location) {
            expect(location.pathname).toEqual('/home')
            expect(location.search).toEqual('')
            expect(location.state).toEqual({ the: 'state' })
            expect(location.action).toEqual(REPLACE)
          }
        ]

        unlisten = history.listen(execSteps(steps, done))
      })
    })

    describe('in replace', function () {
      it('works', function (done) {
        let steps = [
          function (location) {
            expect(location.pathname).toEqual('/')
            expect(location.search).toEqual('')
            expect(location.state).toEqual(null)
            expect(location.action).toEqual(POP)

            history.replace('/home', { the: 'state' })
          },
          function (location) {
            expect(location.pathname).toEqual('/home')
            expect(location.search).toEqual('')
            expect(location.state).toEqual({ the: 'state' })
            expect(location.action).toEqual(REPLACE)
          }
        ]

        unlisten = history.listen(execSteps(steps, done))
      })
    })

    describe('in createPath', function () {
      it('works', function () {
        expect(
          history.createPath('/the/path')
        ).toEqual('/base/url/the/path')
      })
    })

    describe('in createHref', function () {
      it('works', function () {
        expect(
          stripHash(history.createHref('/the/path'))
        ).toEqual('/base/url/the/path')
      })
    })
  })
}

export default describeBasename
