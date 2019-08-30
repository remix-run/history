import expect from 'expect';
import { createHashHistory } from 'history';

import * as TestSequences from './TestSequences/index.js';

describe('a hash history with "slash" path coding', () => {
  beforeEach(() => {
    if (window.location.hash !== '#/') {
      window.location.hash = '/';
    }
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

  it('properly encodes and decodes window.location.hash', done => {
    const history = createHashHistory({ hashType: 'slash' });
    TestSequences.SlashHashPathCoding(history, done);
  });
});

describe('a hash history with "hashbang" path coding', () => {
  beforeEach(() => {
    if (window.location.hash !== '#!/') {
      window.location.hash = '!/';
    }
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

  it('properly encodes and decodes window.location.hash', done => {
    const history = createHashHistory({ hashType: 'hashbang' });
    TestSequences.HashbangHashPathCoding(history, done);
  });
});

describe('a hash history with "noslash" path coding', () => {
  beforeEach(() => {
    if (window.location.hash !== '') {
      window.location.hash = '';
    }
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

  it('properly encodes and decodes window.location.hash', done => {
    const history = createHashHistory({ hashType: 'noslash' });
    TestSequences.NoslashHashPathCoding(history, done);
  });
});
