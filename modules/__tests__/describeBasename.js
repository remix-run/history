import expect from 'expect'
import { PUSH, REPLACE, POP } from '../Actions'
import useBasename from '../useBasename'
import execSteps from './execSteps'

const stripHash = (path) =>
  path.replace(/^#/, '')

const describeBasename = (createHistory) => {
  describe('basename handling', () => {
    let history, unlisten
    beforeEach(() => {
      history = useBasename(createHistory)({
        basename: '/base/url'
      })
    })

    afterEach(() => {
      if (unlisten)
        unlisten()
    })

    describe('in push', () => {
      it('works with string', (done) => {
        const steps = [
          (location) => {
            expect(location.pathname).toEqual('/')
            expect(location.search).toEqual('')
            expect(location.state).toEqual(null)
            expect(location.action).toEqual(POP)
            expect(location.basename).toEqual('')

            history.push('/home')
          },
          (location) => {
            expect(location.pathname).toEqual('/home')
            expect(location.search).toEqual('')
            expect(location.state).toEqual(null)
            expect(location.action).toEqual(PUSH)
            expect(location.basename).toEqual('/base/url')
          }
        ]

        unlisten = history.listen(execSteps(steps, done))
      })

      it('works with object', (done) => {
        const steps = [
          (location) => {
            expect(location.pathname).toEqual('/')
            expect(location.search).toEqual('')
            expect(location.state).toEqual(null)
            expect(location.action).toEqual(POP)
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
            expect(location.basename).toEqual('/base/url')
          }
        ]

        unlisten = history.listen(execSteps(steps, done))
      })
    })

    describe('in replace', () => {
      it('works with string', (done) => {
        const steps = [
          (location) => {
            expect(location.pathname).toEqual('/')
            expect(location.search).toEqual('')
            expect(location.state).toEqual(null)
            expect(location.action).toEqual(POP)
            expect(location.basename).toEqual('')

            history.replace('/home')
          },
          (location) => {
            expect(location.pathname).toEqual('/home')
            expect(location.search).toEqual('')
            expect(location.state).toEqual(null)
            expect(location.action).toEqual(REPLACE)
            expect(location.basename).toEqual('/base/url')
          }
        ]

        unlisten = history.listen(execSteps(steps, done))
      })

      it('works with object', (done) => {
        const steps = [
          (location) => {
            expect(location.pathname).toEqual('/')
            expect(location.search).toEqual('')
            expect(location.state).toEqual(null)
            expect(location.action).toEqual(POP)
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
            expect(location.basename).toEqual('/base/url')
          }
        ]

        unlisten = history.listen(execSteps(steps, done))
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

  describe('basename through <base href>', () => {
    let history, unlisten, base

    before('add base element', () => {
      base = document.createElement('base')
      base.href = '/base/url'
      document.head.appendChild(base)
    })

    beforeEach(() => {
      history = useBasename(createHistory)()
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

    describe('in push', () => {
      it('works', (done) => {
        const steps = [
          (location) => {
            expect(location.pathname).toEqual('/')
            expect(location.search).toEqual('')
            expect(location.state).toEqual(null)
            expect(location.action).toEqual(POP)
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
            expect(location.basename).toEqual('/base/url')
          }
        ]

        unlisten = history.listen(execSteps(steps, done))
      })
    })

    afterEach(() => {
      if (unlisten)
        unlisten()
    })

    after(() => {
      document.head.removeChild(base)
    })
  })
}

export default describeBasename
