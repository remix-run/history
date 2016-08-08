import expect from 'expect'
import { PUSH, POP, REPLACE } from '../Actions'
import execSteps from './execSteps'

const describePush = (createHistory) => {
  describe('push', () => {
    let history
    beforeEach(() => {
      history = createHistory()
    })

    describe('with a path string', () => {
      it('calls change listeners with the new location', (done) => {
        const steps = [
          (location) => {
            expect(location.pathname).toEqual('/')
            expect(location.search).toEqual('')
            expect(location.state).toBe(undefined)
            expect(location.action).toEqual(POP)
            expect(location.key).toBe(null)

            history.push('/home?the=query')
          },
          (location) => {
            expect(location.pathname).toEqual('/home')
            expect(location.search).toEqual('?the=query')
            expect(location.state).toBe(undefined)
            expect(location.action).toEqual(PUSH)
            expect(location.key).toExist()
          }
        ]

        execSteps(steps, history, done)
      })

      it('should trigger only once when path is changed', (done) => {
        const spy = expect.createSpy()
        const unlisten = history.listen(spy)
        history.push('/test')
        setTimeout(() => {
          expect(spy.calls.length).toBe(1)
          unlisten()
          done()
        }, 10)
      })
    })

    describe('with a path object', () => {
      it('calls change listeners with the new location', (done) => {
        const steps = [
          (location) => {
            expect(location.pathname).toEqual('/')
            expect(location.search).toEqual('')
            expect(location.state).toBe(undefined)
            expect(location.action).toEqual(POP)
            expect(location.key).toBe(null)

            history.push({
              pathname: '/home',
              search: '?the=query',
              state: { the: 'state' }
            })
          },
          (location) => {
            expect(location.pathname).toEqual('/home')
            expect(location.search).toEqual('?the=query')
            expect(location.state).toEqual({ the: 'state' })
            expect(location.action).toEqual(PUSH)
            expect(location.key).toExist()
          }
        ]

        execSteps(steps, history, done)
      })

      it('correctly merges with old location', (done) => {
        let oldLocation

        const steps = [
          (location) => {
            expect(location.pathname).toEqual('/')
            expect(location.search).toEqual('')
            expect(location.state).toBe(undefined)
            expect(location.action).toEqual(POP)
            expect(location.key).toBe(null)

            oldLocation = location

            history.push({
              ...location,
              search: '?the=query',
              state: { the: 'state' }
            })
          },
          (location) => {
            expect(location.pathname).toEqual(oldLocation.pathname)
            expect(location.search).toEqual('?the=query')
            expect(location.state).toEqual({ the: 'state' })
            expect(location.action).toEqual(PUSH)
            expect(location.key).toExist()
            expect(location.key).toNotEqual(oldLocation.key)
          }
        ]

        execSteps(steps, history, done)
      })

      it('becomes a REPLACE if path is unchanged', (done) => {
        const steps = [
          (location) => {
            expect(location.pathname).toEqual('/')
            expect(location.search).toEqual('')
            expect(location.state).toBe(undefined)
            expect(location.action).toEqual(POP)
            expect(location.key).toBe(null)

            history.push({
              pathname: '/home',
              search: '?the=query',
              state: { the: 'state' }
            })
          },
          (location) => {
            expect(location.pathname).toEqual('/home')
            expect(location.search).toEqual('?the=query')
            expect(location.state).toEqual({ the: 'state' })
            expect(location.action).toEqual(PUSH)
            expect(location.key).toExist()

            history.push({
              pathname: '/home',
              search: '?the=query',
              state: { the: 'state' }
            })
          },
          (location) => {
            expect(location.pathname).toEqual('/home')
            expect(location.search).toEqual('?the=query')
            expect(location.state).toEqual({ the: 'state' })
            expect(location.action).toEqual(REPLACE)
            expect(location.key).toExist()
          }
        ]

        execSteps(steps, history, done)
      })

      it('stays PUSH if state is changed', (done) => {
        const steps = [
          (location) => {
            expect(location.pathname).toEqual('/')
            expect(location.search).toEqual('')
            expect(location.state).toBe(undefined)
            expect(location.action).toEqual(POP)
            expect(location.key).toBe(null)

            history.push({
              pathname: '/home',
              search: '?the=query',
              state: { the: 'state' }
            })
          },
          (location) => {
            expect(location.pathname).toEqual('/home')
            expect(location.search).toEqual('?the=query')
            expect(location.state).toEqual({ the: 'state' })
            expect(location.action).toEqual(PUSH)
            expect(location.key).toExist()

            history.push({
              pathname: '/home',
              search: '?the=query',
              state: { different: 'state' }
            })
          },
          (location) => {
            expect(location.pathname).toEqual('/home')
            expect(location.search).toEqual('?the=query')
            expect(location.state).toEqual({ different: 'state' })
            expect(location.action).toEqual(PUSH)
            expect(location.key).toExist()
          }
        ]

        execSteps(steps, history, done)
      })
    })
  })
}

export default describePush
