import createHashHistory from '../createHashHistory'
import * as TestSequences from './TestSequences'
import { supportsGoWithoutReloadUsingHash, supportsHistory } from '../DOMUtils'
import expect from 'expect'

import describeTransitions from './describeTransitions'
import describePathCoding from './describePathCoding'
import describePopState from './describePopState'
import describeQueryKey from './describeQueryKey'
import describeBasename from './describeBasename'
import describeQueries from './describeQueries'

describe('HashHistory', () => {
  let history
  beforeEach(() => {
    if (window.location.hash !== '')
      window.location.hash = ''

    history = createHashHistory()
  })

  it('knows how to make hrefs', () => {
    expect(history.createHref('/a/path')).toEqual('#/a/path')
  })

  describe('listen', () => {
    it('does not immediately call listeners', (done) => {
      TestSequences.Listen(history, done)
    })
  })

  describe('the initial location', () => {
    it('location does not have a key', (done) => {
      TestSequences.InitialLocation(history, done)
    })
  })

  describe('push', () => {
    describe('with a string', () => {
      it('calls change listeners with the new location', (done) => {
        TestSequences.PushWithString(history, done)
      })
    })

    describe('with an object', () => {
      it('calls change listeners with the new location', (done) => {
        TestSequences.PushWithObject(history, done)
      })

      it('becomes REPLACE if path is unchanged', (done) => {
        TestSequences.PushBecomesReplace(history, done)
      })

      it('remains PUSH if state is changed', (done) => {
        TestSequences.PushStateChange(history, done)
      })

      it('correctly merges with an old location', (done) => {
        TestSequences.PushMerge(history, done)
      })
    })
  })

  describe('replace', () => {
    describe('with a string', () => {
      it('calls change listeners with the new location', (done) => {
        TestSequences.ReplaceWithString(history, done)
      })
    })

    describe('with an object', () => {
      it('calls change listeners with the new location', (done) => {
        TestSequences.ReplaceWithObject(history, done)
      })

      it('correctly merges with an old location', (done) => {
        TestSequences.ReplaceMerge(history, done)
      })
    })
  })

  const describeGo = supportsHistory() && supportsGoWithoutReloadUsingHash() ? describe : describe.skip

  describeGo('go', () => {
    describe('back', () => {
      it('calls change listeners with the previous location', (done) => {
        TestSequences.GoBack(history, done)
      })
    })

    describe('forward', () => {
      it('calls change listeners with the next location', (done) => {
        TestSequences.GoForward(history, done)
      })
    })
  })

  describe('a synchronous transition hook', () => {
    it('receives the next location', (done) => {
      TestSequences.SyncTransitionHook(history, done)
    })
  })

  describe('an asynchronous transition hook', () => {
    it('receives the next location', (done) => {
      TestSequences.AsyncTransitionHook(history, done)
    })
  })

  // TODO: Inline these.
  describeTransitions(createHashHistory)
  describeBasename(createHashHistory)
  describeQueries(createHashHistory)

  if (supportsHistory()) {
    describePopState(createHashHistory)
  } else {
    describe.skip('history API not supported', () => {
      describePopState(createHashHistory)
    })
  }

  if (supportsHistory() && supportsGoWithoutReloadUsingHash()) {
    describeQueryKey(createHashHistory)
    describePathCoding(createHashHistory)
  } else {
    describe.skip('go without reload not supported', () => {
      describeQueryKey(createHashHistory)
      describePathCoding(createHashHistory)
    })
  }
})
