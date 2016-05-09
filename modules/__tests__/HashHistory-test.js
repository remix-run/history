import expect from 'expect'
import { supportsGoWithoutReloadUsingHash, supportsHistory } from '../DOMUtils'
import createHashHistory from '../createHashHistory'
import describeListen from './describeListen'
import describeInitialLocation from './describeInitialLocation'
import describeTransitions from './describeTransitions'
import describePush from './describePush'
import describeReplace from './describeReplace'
import describeTransformPath from './describeTransformPath'
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

  it('knows how to make hrefs with a custom transformPath function', () => {
    const history = createHashHistory({
      transformPath: (path, encode) => {
        if (encode)
          return path.indexOf('/prefix') !== 0 ? `/prefix${path}` : path

        return path.substring(7)
      }
    })
    expect(history.createHref('/a/path')).toEqual('#/prefix/a/path')
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
    describeTransformPath(createHashHistory)
    describeGo(createHashHistory)
    describeQueryKey(createHashHistory)
  } else {
    describe.skip(null, () => {
      describeTransformPath(createHashHistory)
      describeGo(createHashHistory)
      describeQueryKey(createHashHistory)
    })
  }
})
