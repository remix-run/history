import expect from 'expect'
import createMemoryHistory from '../createMemoryHistory'
import describeInitialLocation from './describeInitialLocation'
import describeTransitions from './describeTransitions'
import describePushState from './describePushState'
import describePush from './describePush'
import describeReplaceState from './describeReplaceState'
import describeReplace from './describeReplace'
import describeBasename from './describeBasename'
import describeQueries from './describeQueries'
import describeGo from './describeGo'

describe('memory history', function () {
  describeInitialLocation(createMemoryHistory)
  describeTransitions(createMemoryHistory)
  describePushState(createMemoryHistory)
  describePush(createMemoryHistory)
  describeReplaceState(createMemoryHistory)
  describeReplace(createMemoryHistory)
  describeBasename(createMemoryHistory)
  describeQueries(createMemoryHistory)
  describeGo(createMemoryHistory)

  describe('when using pushState in the middle of the stack', function () {
    it('clears rest of stack so the user cannot go forward', function () {
      let history = createMemoryHistory(), location

      history.listen(function (loc) {
        location = loc
      })

      history.pushState({ id: 1 }, '/1')
      history.pushState({ id: 2 }, '/2')
      history.pushState({ id: 3 }, '/3')
      history.pushState({ id: 4 }, '/4')

      expect(location.state).toEqual({ id: 4 })

      history.go(-2)

      expect(location.state).toEqual({ id: 2 })

      history.pushState({ id: 5 }, '/5')

      expect(location.state).toEqual({ id: 5 })
      expect(location.pathname).toEqual('/5')

      history.goBack()

      expect(location.state).toEqual({ id: 2 })

      history.goForward()

      expect(location.state).toEqual({ id: 5 })
      expect(location.pathname).toEqual('/5')

      expect(function () {
        history.goForward()
      }).toThrow(/Cannot go\(\d+\) there is not enough history/)

      history.goBack()
      history.pushState({ id: 6 }, '/6')

      expect(function () {
        history.goForward()
      }).toThrow(/Cannot go\(\d+\) there is not enough history/)
    })
  })
})
