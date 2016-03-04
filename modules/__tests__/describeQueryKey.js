import expect from 'expect'
import { PUSH, POP } from '../Actions'
import execSteps from './execSteps'

const describeQueryKey = (createHistory) => {
  describe('when the user does not want to persist a state', () => {
    let history, unlisten
    beforeEach(() => {
      history = createHistory({ queryKey: false })
    })

    afterEach(() => {
      if (unlisten)
        unlisten()
    })

    it('forgets state across transitions', (done) => {
      const steps = [
        (location) => {
          expect(location.pathname).toEqual('/')
          expect(location.search).toEqual('')
          expect(location.state).toEqual(null)
          expect(location.action).toEqual(POP)

          history.push('/home?the=query')
        },
        (location) => {
          expect(location.pathname).toEqual('/home')
          expect(location.search).toEqual('?the=query')
          expect(location.state).toEqual(null)
          expect(location.action).toEqual(PUSH)

          history.goBack()
        },
        (location) => {
          expect(location.pathname).toEqual('/')
          expect(location.search).toEqual('')
          expect(location.state).toEqual(null)
          expect(location.action).toEqual(POP)

          history.goForward()
        },
        (location) => {
          expect(location.pathname).toEqual('/home')
          expect(location.search).toEqual('?the=query')
          expect(location.state).toEqual(null) // State is missing.
          expect(location.action).toEqual(POP)
        }
      ]

      unlisten = history.listen(execSteps(steps, done))
    })
  })

  describe('when the user wants to persist state', () => {
    let history, unlisten
    beforeEach(() => {
      history = createHistory({ queryKey: 'a' })
    })

    afterEach(() => {
      if (unlisten)
        unlisten()
    })

    it('remembers state across transitions', (done) => {
      const steps = [
        (location) => {
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
        (location) => {
          expect(location.pathname).toEqual('/home')
          expect(location.search).toEqual('?the=query')
          expect(location.state).toEqual({ the: 'state' })
          expect(location.action).toEqual(PUSH)

          history.goBack()
        },
        (location) => {
          expect(location.pathname).toEqual('/')
          expect(location.search).toEqual('')
          expect(location.state).toEqual(null)
          expect(location.action).toEqual(POP)

          history.goForward()
        },
        (location) => {
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
