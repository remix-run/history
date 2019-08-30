import expect from 'expect';
import mock from 'jest-mock';
import { createHashHistory } from 'history';

import * as TestSequences from './TestSequences';

const canGoWithoutReload = window.navigator.userAgent.indexOf('Firefox') === -1;
const describeGo = canGoWithoutReload ? describe : describe.skip;

describe('a hash history', () => {
  beforeEach(() => {
    if (window.location.hash !== '#/') {
      window.location.hash = '/';
    }
  });

  describe('by default', () => {
    let history;
    beforeEach(() => {
      history = createHashHistory();
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
      it('calls change listeners with the new location and emits a warning', done => {
        TestSequences.ReplaceStateWarning(history, done);
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

  describe('that denies all transitions', () => {
    let history;
    beforeEach(() => {
      history = createHashHistory({
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
    let history;
    beforeEach(() => {
      history = createHashHistory({
        getUserConfirmation(_, callback) {
          callback(true);
        }
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

  describe('with a basename', () => {
    it('knows how to create hrefs', () => {
      window.location.hash = '#/the/base';
      const history = createHashHistory({ basename: '/the/base' });
      const href = history.createHref({
        pathname: '/the/path',
        search: '?the=query'
      });

      expect(href).toEqual('#/the/base/the/path?the=query');
    });
  });

  describe('with a bad basename', () => {
    it('knows how to create hrefs', () => {
      window.location.hash = '#/the/bad/base/';
      const history = createHashHistory({ basename: '/the/bad/base/' });
      const href = history.createHref({
        pathname: '/the/path',
        search: '?the=query'
      });

      expect(href).toEqual('#/the/bad/base/the/path?the=query');
    });
  });

  describe('with a slash basename', () => {
    it('knows how to create hrefs', () => {
      const history = createHashHistory({ basename: '/' });
      const href = history.createHref({
        pathname: '/the/path',
        search: '?the=query'
      });

      expect(href).toEqual('#/the/path?the=query');
    });
  });

  describe('encoding', () => {
    it('does not encode the generated path', () => {
      const history = createHashHistory();

      // encoded
      const encodedHref = history.createHref({
        pathname: '/%23abc'
      });
      // unencoded
      const unencodedHref = history.createHref({
        pathname: '/#abc'
      });

      expect(encodedHref).toEqual('#/%23abc');
      expect(unencodedHref).toEqual('#/#abc');
    });
  });
});

describe('a hash history with "slash" path coding', () => {
  beforeEach(() => {
    if (window.location.hash !== '#/') {
      window.location.hash = '/';
    }
  });

  it('properly encodes and decodes window.location.hash', done => {
    const history = createHashHistory({ hashType: 'slash' });
    TestSequences.SlashHashPathCoding(history, done);
  });

  it('knows how to create hrefs', () => {
    const history = createHashHistory({ hashType: 'slash' });
    const href = history.createHref({
      pathname: '/the/path',
      search: '?the=query',
      hash: '#the-hash'
    });

    expect(href).toEqual('#/the/path?the=query#the-hash');
  });
});

describe('a hash history with "hashbang" path coding', () => {
  beforeEach(() => {
    if (window.location.hash !== '#!/') {
      window.location.hash = '!/';
    }
  });

  it('properly encodes and decodes window.location.hash', done => {
    const history = createHashHistory({ hashType: 'hashbang' });
    TestSequences.HashbangHashPathCoding(history, done);
  });

  it('knows how to create hrefs', () => {
    const history = createHashHistory({ hashType: 'hashbang' });
    const href = history.createHref({
      pathname: '/the/path',
      search: '?the=query',
      hash: '#the-hash'
    });

    expect(href).toEqual('#!/the/path?the=query#the-hash');
  });
});

describe('a hash history with "noslash" path coding', () => {
  beforeEach(() => {
    if (window.location.hash !== '') {
      window.location.hash = '';
    }
  });

  it('properly encodes and decodes window.location.hash', done => {
    const history = createHashHistory({ hashType: 'noslash' });
    TestSequences.NoslashHashPathCoding(history, done);
  });

  it('knows how to create hrefs', () => {
    const history = createHashHistory({ hashType: 'noslash' });
    const href = history.createHref({
      pathname: '/the/path',
      search: '?the=query',
      hash: '#the-hash'
    });

    expect(href).toEqual('#the/path?the=query#the-hash');
  });
});

describe('a hash history with a basename', () => {
  it('strips the basename from the pathname', () => {
    window.location.hash = '/prefix/hello';
    const history = createHashHistory({ basename: '/prefix' });
    expect(history.location.pathname).toEqual('/hello');
  });

  it('is not case-sensitive', () => {
    window.location.hash = '/PREFIX/hello';
    const history = createHashHistory({ basename: '/prefix' });
    expect(history.location.pathname).toEqual('/hello');
  });

  it('does not strip partial prefix matches', () => {
    window.location.hash = '/no-match/hello';

    // A warning is issued when the prefix is not present.
    const spy = mock.spyOn(console, 'warn').mockImplementation(() => {});

    const history = createHashHistory({ basename: '/prefix' });
    expect(history.location.pathname).toEqual('/no-match/hello');

    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });

  describe('when the pathname is only the prefix', () => {
    it('strips the prefix', () => {
      window.location.hash = '/prefix';
      const history = createHashHistory({ basename: '/prefix' });
      expect(history.location.pathname).toEqual('/');
    });

    it('strips the prefix when there is a search string', () => {
      window.location.hash = '/prefix?a=b';
      const history = createHashHistory({ basename: '/prefix' });
      expect(history.location.pathname).toEqual('/');
    });

    it('strips the prefix when there is a hash', () => {
      window.location.hash = '/prefix#hash';
      const history = createHashHistory({ basename: '/prefix' });
      expect(history.location.pathname).toEqual('/');
    });
  });

  it('allows URL with regex special characters', () => {
    window.location.hash = '/prefix$special/hello';
    // console.log(window.location.href);
    // expect(window.location.hash).toEqual('#/prefix$special/hello');
    const history = createHashHistory({ basename: '/prefix$special' });
    expect(history.location.pathname).toEqual('/hello');
  });
});
