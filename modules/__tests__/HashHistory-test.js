/*eslint-env mocha */
import expect from 'expect'
import { supportsGoWithoutReloadUsingHash } from '../DOMUtils'
import createHashHistory from '../createHashHistory'
import describeInitialLocation from './describeInitialLocation'
import describeTransitions from './describeTransitions'
import describePushState from './describePushState'
import describeReplaceState from './describeReplaceState'
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
  describePushState(createHashHistory)
  describeReplaceState(createHashHistory)
  describePopState(createHashHistory)
  describeBasename(createHashHistory)
  describeQueries(createHashHistory)

  if (supportsGoWithoutReloadUsingHash()) {
    describeGo(createHashHistory)
    describeQueryKey(createHashHistory)
  } else {
    describe.skip(null, function () {
      describeGo(createHashHistory)
      describeQueryKey(createHashHistory)
    })
  }

  it('knows how to make hrefs', function () {
    let history = createHashHistory()
    expect(history.createHref('/a/path')).toEqual('#/a/path')
  })
})
