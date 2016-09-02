import createMemoryHistory from '../createMemoryHistory'
import * as TestSequences from './TestSequences'
import expect from 'expect'

import describeTransitions from './describeTransitions'
import describeBasename from './describeBasename'
import describeQueries from './describeQueries'

describe('MemoryHistory', () => {
  let history
  beforeEach(() => {
    history = createMemoryHistory()
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

  describe('using push in the middle of the stack', () => {
    it('clears rest of stack so the user cannot go forward', () => {
      let location
      const unlisten = history.listen(loc => {
        location = loc
      })

      history.push({ pathname: '/1', state: { id: 1 } })
      history.push({ pathname: '/2', state: { id: 2 } })
      history.push({ pathname: '/3', state: { id: 3 } })
      history.push({ pathname: '/4', state: { id: 4 } })

      expect(location.state).toEqual({ id: 4 })

      history.go(-2)

      expect(location.state).toEqual({ id: 2 })

      history.push({ pathname: '/5', state: { id: 5 } })

      expect(location.state).toEqual({ id: 5 })
      expect(location.pathname).toEqual('/5')

      history.goBack()

      expect(location.state).toEqual({ id: 2 })

      history.goForward()

      expect(location.state).toEqual({ id: 5 })
      expect(location.pathname).toEqual('/5')

      // Mkae sure this doesn't do anything.
      history.goForward()
      expect(location.state).toEqual({ id: 5 })
      expect(location.pathname).toEqual('/5')

      history.goBack()
      history.push({ pathname: '/6', state: { id: 6 } })

      // Make sure this doesn't do anything.
      history.goForward()
      expect(location.state).toEqual({ id: 6 })
      expect(location.pathname).toEqual('/6')

      // Make sure this doesn't do anything.
      history.go(-999)
      expect(location.state).toEqual({ id: 6 })
      expect(location.pathname).toEqual('/6')

      unlisten()
    })
  })

  // TODO: Inline these.
  describeTransitions(createMemoryHistory)
  describeBasename(createMemoryHistory)
  describeQueries(createMemoryHistory)
})
