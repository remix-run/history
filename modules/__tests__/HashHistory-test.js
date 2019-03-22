import expect from 'expect';

import { createHashHistory as createHistory } from 'history';

import * as TestSequences from './TestSequences';

const canGoWithoutReload = window.navigator.userAgent.indexOf('Firefox') === -1;
const describeGo = canGoWithoutReload ? describe : describe.skip;

describe('a hash history', () => {
  beforeEach(() => {
    if (window.location.hash !== '') window.location.hash = '';
  });

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
      it('does not have a key', done => {
        TestSequences.InitialLocationNoKey(history, done);
      });
    });

    describe('push a new path', () => {
      it('calls change listeners with the new location', done => {
        TestSequences.PushNewLocation(history, done);
      });
    });

    describe('push the same path', () => {
      it('calls change listeners with the same location and emits a warning', done => {
        TestSequences.PushSamePathWarning(history, done);
      });
    });

    describe('push state', () => {
      it('calls change listeners with the new location and emits a warning', done => {
        TestSequences.PushStateWarning(history, done);
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
      it('calls change listeners with the new location and emits a warning', done => {
        TestSequences.ReplaceStateWarning(history, done);
      });
    });

    describeGo('goBack', () => {
      it('calls change listeners with the previous location', done => {
        TestSequences.GoBack(history, done);
      });
    });

    describeGo('goForward', () => {
      it('calls change listeners with the next location', done => {
        TestSequences.GoForward(history, done);
      });
    });

    describe('block', () => {
      it('blocks all transitions', done => {
        TestSequences.BlockEverything(history, done);
      });
    });

    describeGo('block a POP without listening', () => {
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
      it('creates a location with an encoded pathname', () => {
        window.history.replaceState(null, null, '#/test ing');
        const history = createHistory();
        expect(history.location.pathname).toEqual('/test%20ing');
      });
      
      it('encodes unicode characters', () => {
        window.history.replaceState(null, null, '/');
        const history = createHistory();
        history.push('/歴史')
        expect(history.location.pathname).toEqual('/%E6%AD%B4%E5%8F%B2');
      });
      
      it('respects pre-encoded pathnames', () => {
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

    describe('clicking on a link (push)', () => {
      it('does not update the location', done => {
        TestSequences.DenyPush(history, done);
      });
    });

    describeGo('clicking the back button (goBack)', () => {
      it('does not update the location', done => {
        TestSequences.DenyGoBack(history, done);
      });
    });

    describeGo('clicking the forward button (goForward)', () => {
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

    const itBackButton = canGoWithoutReload ? it : it.skip;

    itBackButton('is called when the back button is clicked', done => {
      TestSequences.BackButtonTransitionHook(history, done);
    });

    it('cancels the transition when it returns false', done => {
      TestSequences.ReturnFalseTransitionHook(history, done);
    });
  });

  describe('"hashbang" hash path coding', () => {
    let history;
    beforeEach(() => {
      history = createHistory({
        hashType: 'hashbang'
      });
    });

    it('properly encodes and decodes window.location.hash', done => {
      TestSequences.HashbangHashPathCoding(history, done);
    });
  });

  describe('"noslash" hash path coding', () => {
    let history;
    beforeEach(() => {
      history = createHistory({
        hashType: 'noslash'
      });
    });

    it('properly encodes and decodes window.location.hash', done => {
      TestSequences.NoslashHashPathCoding(history, done);
    });
  });

  describe('"slash" hash path coding', () => {
    let history;
    beforeEach(() => {
      history = createHistory({
        hashType: 'slash'
      });
    });

    it('properly encodes and decodes window.location.hash', done => {
      TestSequences.SlashHashPathCoding(history, done);
    });
  });

  describe('basename', () => {
    it('strips the basename from the pathname', () => {
      window.location.hash = '#/prefix/pathname';
      const history = createHistory({ basename: '/prefix' });
      expect(history.location.pathname).toEqual('/pathname');
    });

    it('is not case-sensitive', () => {
      window.location.hash = '#/PREFIX/pathname';
      const history = createHistory({ basename: '/prefix' });
      expect(history.location.pathname).toEqual('/pathname');
    });

    it('does not strip partial prefix matches', () => {
      window.location.hash = '#/prefixed/pathname';
      const history = createHistory({ basename: '/prefix' });
      expect(history.location.pathname).toEqual('/prefixed/pathname');
    });

    it('strips when path is only the prefix', () => {
      window.location.hash = '#/prefix';
      const history = createHistory({ basename: '/prefix' });
      expect(history.location.pathname).toEqual('/');
    });

    it('strips with no pathname, but with a search string', () => {
      window.location.hash = '#/prefix?a=b';
      const history = createHistory({ basename: '/prefix' });
      expect(history.location.pathname).toEqual('/');
    });

    it('strips with no pathname, but with a hash string', () => {
      window.location.hash = '#/prefix#rest';
      const history = createHistory({ basename: '/prefix' });
      expect(history.location.pathname).toEqual('/');
    });
  });
});
