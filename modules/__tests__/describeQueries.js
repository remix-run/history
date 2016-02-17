import expect from 'expect'
import { PUSH, REPLACE, POP } from '../Actions'
import useQueries from '../useQueries'
import execSteps from './execSteps'

function stripHash(path) {
  return path.replace(/^#/, '')
}

function describeQueries(createHistory) {
  describe('default query serialization', function () {
    let history, unlisten
    beforeEach(function () {
      history = useQueries(createHistory)()
    })

    afterEach(function () {
      if (unlisten)
        unlisten()
    })

    describe('in push', function () {
      it('works', function (done) {
        const steps = [
          function (location) {
            expect(location.pathname).toEqual('/')
            expect(location.search).toEqual('')
            expect(location.query).toEqual({})
            expect(location.state).toEqual(null)
            expect(location.action).toEqual(POP)

            history.push({
              pathname: '/home',
              query: { the: 'query value' },
              state: { the: 'state' }
            })
          },
          function (location) {
            expect(location.pathname).toEqual('/home')
            expect(location.search).toEqual('?the=query+value')
            expect(location.query).toEqual({ the: 'query value' })
            expect(location.state).toEqual({ the: 'state' })
            expect(location.action).toEqual(PUSH)

            history.push({
              ...location,
              query: { other: 'query value' },
              state: { other: 'state' }
            })
          },
          function (location) {
            expect(location.pathname).toEqual('/home')
            expect(location.search).toEqual('?other=query+value')
            expect(location.query).toEqual({ other: 'query value' })
            expect(location.state).toEqual({ other: 'state' })
            expect(location.action).toEqual(PUSH)

            history.push({
              ...location,
              query: {},
              state: null
            })
          },
          function (location) {
            expect(location.pathname).toEqual('/home')
            expect(location.search).toEqual('')
            expect(location.query).toEqual({})
            expect(location.state).toEqual(null)
            expect(location.action).toEqual(PUSH)
          }
        ]

        unlisten = history.listen(execSteps(steps, done))
      })
    })

    describe('in replace', function () {
      it('works', function (done) {
        const steps = [
          function (location) {
            expect(location.pathname).toEqual('/')
            expect(location.search).toEqual('')
            expect(location.query).toEqual({})
            expect(location.state).toEqual(null)
            expect(location.action).toEqual(POP)

            history.replace({
              pathname: '/home',
              query: { the: 'query value' },
              state: { the: 'state' }
            })
          },
          function (location) {
            expect(location.pathname).toEqual('/home')
            expect(location.search).toEqual('?the=query+value')
            expect(location.query).toEqual({ the: 'query value' })
            expect(location.state).toEqual({ the: 'state' })
            expect(location.action).toEqual(REPLACE)

            history.replace({
              ...location,
              query: { other: 'query value' },
              state: { other: 'state' }
            })
          },
          function (location) {
            expect(location.pathname).toEqual('/home')
            expect(location.search).toEqual('?other=query+value')
            expect(location.query).toEqual({ other: 'query value' })
            expect(location.state).toEqual({ other: 'state' })
            expect(location.action).toEqual(REPLACE)
          }
        ]

        unlisten = history.listen(execSteps(steps, done))
      })
    })

    describe('in createPath', function () {
      it('works', function () {
        expect(
          history.createPath({
            pathname: '/the/path',
            query: { the: 'query value' }
          })
        ).toEqual('/the/path?the=query+value')
      })

      it('does not strip trailing slash', function () {
        expect(
          history.createPath({
            pathname: '/the/path/',
            query: { the: 'query value' }
          })
        ).toEqual('/the/path/?the=query+value')
      })

      describe('when the path contains a hash', function () {
        it('puts the query before the hash', function () {
          expect(
            history.createPath({
              pathname: '/the/path',
              hash: '#the-hash',
              query: { the: 'query value' }
            })
          ).toEqual('/the/path?the=query+value#the-hash')
        })
      })

      describe('when there is already an existing search', function () {
        it('overwrites the existing search', function () {
          expect(
            history.createPath({
              pathname: '/the/path',
              search: '?a=one',
              query: { the: 'query value' }
            })
          ).toEqual('/the/path?the=query+value')
        })
      })

      describe('in createLocation', function () {
        it('works with string', function () {
          const location = history.createLocation('/the/path?the=query')

          expect(location.pathname).toEqual('/the/path')
          expect(location.query).toEqual({ the: 'query' })
          expect(location.search).toEqual('?the=query')
        })

        it('works with object with query', function () {
          const location = history.createLocation({
            pathname: '/the/path',
            query: { the: 'query' }
          })

          expect(location.pathname).toEqual('/the/path')
          expect(location.query).toEqual({ the: 'query' })
          expect(location.search).toEqual('?the=query')
        })

        it('works with object without query', function () {
          const location = history.createLocation({
            pathname: '/the/path'
          })

          expect(location.pathname).toEqual('/the/path')
          expect(location.query).toEqual({})
          expect(location.search).toEqual('')
        })

        it('works with explicit undefined values in query', function () {
          const location = history.createLocation({
            pathname: '/the/path',
            query: { the: undefined }
          })

          expect(location.pathname).toEqual('/the/path')
          expect(location.query).toEqual({ the: undefined })
          expect(location.search).toEqual('')
        })
      })
    })

    describe('in createHref', function () {
      it('works', function () {
        expect(
          stripHash(history.createHref({
            pathname: '/the/path',
            query: { the: 'query value' }
          }))
        ).toEqual('/the/path?the=query+value')
      })
    })
  })

  describe('custom query serialization', function () {
    let history, unlisten
    beforeEach(function () {
      history = useQueries(createHistory)({
        parseQueryString() {
          return 'PARSE_QUERY_STRING'
        },
        stringifyQuery() {
          return 'STRINGIFY_QUERY'
        }
      })
    })

    afterEach(function () {
      if (unlisten)
        unlisten()
    })

    describe('in push', function () {
      it('works', function (done) {
        const steps = [
          function (location) {
            expect(location.pathname).toEqual('/')
            expect(location.search).toEqual('')
            expect(location.query).toEqual('PARSE_QUERY_STRING')
            expect(location.state).toEqual(null)
            expect(location.action).toEqual(POP)

            history.push({
              pathname: '/home',
              query: { the: 'query' },
              state: { the: 'state' }
            })
          },
          function (location) {
            expect(location.pathname).toEqual('/home')
            expect(location.search).toEqual('?STRINGIFY_QUERY')
            expect(location.query).toEqual('PARSE_QUERY_STRING')
            expect(location.state).toEqual({ the: 'state' })
            expect(location.action).toEqual(PUSH)
          }
        ]

        unlisten = history.listen(execSteps(steps, done))
      })
    })

    describe('in replace', function () {
      it('works', function (done) {
        const steps = [
          function (location) {
            expect(location.pathname).toEqual('/')
            expect(location.search).toEqual('')
            expect(location.query).toEqual('PARSE_QUERY_STRING')
            expect(location.state).toEqual(null)
            expect(location.action).toEqual(POP)

            history.replace({
              pathname: '/home',
              query: { the: 'query' },
              state: { the: 'state' }
            })
          },
          function (location) {
            expect(location.pathname).toEqual('/home')
            expect(location.search).toEqual('?STRINGIFY_QUERY')
            expect(location.query).toEqual('PARSE_QUERY_STRING')
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
          history.createPath({
            pathname: '/the/path',
            query: { the: 'query' }
          })
        ).toEqual('/the/path?STRINGIFY_QUERY')
      })

      it('does not strip trailing slash', function () {
        expect(
          history.createPath({
            pathname: '/the/path/',
            query: { the: 'query' }
          })
        ).toEqual('/the/path/?STRINGIFY_QUERY')
      })

      describe('when the path contains a hash', function () {
        it('puts the query before the hash', function () {
          expect(
            history.createPath({
              pathname: '/the/path',
              hash: '#the-hash',
              query: { the: 'query' }
            })
          ).toEqual('/the/path?STRINGIFY_QUERY#the-hash')
        })
      })

      describe('when there is already an existing search', function () {
        it('overwrites the existing search', function () {
          expect(
            history.createPath({
              pathname: '/the/path',
              search: '?a=one',
              query: { the: 'query' }
            })
          ).toEqual('/the/path?STRINGIFY_QUERY')
        })
      })
    })

    describe('in createHref', function () {
      it('works', function () {
        expect(
          stripHash(history.createHref({
            pathname: '/the/path',
            query: { the: 'query' }
          }))
        ).toEqual('/the/path?STRINGIFY_QUERY')
      })
    })
  })
}

export default describeQueries
