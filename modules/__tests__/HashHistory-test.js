import expect from 'expect'
import { supportsGoWithoutReloadUsingHash, supportsHistory } from '../DOMUtils'
import createHashHistory from '../createHashHistory'
import describeInitialLocation from './describeInitialLocation'
import describeTransitions from './describeTransitions'
import describePush from './describePush'
import describeReplace from './describeReplace'
import describePopState from './describePopState'
import describeQueryKey from './describeQueryKey'
import describeBasename from './describeBasename'
import describeQueries from './describeQueries'
import describeGo from './describeGo'

describe('hash history', function () {
  beforeEach(function () {
    if (window.location.hash !== '')
      window.location.hash = ''
  })

  describeInitialLocation(createHashHistory)
  describeTransitions(createHashHistory)
  describePush(createHashHistory)
  describeReplace(createHashHistory)
  describeBasename(createHashHistory)
  describeQueries(createHashHistory)

  if (supportsHistory()) {
    describePopState(createHashHistory)
  } else {
    describe.skip(null, function () {
      describePopState(createHashHistory)
    })
  }

  if (supportsHistory() && supportsGoWithoutReloadUsingHash()) {
    describeGo(createHashHistory)
    describeQueryKey(createHashHistory)
  } else {
    describe.skip(null, function () {
      describeGo(createHashHistory)
      describeQueryKey(createHashHistory)
    })
  }

  it('knows how to make hrefs', function () {
    const history = createHashHistory()
    expect(history.createHref('/a/path')).toEqual('#/a/path')
  })
})
