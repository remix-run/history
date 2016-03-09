import expect from 'expect'
import { PUSH, POP } from '../Actions'
import execSteps from './execSteps'

const describeGo = (createHistory) => {
  describe('go', () => {
    let history, unlisten
    beforeEach((done) => {
      history = createHistory()

      // Give browsers a little time to recognize the hashchange
      setTimeout(done, 100)
    })

    afterEach(() => {
      if (unlisten)
        unlisten()
    })

    describe('back', () => {
      it('calls change listeners with the previous location', (done) => {
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

            history.goBack()
          },
          (location) => {
            expect(location.pathname).toEqual('/')
            expect(location.search).toEqual('')
            expect(location.state).toBe(undefined)
            expect(location.action).toEqual(POP)
            expect(location.key).toBe(null)
          }
        ]

        unlisten = history.listen(execSteps(steps, done))
      })
    })

    describe('forward', () => {
      it('calls change listeners with the next location', (done) => {
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

            history.goBack()
          },
          (location) => {
            expect(location.pathname).toEqual('/')
            expect(location.search).toEqual('')
            expect(location.state).toBe(undefined)
            expect(location.action).toEqual(POP)
            expect(location.key).toBe(null)

            history.goForward()
          },
          (location) => {
            expect(location.pathname).toEqual('/home')
            expect(location.search).toEqual('?the=query')
            expect(location.state).toEqual({ the: 'state' })
            expect(location.action).toEqual(POP)
            expect(location.key).toExist()
          }
        ]

        unlisten = history.listen(execSteps(steps, done))
      })
    })
  })
}

export default describeGo
