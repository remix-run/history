import expect from 'expect'
import { PUSH, POP } from '../Actions'
import execSteps from './execSteps'

const describeQueryKey = (createHistory) => {
  describe('when queryKey == "a"', () => {
    let history
    beforeEach(() => {
      history = createHistory({ queryKey: 'a' })
    })

    it('remembers state across transitions', (done) => {
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
          expect(location.state).toEqual({ the: 'state' }) // State is present
          expect(location.action).toEqual(POP)
          expect(location.key).toExist()
        }
      ]

      execSteps(steps, history, done)
    })
  })
}

export default describeQueryKey
