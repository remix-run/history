import createHistory from '../createBrowserHistory'
import * as TestSequences from './TestSequences'
import { supportsHistory } from '../DOMUtils'

import describeHashSupport from './describeHashSupport'
import describeQueries from './describeQueries'

const describeHistory = supportsHistory() ? describe : describe.skip

describeHistory('a browser history', () => {
  beforeEach(() => {
    window.history.replaceState(null, null, '/')
  })

  // TODO: Inline these.
  describeHashSupport(createHistory)
  describeQueries(createHistory)

  describe('by default', () => {
    let history
    beforeEach(() => {
      history = createHistory()
    })

    describe('listen', () => {
      it('does not immediately call listeners', (done) => {
        TestSequences.Listen(history, done)
      })
    })

    describe('the initial location', () => {
      it('does not have a key', (done) => {
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

    describe('a transition hook', () => {
      it('is called when the back button is clicked', (done) => {
        TestSequences.BackButtonTransitionHook(history, done)
      })

      it('is called on the hashchange event', (done) => {
        TestSequences.HashChangeTransitionHook(history, done)
      })
    })

    describe('a synchronous transition', () => {
      it('receives the next location', (done) => {
        TestSequences.SyncTransitionHook(history, done)
      })
    })

    describe('an asynchronous transition', () => {
      it('receives the next location', (done) => {
        TestSequences.AsyncTransitionHook(history, done)
      })
    })
  })

  describe('that denies all transitions', () => {
    const getUserConfirmation = (_, callback) => callback(false)

    let history
    beforeEach(() => {
      history = createHistory({
        getUserConfirmation
      })
    })

    describe('a synchronous transition', () => {
      it('does not update the location', (done) => {
        TestSequences.DenySyncTransition(history, done)
      })
    })

    describe('an asynchronous transition', () => {
      it('does not update the location', (done) => {
        TestSequences.DenyAsyncTransition(history, done)
      })
    })
  })
})
