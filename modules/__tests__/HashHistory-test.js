import expect from 'expect'
import { supportsGoWithoutReloadUsingHash, supportsHistory } from '../DOMUtils'
import createHashHistory from '../createHashHistory'
import describeInitialLocation from './describeInitialLocation'
import describeTransitions from './describeTransitions'
import describePushState from './describePushState'
import describePush from './describePush'
import describeReplaceState from './describeReplaceState'
import describeReplace from './describeReplace'
import describePopState from './describePopState'
import describeQueryKey from './describeQueryKey'
import describeHashSupport from './describeHashSupport'
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
  describePush(createHashHistory)
  describeReplaceState(createHashHistory)
  describeReplace(createHashHistory)
  describeHashSupport(createHashHistory)
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
    let history = createHashHistory()
    expect(history.createHref('/a/path')).toEqual('#/a/path')
  })

  it('serializes hash from location', function () {
    let history = createHashHistory({ queryKey: false })
    history.pushState(null, '/home?the=query#anchor')
    expect(window.location.hash).toEqual('#/home?the=query#anchor')
  })

  it('reads hash from location', function (done) {
    window.location.hash = '#/home#anchor'
    let history = createHashHistory()
    let unlisten = history.listen(function (location) {
      expect(location.pathname).toEqual('/home')
      expect(location.hash).toEqual('#anchor')
      done()
    })
    unlisten()
  })
})
