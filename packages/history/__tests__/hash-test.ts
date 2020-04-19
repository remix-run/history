/* eslint-disable import/no-unresolved */
import expect from 'expect';
import { createHashHistory } from 'history';

import Listen from './TestSequences/Listen';
import InitialLocationDefaultKey from './TestSequences/InitialLocationDefaultKey';
import PushNewLocation from './TestSequences/PushNewLocation';
import PushSamePath from './TestSequences/PushSamePath';
import PushState from './TestSequences/PushState';
import PushMissingPathname from './TestSequences/PushMissingPathname';
import PushRelativePathnameWarning from './TestSequences/PushRelativePathnameWarning';
import ReplaceNewLocation from './TestSequences/ReplaceNewLocation';
import ReplaceSamePath from './TestSequences/ReplaceSamePath';
import ReplaceState from './TestSequences/ReplaceState';
import EncodedReservedCharacters from './TestSequences/EncodedReservedCharacters';
import GoBack from './TestSequences/GoBack';
import GoForward from './TestSequences/GoForward';
import BlockEverything from './TestSequences/BlockEverything';
import BlockPopWithoutListening from './TestSequences/BlockPopWithoutListening';
import type { HashHistory } from 'history';

// TODO: Do we still need this?
// const canGoWithoutReload = window.navigator.userAgent.indexOf('Firefox') === -1;
// const describeGo = canGoWithoutReload ? describe : describe.skip;

describe('a hash history', () => {
  let history:HashHistory;
  beforeEach(() => {
    window.history.replaceState(null, null as any as string, '#/'); // FIXME: type
    history = createHashHistory();
  });

  it('knows how to create hrefs from location objects', () => {
    const href = history.createHref({
      pathname: '/the/path',
      search: '?the=query',
      hash: '#the-hash'
    });

    expect(href).toEqual('#/the/path?the=query#the-hash');
  });

  it('knows how to create hrefs from strings', () => {
    const href = history.createHref('/the/path?the=query#the-hash');
    expect(href).toEqual('#/the/path?the=query#the-hash');
  });

  it('does not encode the generated path', () => {
    const encodedHref = history.createHref({
      pathname: '/%23abc'
    });
    expect(encodedHref).toEqual('#/%23abc');

    const unencodedHref = history.createHref({
      pathname: '/#abc'
    });
    expect(unencodedHref).toEqual('#/#abc');
  });

  describe('listen', () => {
    it('does not immediately call listeners', done => {
      Listen(history, done);
    });
  });

  describe('the initial location', () => {
    it('has the "default" key', done => {
      InitialLocationDefaultKey(history, done);
    });
  });

  describe('push a new path', () => {
    it('calls change listeners with the new location', done => {
      PushNewLocation(history, done);
    });
  });

  describe('push the same path', () => {
    it('calls change listeners with the new location', done => {
      PushSamePath(history, done);
    });
  });

  describe('push state', () => {
    it('calls change listeners with the new location', done => {
      PushState(history, done);
    });
  });

  describe('push with no pathname', () => {
    it('reuses the current location pathname', done => {
      PushMissingPathname(history, done);
    });
  });

  describe('push with a relative pathname', () => {
    it('issues a warning', done => {
      PushRelativePathnameWarning(history, done);
    });
  });

  describe('replace a new path', () => {
    it('calls change listeners with the new location', done => {
      ReplaceNewLocation(history, done);
    });
  });

  describe('replace the same path', () => {
    it('calls change listeners with the new location', done => {
      ReplaceSamePath(history, done);
    });
  });

  describe('replace state', () => {
    it('calls change listeners with the new location', done => {
      ReplaceState(history, done);
    });
  });

  describe('location created with encoded/unencoded reserved characters', () => {
    it('produces different location objects', done => {
      EncodedReservedCharacters(history, done);
    });
  });

  describe('back', () => {
    it('calls change listeners with the previous location', done => {
      GoBack(history, done);
    });
  });

  describe('forward', () => {
    it('calls change listeners with the next location', done => {
      GoForward(history, done);
    });
  });

  describe('block', () => {
    it('blocks all transitions', done => {
      BlockEverything(history, done);
    });
  });

  describe('block a POP without listening', () => {
    it('receives the next location and action as arguments', done => {
      BlockPopWithoutListening(history, done);
    });
  });
});
