import expect from 'expect'
import { PUSH, POP } from '../Actions'
import execSteps from './execSteps'

const describeHashSupport = (createHistory) => {
  describe('when a URL with a hash is pushed', () => {
    let history
    beforeEach(() => {
      history = createHistory()
    })

    it('preserves the hash', (done) => {
      const steps = [
        (location) => {
          expect(location.pathname).toEqual('/')
          expect(location.search).toEqual('')
          expect(location.hash).toEqual('')
          expect(location.state).toBe(undefined)
          expect(location.action).toEqual(POP)
          expect(location.key).toBe(null)

          history.push({
            pathname: '/home',
            search: '?the=query',
            hash: '#the-hash',
            state: { the: 'state' }
          })
        },
        (location) => {
          expect(location.pathname).toEqual('/home')
          expect(location.search).toEqual('?the=query')
          expect(location.hash).toEqual('#the-hash')
          expect(location.state).toEqual({ the: 'state' })
          expect(location.action).toEqual(PUSH)
          expect(location.key).toExist()
        }
      ]

      execSteps(steps, history, done)
    })

    it('does not convert PUSH to REPLACE if path does not change', (done) => {
      const steps = [
        (location) => {
          expect(location.pathname).toEqual('/')
          expect(location.search).toEqual('')
          expect(location.hash).toEqual('')
          expect(location.state).toBe(undefined)
          expect(location.action).toEqual(POP)
          expect(location.key).toBe(null)

          history.push('/#the-hash')
        },
        (location) => {
          expect(location.pathname).toEqual('/')
          expect(location.search).toEqual('')
          expect(location.hash).toEqual('#the-hash')
          expect(location.state).toBe(undefined)
          expect(location.action).toEqual(PUSH)
          expect(location.key).toExist()
        }
      ]

      execSteps(steps, history, done)
    })
  })
}

export default describeHashSupport
