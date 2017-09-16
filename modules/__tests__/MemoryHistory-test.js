import expect from 'expect'
import createHistory from '../createMemoryHistory'
import * as TestSequences from './TestSequences'

describe('a memory history', () => {
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
      it('has a key', (done) => {
        TestSequences.InitialLocationHasKey(history, done)
      })
    })

    describe('push a new path', () => {
      it('calls change listeners with the new location', (done) => {
        TestSequences.PushNewLocation(history, done)
      })
    })

    describe('push the same path', () => {
      it('calls change listeners with the new location', (done) => {
        TestSequences.PushSamePath(history, done)
      })
    })

    describe('push state', () => {
      it('calls change listeners with the new location', (done) => {
        TestSequences.PushState(history, done)
      })
    })

    describe('push with no pathname', () => {
      it('calls change listeners with the normalized location', (done) => {
        TestSequences.PushMissingPathname(history, done)
      })
    })

    describe('push with a relative pathname', () => {
      it('calls change listeners with the normalized location', (done) => {
        TestSequences.PushRelativePathname(history, done)
      })
    })

    describe('push with a unicode path string', () => {
      it('creates a location with decoded properties', (done) => {
        TestSequences.PushUnicodeLocation(history, done)
      })
    })

    describe('push with an encoded path string', () => {
      it('creates a location object with decoded pathname', (done) => {
        TestSequences.PushEncodedLocation(history, done)
      })
    })

    describe('push with an invalid path string (bad percent-encoding)', () => {
      it('throws an error', (done) => {
        TestSequences.PushInvalidPathname(history, done)
      })
    })

    describe('replace a new path', () => {
      it('calls change listeners with the new location', (done) => {
        TestSequences.ReplaceNewLocation(history, done)
      })
    })

    describe('replace the same path', () => {
      it('calls change listeners with the new location', (done) => {
        TestSequences.ReplaceSamePath(history, done)
      })
    })

    describe('replace state', () => {
      it('calls change listeners with the new location', (done) => {
        TestSequences.ReplaceState(history, done)
      })
    })

    describe('replace  with an invalid path string (bad percent-encoding)', () => {
      it('throws an error', (done) => {
        TestSequences.ReplaceInvalidPathname(history, done)
      })
    })

    describe('location created by encoded and unencoded pathname', () => {
      it('produces the same location.pathname', (done) => {
        TestSequences.LocationPathnameAlwaysDecoded(history, done)
      })
    })

    describe('location created with encoded/unencoded reserved characters', () => {
      it('produces different location objects', (done) => {
        TestSequences.EncodedReservedCharacters(history, done)
      })
    })

    describe('goBack', () => {
      it('calls change listeners with the previous location', (done) => {
        TestSequences.GoBack(history, done)
      })
    })

    describe('goForward', () => {
      it('calls change listeners with the next location', (done) => {
        TestSequences.GoForward(history, done)
      })
    })

    describe('block', () => {
      it('blocks all transitions', (done) => {
        TestSequences.BlockEverything(history, done)
      })
    })

    describe('block a POP without listening', () => {
      it('receives the next location and action as arguments', (done) => {
        TestSequences.BlockPopWithoutListening(history, done)
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

    describe('push', () => {
      it('does not update the location', (done) => {
        TestSequences.DenyPush(history, done)
      })
    })

    describe('goBack', () => {
      it('does not update the location', (done) => {
        TestSequences.DenyGoBack(history, done)
      })
    })

    describe('goForward', () => {
      it('does not update the location', (done) => {
        TestSequences.DenyGoForward(history, done)
      })
    })
  })

  describe('a transition hook', () => {
    const getUserConfirmation = (_, callback) => callback(true)

    let history
    beforeEach(() => {
      history = createHistory({
        getUserConfirmation
      })
    })

    it('receives the next location and action as arguments', (done) => {
      TestSequences.TransitionHookArgs(history, done)
    })

    it('cancels the transition when it returns false', (done) => {
      TestSequences.ReturnFalseTransitionHook(history, done)
    })
  })

  describe('a transition hook', () => {
    const getUserConfirmation = (_, callback) => callback(true)
  
    let history
    beforeEach(() => {
      history = createHistory({
        getUserConfirmation
      })
    })
  
    it('receives the next location and action as arguments', (done) => {
      TestSequences.TransitionHookArgs(history, done)
    })
  
    it('cancels the transition when it returns false', (done) => {
      TestSequences.ReturnFalseTransitionHook(history, done)
    })
  })

  describe('basename', () => {
    let history
    beforeEach(() => {
      history = createHistory({ basename: '/prefix' })
    })

    it('strips the basename from the pathname', () => {
      history.push('/prefix/pathname')
      expect(history.location.pathname).toEqual('/pathname')
    })

    it('is not case-sensitive', () => {
      history.push('/PREFIX/pathname')
      expect(history.location.pathname).toEqual('/pathname')
    })

    it('does not strip partial prefix matches', () => {
      history.push('/prefixed/pathname')
      expect(history.location.pathname).toEqual('/prefixed/pathname')
    })

    it('strips when path is only the prefix', () => {
      history.push('/prefix')
      expect(history.location.pathname).toEqual('/')
    })

    it('strips with no pathname, but with a search string', () => {
      history.push('/prefix?a=b')
      expect(history.location.pathname).toEqual('/')
    })

    it('strips with no pathname, but with a hash string', () => {
      history.push('/prefix#rest')
      expect(history.location.pathname).toEqual('/')
    })

   
  })
})


