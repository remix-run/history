import createBrowserHistory from '../createBrowserHistory'
import * as TestSequences from './TestSequences'
import { supportsHistory } from '../DOMUtils'

import describeTransitions from './describeTransitions'
import describePopState from './describePopState'
import describePopStateCancel from './describePopStateCancel'
import describeHashSupport from './describeHashSupport'
import describeBasename from './describeBasename'
import describeQueries from './describeQueries'

const describeHistory = supportsHistory() ? describe : describe.skip

describeHistory('BrowserHistory', () => {
  let history
  beforeEach(() => {
    window.history.replaceState(null, null, '/')
    history = createBrowserHistory()
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

  describe('go', () => {
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
  describeTransitions(createBrowserHistory)
  describePopState(createBrowserHistory)
  describePopStateCancel(createBrowserHistory)
  describeHashSupport(createBrowserHistory)
  describeBasename(createBrowserHistory)
  describeQueries(createBrowserHistory)
})
