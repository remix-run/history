import expect from 'expect'
import createMemoryHistory from '../createMemoryHistory'
import describeListen from './describeListen'
import describeInitialLocation from './describeInitialLocation'
import describeTransitions from './describeTransitions'
import describePush from './describePush'
import describeReplace from './describeReplace'
import describeBasename from './describeBasename'
import describeQueries from './describeQueries'
import describeGo from './describeGo'

describe('memory history', () => {
  describeListen(createMemoryHistory)
  describeInitialLocation(createMemoryHistory)
  describeTransitions(createMemoryHistory)
  describePush(createMemoryHistory)
  describeReplace(createMemoryHistory)
  describeBasename(createMemoryHistory)
  describeQueries(createMemoryHistory)
  describeGo(createMemoryHistory)

  describe('when using push in the middle of the stack', () => {
    it('clears rest of stack so the user cannot go forward', () => {
      const history = createMemoryHistory()

      let location
      history.listen((loc) => {
        location = loc
      })

      history.push({
        pathname: '/1',
        state: { id: 1 }
      })
      history.push({
        pathname: '/2',
        state: { id: 2 }
      })
      history.push({
        pathname: '/3',
        state: { id: 3 }
      })
      history.push({
        pathname: '/4',
        state: { id: 4 }
      })

      expect(location.state).toEqual({ id: 4 })

      history.go(-2)

      expect(location.state).toEqual({ id: 2 })

      history.push({
        pathname: '/5',
        state: { id: 5 }
      })

      expect(location.state).toEqual({ id: 5 })
      expect(location.pathname).toEqual('/5')

      history.goBack()

      expect(location.state).toEqual({ id: 2 })

      history.goForward()

      expect(location.state).toEqual({ id: 5 })
      expect(location.pathname).toEqual('/5')

      // Mkae sure this doesn't do anything.
      history.goForward()
      expect(location.state).toEqual({ id: 5 })
      expect(location.pathname).toEqual('/5')

      history.goBack()
      history.push({
        pathname: '/6',
        state: { id: 6 }
      })

      // Make sure this doesn't do anything.
      history.goForward()
      expect(location.state).toEqual({ id: 6 })
      expect(location.pathname).toEqual('/6')

      // Make sure this doesn't do anything.
      history.go(-999)
      expect(location.state).toEqual({ id: 6 })
      expect(location.pathname).toEqual('/6')
    })
  })
})
