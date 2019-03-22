import expect from 'expect';

import { createBrowserHistory, createHashHistory, createMemoryHistory } from 'history';

[createBrowserHistory, createHashHistory, createMemoryHistory].forEach(h => {
  describe(`${h.name} createLocation`, () => {
    const history = h();

    describe('with a full path', () => {
      describe('given as a string', () => {
        it('has the correct properties', () => {
          expect(history.createLocation('/the/path?the=query#the-hash')).toMatchObject({
            pathname: '/the/path',
            search: '?the=query',
            hash: '#the-hash'
          });
        });
      });
  
      describe('given as an object', () => {
        it('has the correct properties', () => {
          expect(
            history.createLocation({
              pathname: '/the/path',
              search: '?the=query',
              hash: '#the-hash'
            })
          ).toMatchObject({
            pathname: '/the/path',
            search: '?the=query',
            hash: '#the-hash'
          });
        });
      });
    });
  
    describe('with a relative path', () => {
      describe('given as a string', () => {
        it('has the correct properties', () => {
          expect(history.createLocation('the/path?the=query#the-hash')).toMatchObject({
            pathname: 'the/path',
            search: '?the=query',
            hash: '#the-hash'
          });
        });
      });
  
      describe('given as an object', () => {
        it('has the correct properties', () => {
          expect(
            history.createLocation({
              pathname: 'the/path',
              search: '?the=query',
              hash: '#the-hash'
            })
          ).toMatchObject({
            pathname: 'the/path',
            search: '?the=query',
            hash: '#the-hash'
          });
        });
      });
    });
  
    describe('with a path with no pathname', () => {
      describe('given as a string', () => {
        it('has the correct properties', () => {
          expect(history.createLocation('?the=query#the-hash')).toMatchObject({
            pathname: '/',
            search: '?the=query',
            hash: '#the-hash'
          });
        });
      });
  
      describe('given as an object', () => {
        it('has the correct properties', () => {
          expect(
            history.createLocation({ search: '?the=query', hash: '#the-hash' })
          ).toMatchObject({
            pathname: '/',
            search: '?the=query',
            hash: '#the-hash'
          });
        });
      });
    });
  
    describe('with a path with no search', () => {
      describe('given as a string', () => {
        it('has the correct properties', () => {
          expect(history.createLocation('/the/path#the-hash')).toMatchObject({
            pathname: '/the/path',
            search: '',
            hash: '#the-hash'
          });
        });
      });
  
      describe('given as an object', () => {
        it('has the correct properties', () => {
          expect(
            history.createLocation({ pathname: '/the/path', hash: '#the-hash' })
          ).toMatchObject({
            pathname: '/the/path',
            search: '',
            hash: '#the-hash'
          });
        });
      });
    });
  
    describe('with a path with no hash', () => {
      describe('given as a string', () => {
        it('has the correct properties', () => {
          expect(history.createLocation('/the/path?the=query')).toMatchObject({
            pathname: '/the/path',
            search: '?the=query',
            hash: ''
          });
        });
      });
  
      describe('given as an object', () => {
        it('has the correct properties', () => {
          expect(
            history.createLocation({ pathname: '/the/path', search: '?the=query' })
          ).toMatchObject({
            pathname: '/the/path',
            search: '?the=query',
            hash: ''
          });
        });
      });
    });
  
    describe('key', () => {
      it('has a key property if a key is provided', () => {
        const location = history.createLocation('/the/path', undefined, 'key');
        expect(Object.keys(location)).toContain('key');
      });
  
      it('has no key property if no key is provided', () => {
        const location = history.createLocation('/the/path');
        expect(Object.keys(location)).not.toContain('key');
      });
    });
  });
});
