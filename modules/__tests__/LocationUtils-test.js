import expect from 'expect';

import { createLocation } from 'history';

function DEFAULT_TRANSFORM_PATHNAME(pathname) {
  return pathname;
}

describe('createLocation', () => {
  describe('with a full path', () => {
    describe('given as a string', () => {
      it('has the correct properties', () => {
        expect(createLocation('/the/path?the=query#the-hash', DEFAULT_TRANSFORM_PATHNAME)).toMatchObject({
          pathname: '/the/path',
          search: '?the=query',
          hash: '#the-hash'
        });
      });
    });

    describe('given as an object', () => {
      it('has the correct properties', () => {
        expect(
          createLocation({
            pathname: '/the/path',
            search: '?the=query',
            hash: '#the-hash'
          }, DEFAULT_TRANSFORM_PATHNAME)
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
        expect(createLocation('the/path?the=query#the-hash', DEFAULT_TRANSFORM_PATHNAME)).toMatchObject({
          pathname: 'the/path',
          search: '?the=query',
          hash: '#the-hash'
        });
      });
    });

    describe('given as an object', () => {
      it('has the correct properties', () => {
        expect(
          createLocation({
            pathname: 'the/path',
            search: '?the=query',
            hash: '#the-hash'
          }, DEFAULT_TRANSFORM_PATHNAME)
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
        expect(createLocation('?the=query#the-hash', DEFAULT_TRANSFORM_PATHNAME)).toMatchObject({
          pathname: '/',
          search: '?the=query',
          hash: '#the-hash'
        });
      });
    });

    describe('given as an object', () => {
      it('has the correct properties', () => {
        expect(
          createLocation({ search: '?the=query', hash: '#the-hash' }, DEFAULT_TRANSFORM_PATHNAME)
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
        expect(createLocation('/the/path#the-hash', DEFAULT_TRANSFORM_PATHNAME)).toMatchObject({
          pathname: '/the/path',
          search: '',
          hash: '#the-hash'
        });
      });
    });

    describe('given as an object', () => {
      it('has the correct properties', () => {
        expect(
          createLocation({ pathname: '/the/path', hash: '#the-hash' }, DEFAULT_TRANSFORM_PATHNAME)
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
        expect(createLocation('/the/path?the=query', DEFAULT_TRANSFORM_PATHNAME)).toMatchObject({
          pathname: '/the/path',
          search: '?the=query',
          hash: ''
        });
      });
    });

    describe('given as an object', () => {
      it('has the correct properties', () => {
        expect(
          createLocation({ pathname: '/the/path', search: '?the=query' }, DEFAULT_TRANSFORM_PATHNAME)
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
      const location = createLocation('/the/path', DEFAULT_TRANSFORM_PATHNAME, undefined, 'key');
      expect(Object.keys(location)).toContain('key');
    });

    it('has no key property if no key is provided', () => {
      const location = createLocation('/the/path', DEFAULT_TRANSFORM_PATHNAME);
      expect(Object.keys(location)).not.toContain('key');
    });
  });
});
