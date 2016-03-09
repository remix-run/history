import expect from 'expect'
import { REPLACE, POP } from '../Actions'
import execSteps from './execSteps'

const describeReplace = (createHistory) => {
  describe('replace', () => {
    let history, unlisten
    beforeEach(() => {
      history = createHistory()
    })

    afterEach(() => {
      if (unlisten)
        unlisten()
    })

    describe('with a path string', () => {
      it('calls change listeners with the new location', (done) => {
        const steps = [
          (location) => {
            expect(location.pathname).toEqual('/')
            expect(location.search).toEqual('')
            expect(location.state).toBe(undefined)
            expect(location.action).toEqual(POP)

            history.replace('/home?the=query')
          },
          (location) => {
            expect(location.pathname).toEqual('/home')
            expect(location.search).toEqual('?the=query')
            expect(location.state).toBe(undefined)
            expect(location.action).toEqual(REPLACE)
          }
        ]

        unlisten = history.listen(execSteps(steps, done))
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

            history.replace({
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
          }
        ]

        unlisten = history.listen(execSteps(steps, done))
      })

      it('correctly merges with old location', (done) => {
        let oldLocation

        const steps = [
          (location) => {
            expect(location.pathname).toEqual('/')
            expect(location.search).toEqual('')
            expect(location.state).toBe(undefined)
            expect(location.action).toEqual(POP)

            oldLocation = location

            history.replace({
              ...location,
              search: '?the=query',
              state: { the: 'state' }
            })
          },
          (location) => {
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
