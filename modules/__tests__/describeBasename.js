import expect from 'expect'
import { PUSH, REPLACE, POP } from '../Actions'
import useBasename from '../useBasename'
import withBasename from '../withBasename'
import execSteps from './execSteps'
import shouldWarn from './shouldWarn'

const stripHash = (path) =>
  path.replace(/^#/, '')

const describeBasename = (createHistory) => {
  describe('basename handling', () => {
    let history
    beforeEach(() => {
      history = withBasename(createHistory(), '/base/url')
    })

    describe('in push', () => {
      it('works with string', (done) => {
        const steps = [
          (location) => {
            expect(location.pathname).toEqual('/')
            expect(location.search).toEqual('')
            expect(location.state).toBe(undefined)
            expect(location.action).toEqual(POP)
            expect(location.key).toBe(null)
            expect(location.basename).toEqual('')

            history.push('/home')
          },
          (location) => {
            expect(location.pathname).toEqual('/home')
            expect(location.search).toEqual('')
            expect(location.state).toBe(undefined)
            expect(location.action).toEqual(PUSH)
            expect(location.key).toExist()
            expect(location.basename).toEqual('/base/url')
          }
        ]

        execSteps(steps, history, done)
      })

      it('works with object', (done) => {
        const steps = [
          (location) => {
            expect(location.pathname).toEqual('/')
            expect(location.search).toEqual('')
            expect(location.state).toBe(undefined)
            expect(location.action).toEqual(POP)
            expect(location.key).toBe(null)
            expect(location.basename).toEqual('')

            history.push({
              pathname: '/home',
              state: { the: 'state' }
            })
          },
          (location) => {
            expect(location.pathname).toEqual('/home')
            expect(location.search).toEqual('')
            expect(location.state).toEqual({ the: 'state' })
            expect(location.action).toEqual(PUSH)
            expect(location.key).toExist()
            expect(location.basename).toEqual('/base/url')

            history.push({
              ...location,
              pathname: '/foo'
            })
          },
          (location) => {
            expect(location.pathname).toEqual('/foo')
            expect(location.search).toEqual('')
            expect(location.state).toEqual({ the: 'state' })
            expect(location.action).toEqual(PUSH)
            expect(location.key).toExist()
            expect(location.basename).toEqual('/base/url')
          }
        ]

        execSteps(steps, history, done)
      })
    })

    describe('in replace', () => {
      it('works with string', (done) => {
        const steps = [
          (location) => {
            expect(location.pathname).toEqual('/')
            expect(location.search).toEqual('')
            expect(location.state).toBe(undefined)
            expect(location.action).toEqual(POP)
            expect(location.key).toBe(null)
            expect(location.basename).toEqual('')

            history.replace('/home')
          },
          (location) => {
            expect(location.pathname).toEqual('/home')
            expect(location.search).toEqual('')
            expect(location.state).toBe(undefined)
            expect(location.action).toEqual(REPLACE)
            expect(location.key).toExist()
            expect(location.basename).toEqual('/base/url')
          }
        ]

        execSteps(steps, history, done)
      })

      it('works with object', (done) => {
        const steps = [
          (location) => {
            expect(location.pathname).toEqual('/')
            expect(location.search).toEqual('')
            expect(location.state).toBe(undefined)
            expect(location.action).toEqual(POP)
            expect(location.key).toBe(null)
            expect(location.basename).toEqual('')

            history.replace({
              pathname: '/home',
              state: { the: 'state' }
            })
          },
          (location) => {
            expect(location.pathname).toEqual('/home')
            expect(location.search).toEqual('')
            expect(location.state).toEqual({ the: 'state' })
            expect(location.action).toEqual(REPLACE)
            expect(location.key).toExist()
            expect(location.basename).toEqual('/base/url')

            history.replace({
              ...location,
              pathname: '/foo'
            })
          },
          (location) => {
            expect(location.pathname).toEqual('/foo')
            expect(location.search).toEqual('')
            expect(location.state).toEqual({ the: 'state' })
            expect(location.action).toEqual(REPLACE)
            expect(location.key).toExist()
            expect(location.basename).toEqual('/base/url')
          }
        ]

        execSteps(steps, history, done)
      })
    })

    describe('in createPath', () => {
      it('works', () => {
        expect(
          history.createPath('/the/path')
        ).toEqual('/base/url/the/path')
      })
    })

    describe('in createHref', () => {
      it('works', () => {
        expect(
          stripHash(history.createHref('/the/path'))
        ).toEqual('/base/url/the/path')
      })
    })

    describe('in createLocation', () => {
      it('works with string', () => {
        const location = history.createLocation('/the/path')

        expect(location.pathname).toEqual('/the/path')
        expect(location.basename).toEqual('/base/url')
      })

      it('works with object without query', () => {
        const location = history.createLocation({
          pathname: '/the/path'
        })

        expect(location.pathname).toEqual('/the/path')
        expect(location.basename).toEqual('/base/url')
      })
    })
  })

  describe('useBasename', () => {
    describe('basename handling', () => {
      it('works', (done) => {
        shouldWarn('deprecated')

        const history = useBasename(createHistory)({ basename: '/base/url' })

        const steps = [
          (location) => {
            expect(location.pathname).toEqual('/')
            expect(location.search).toEqual('')
            expect(location.state).toBe(undefined)
            expect(location.action).toEqual(POP)
            expect(location.key).toBe(null)
            expect(location.basename).toEqual('')

            history.push('/home')
          },
          (location) => {
            expect(location.pathname).toEqual('/home')
            expect(location.search).toEqual('')
            expect(location.state).toBe(undefined)
            expect(location.action).toEqual(PUSH)
            expect(location.key).toExist()
            expect(location.basename).toEqual('/base/url')
          }
        ]

        execSteps(steps, history, done)
      })
    })
  })
}

export default describeBasename
