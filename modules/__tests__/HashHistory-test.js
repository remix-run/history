import createHistory from '../createHashHistory'
import * as TestSequences from './TestSequences'
import { supportsGoWithoutReloadUsingHash, supportsHistory } from '../DOMUtils'
import expect from 'expect'

import describeQueryKey from './describeQueryKey'
import describeQueries from './describeQueries'

const describeGo = supportsGoWithoutReloadUsingHash() ? describe : describe.skip

describe('a hash history', () => {
  beforeEach(() => {
    if (window.location.hash !== '')
      window.location.hash = ''
  })

  // TODO: Inline these.
  describeQueries(createHistory)

  //if (supportsHistory() && supportsGoWithoutReloadUsingHash()) {
  //  describeQueryKey(createHistory)
  //} else {
  //  describe.skip('go without reload not supported', () => {
  //    describeQueryKey(createHistory)
  //  })
  //}

  describe('by default', () => {
    let history
    beforeEach(() => {
      history = createHistory()
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
      it.skip('does not update the location', (done) => {
        TestSequences.DenyAsyncTransition(history, done)
      })
    })
  })

  describe('with the "slash" hashType', () => {
    let history
    beforeEach(() => {
      history = createHistory({
        hashType: 'slash'
      })
    })

    it('knows how to make hrefs', () => {
      expect(history.createHref('/the/path')).toEqual('#/the/path')
    })
  })

  describe('with the "noslash" hashType', () => {
    let history
    beforeEach(() => {
      history = createHistory({
        hashType: 'noslash'
      })
    })

    it('knows how to make hrefs', () => {
      expect(history.createHref('/the/path')).toEqual('#the/path')
    })
  })

  describe('with the "hashbang" hashType', () => {
    let history
    beforeEach(() => {
      history = createHistory({
        hashType: 'hashbang'
      })
    })

    it('knows how to make hrefs', () => {
      expect(history.createHref('/the/path')).toEqual('#!/the/path')
    })
  })
})
