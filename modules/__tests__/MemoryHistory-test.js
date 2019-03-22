import expect from 'expect';

import { createMemoryHistory as createHistory } from 'history';

import * as TestSequences from './TestSequences';

describe('a memory history', () => {
  describe('by default', () => {
    let history;
    beforeEach(() => {
      history = createHistory();
    });

    describe('listen', () => {
      it('does not immediately call listeners', done => {
        TestSequences.Listen(history, done);
      });
    });

    describe('the initial location', () => {
      it('has a key', done => {
        TestSequences.InitialLocationHasKey(history, done);
      });
    });

    describe('push a new path', () => {
      it('calls change listeners with the new location', done => {
        TestSequences.PushNewLocation(history, done);
      });
    });

    describe('push the same path', () => {
      it('calls change listeners with the new location', done => {
        TestSequences.PushSamePath(history, done);
      });
    });

    describe('push state', () => {
      it('calls change listeners with the new location', done => {
        TestSequences.PushState(history, done);
      });
    });

    describe('push with no pathname', () => {
      it('calls change listeners with the normalized location', done => {
        TestSequences.PushMissingPathname(history, done);
      });
    });

    describe('push with a relative pathname', () => {
      it('calls change listeners with the normalized location', done => {
        TestSequences.PushRelativePathname(history, done);
      });
    });

    describe('replace a new path', () => {
      it('calls change listeners with the new location', done => {
        TestSequences.ReplaceNewLocation(history, done);
      });
    });

    describe('replace the same path', () => {
      it('calls change listeners with the new location', done => {
        TestSequences.ReplaceSamePath(history, done);
      });
    });

    describe('replace state', () => {
      it('calls change listeners with the new location', done => {
        TestSequences.ReplaceState(history, done);
      });
    });

    describe('goBack', () => {
      it('calls change listeners with the previous location', done => {
        TestSequences.GoBack(history, done);
      });
    });

    describe('goForward', () => {
      it('calls change listeners with the next location', done => {
        TestSequences.GoForward(history, done);
      });
    });

    describe('block', () => {
      it('blocks all transitions', done => {
        TestSequences.BlockEverything(history, done);
      });
    });

    describe('block a POP without listening', () => {
      it('receives the next location and action as arguments', done => {
        TestSequences.BlockPopWithoutListening(history, done);
      });
    });
  });

  describe('pathname encoding', () => {
    describe('with a custom "transformPathname" function', () => {
      it('creates a location whose pathname is transformed by the transformPathname function', done => {
        const history = createHistory({
          transformPathname: pathname => pathname.toUpperCase()
        })
        TestSequences.TransformPathname(history, done);
      });
    });

    describe('default "transformPathname" function', () => {     
      it('does not encode unicode characters', () => {
        window.history.replaceState(null, null, '/');
        const history = createHistory();
        history.push('/歴史')
        expect(history.location.pathname).toEqual('/歴史');
      });
      
      it('does not decode encoded pathnames', () => {
        window.history.replaceState(null, null, '/');
        const history = createHistory();
        history.push('/100%20%25')
        expect(history.location.pathname).toEqual('/100%20%25');
      });
    });
  });
  
  describe('that denies all transitions', () => {
    const getUserConfirmation = (_, callback) => callback(false);

    let history;
    beforeEach(() => {
      history = createHistory({
        getUserConfirmation
      });
    });

    describe('push', () => {
      it('does not update the location', done => {
        TestSequences.DenyPush(history, done);
      });
    });

    describe('goBack', () => {
      it('does not update the location', done => {
        TestSequences.DenyGoBack(history, done);
      });
    });

    describe('goForward', () => {
      it('does not update the location', done => {
        TestSequences.DenyGoForward(history, done);
      });
    });
  });

  describe('a transition hook', () => {
    const getUserConfirmation = (_, callback) => callback(true);

    let history;
    beforeEach(() => {
      history = createHistory({
        getUserConfirmation
      });
    });

    it('receives the next location and action as arguments', done => {
      TestSequences.TransitionHookArgs(history, done);
    });

    it('cancels the transition when it returns false', done => {
      TestSequences.ReturnFalseTransitionHook(history, done);
    });
  });
});
