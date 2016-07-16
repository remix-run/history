import expect from 'expect'
import { supportsGoWithoutReloadUsingHash, supportsHistory } from '../DOMUtils'
import createHashHistory from '../createHashHistory'
import describeListen from './describeListen'
import describeInitialLocation from './describeInitialLocation'
import describeTransitions from './describeTransitions'
import describePush from './describePush'
import describeReplace from './describeReplace'
import describePathCoding from './describePathCoding'
import describePopState from './describePopState'
import describeQueryKey from './describeQueryKey'
import describeBasename from './describeBasename'
import describeQueries from './describeQueries'
import describeGo from './describeGo'

describe('hash history', () => {
  beforeEach(() => {
    if (window.location.hash !== '')
      window.location.hash = ''
  })

  it('knows how to make hrefs', () => {
    const history = createHashHistory()
    expect(history.createHref('/a/path')).toEqual('#/a/path')
  })

  describeListen(createHashHistory)
  describeInitialLocation(createHashHistory)
  describeTransitions(createHashHistory)
  describePush(createHashHistory)
  describeReplace(createHashHistory)
  describeBasename(createHashHistory)
  describeQueries(createHashHistory)

  if (supportsHistory()) {
    describePopState(createHashHistory)
  } else {
    describe.skip(null, () => {
      describePopState(createHashHistory)
    })
  }

  if (supportsHistory() && supportsGoWithoutReloadUsingHash()) {
    describeGo(createHashHistory)
    describeQueryKey(createHashHistory)
    describePathCoding(createHashHistory)
  } else {
    describe.skip(null, () => {
      describeGo(createHashHistory)
      describeQueryKey(createHashHistory)
      describePathCoding(createHashHistory)
    })
  }
})
