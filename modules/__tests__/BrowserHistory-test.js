import expect from 'expect';
import mock from 'jest-mock';
import { createBrowserHistory } from 'history';

import * as TestSequences from './TestSequences';

describe('a browser history', () => {
  beforeEach(() => {
    window.history.replaceState(null, null, '/');
  });

  describe('by default', () => {
    let history;
    beforeEach(() => {
      history = createBrowserHistory();
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

    describe('push with a unicode path string', () => {
      it('creates a location with decoded properties', done => {
        TestSequences.PushUnicodeLocation(history, done);
      });
    });

    describe('push with an encoded path string', () => {
      it('creates a location object with encoded pathname', done => {
        TestSequences.PushEncodedLocation(history, done);
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

    describe('location created by encoded and unencoded pathname', () => {
      it('produces the same location.pathname', done => {
        TestSequences.LocationPathnameAlwaysSame(history, done);
      });
    });

    describe('location created with encoded/unencoded reserved characters', () => {
      it('produces different location objects', done => {
        TestSequences.EncodedReservedCharacters(history, done);
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

  describe('that denies all transitions', () => {
    let history;
    beforeEach(() => {
      history = createBrowserHistory({
        getUserConfirmation(_, callback) {
          callback(false);
        }
      });
    });

    describe('clicking on a link (push)', () => {
      it('does not update the location', done => {
        TestSequences.DenyPush(history, done);
      });
    });

    describe('clicking the back button (goBack)', () => {
      it('does not update the location', done => {
        TestSequences.DenyGoBack(history, done);
      });
    });

    describe('clicking the forward button (goForward)', () => {
      it('does not update the location', done => {
        TestSequences.DenyGoForward(history, done);
      });
    });
  });

  describe('a transition hook', () => {
    let history;
    beforeEach(() => {
      history = createBrowserHistory({
        getUserConfirmation(_, callback) {
          callback(true);
        }
      });
    });

    it('receives the next location and action as arguments', done => {
      TestSequences.TransitionHookArgs(history, done);
    });

    it('cancels the transition when it returns false', done => {
      TestSequences.ReturnFalseTransitionHook(history, done);
    });

    it('is called when the back button is clicked', done => {
      TestSequences.BackButtonTransitionHook(history, done);
    });

    it('is called on the hashchange event', done => {
      TestSequences.HashChangeTransitionHook(history, done);
    });
  });

  describe('basename', () => {
    it('strips the basename from the pathname', () => {
      window.history.replaceState(null, null, '/prefix/pathname');
      const history = createBrowserHistory({ basename: '/prefix' });
      expect(history.location.pathname).toEqual('/pathname');
    });

    it('is not case-sensitive', () => {
      window.history.replaceState(null, null, '/PREFIX/pathname');
      const history = createBrowserHistory({ basename: '/prefix' });
      expect(history.location.pathname).toEqual('/pathname');
    });

    it('does not strip partial prefix matches', () => {
      const spy = mock.spyOn(console, 'warn').mockImplementation(() => {});

      window.history.replaceState(null, null, '/prefixed/pathname');
      const history = createBrowserHistory({ basename: '/prefix' });
      expect(history.location.pathname).toEqual('/prefixed/pathname');

      expect(spy).toHaveBeenCalledTimes(1);
      spy.mockRestore();
    });

    it('strips when path is only the prefix', () => {
      window.history.replaceState(null, null, '/prefix');
      const history = createBrowserHistory({ basename: '/prefix' });
      expect(history.location.pathname).toEqual('/');
    });

    it('strips with no pathname, but with a search string', () => {
      window.history.replaceState(null, null, '/prefix?a=b');
      const history = createBrowserHistory({ basename: '/prefix' });
      expect(history.location.pathname).toEqual('/');
    });

    it('strips with no pathname, but with a hash string', () => {
      window.history.replaceState(null, null, '/prefix#rest');
      const history = createBrowserHistory({ basename: '/prefix' });
      expect(history.location.pathname).toEqual('/');
    });
  });

  describe('with no basename', () => {
    it('knows how to create hrefs', () => {
      const history = createBrowserHistory();
      const href = history.createHref({
        pathname: '/the/path',
        search: '?the=query',
        hash: '#the-hash'
      });

      expect(href).toEqual('/the/path?the=query#the-hash');
    });
  });

  describe('with a basename', () => {
    it('knows how to create hrefs', () => {
      window.history.replaceState(null, null, '/the/base');

      const history = createBrowserHistory({ basename: '/the/base' });
      const href = history.createHref({
        pathname: '/the/path',
        search: '?the=query',
        hash: '#the-hash'
      });

      expect(href).toEqual('/the/base/the/path?the=query#the-hash');
    });
  });

  describe('with a bad basename', () => {
    it('knows how to create hrefs', () => {
      window.history.replaceState(null, null, '/the/bad/base');

      const history = createBrowserHistory({ basename: '/the/bad/base/' });
      const href = history.createHref({
        pathname: '/the/path',
        search: '?the=query',
        hash: '#the-hash'
      });

      expect(href).toEqual('/the/bad/base/the/path?the=query#the-hash');
    });
  });

  describe('with a slash basename', () => {
    it('knows how to create hrefs', () => {
      const history = createBrowserHistory({ basename: '/' });
      const href = history.createHref({
        pathname: '/the/path',
        search: '?the=query',
        hash: '#the-hash'
      });

      expect(href).toEqual('/the/path?the=query#the-hash');
    });
  });

  describe('encoding', () => {
    it('does not encode the generated path', () => {
      const history = createBrowserHistory();

      // encoded
      const encodedHref = history.createHref({
        pathname: '/%23abc'
      });
      // unencoded
      const unencodedHref = history.createHref({
        pathname: '/#abc'
      });

      expect(encodedHref).toEqual('/%23abc');
      expect(unencodedHref).toEqual('/#abc');
    });
  });
});
