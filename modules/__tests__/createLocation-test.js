import expect from 'expect';
import { createLocation } from 'history';

describe('createLocation', () => {
  describe('with a full path', () => {
    describe('given as a string', () => {
      it('has the correct properties', () => {
        expect(createLocation('/the/path?the=query#the-hash')).toMatchObject({
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
        expect(createLocation('the/path?the=query#the-hash')).toMatchObject({
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
        expect(createLocation('?the=query#the-hash')).toMatchObject({
          pathname: '/',
          search: '?the=query',
          hash: '#the-hash'
        });
      });
    });

    describe('given as an object', () => {
      it('has the correct properties', () => {
        expect(
          createLocation({ search: '?the=query', hash: '#the-hash' })
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
        expect(createLocation('/the/path#the-hash')).toMatchObject({
          pathname: '/the/path',
          search: '',
          hash: '#the-hash'
        });
      });
    });

    describe('given as an object', () => {
      it('has the correct properties', () => {
        expect(
          createLocation({ pathname: '/the/path', hash: '#the-hash' })
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
        expect(createLocation('/the/path?the=query')).toMatchObject({
          pathname: '/the/path',
          search: '?the=query',
          hash: ''
        });
      });
    });

    describe('given as an object', () => {
      it('has the correct properties', () => {
        expect(
          createLocation({ pathname: '/the/path', search: '?the=query' })
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
      const location = createLocation('/the/path', undefined, 'key');
      expect(Object.keys(location)).toContain('key');
    });

    it('has no key property if no key is provided', () => {
      const location = createLocation('/the/path');
      expect(Object.keys(location)).not.toContain('key');
    });
  });

  describe('with embedded double-slashes (security fix for CVE-2025-68470)', () => {
    describe('given as a string', () => {
      it('normalizes double slashes at the start to prevent open redirect', () => {
        expect(createLocation('//evil.com/path')).toMatchObject({
          pathname: '/evil.com/path',
          search: '',
          hash: ''
        });
      });

      it('normalizes double slashes in the middle of the path', () => {
        expect(createLocation('/the//path')).toMatchObject({
          pathname: '/the/path',
          search: '',
          hash: ''
        });
      });

      it('normalizes multiple consecutive slashes', () => {
        expect(createLocation('///the////path///segment')).toMatchObject({
          pathname: '/the/path/segment',
          search: '',
          hash: ''
        });
      });

      it('normalizes double slashes while preserving search and hash', () => {
        expect(createLocation('//evil.com/path?query=value#hash')).toMatchObject({
          pathname: '/evil.com/path',
          search: '?query=value',
          hash: '#hash'
        });
      });

      it('handles protocol-relative URLs that could redirect externally', () => {
        expect(createLocation('//attacker.com')).toMatchObject({
          pathname: '/attacker.com',
          search: '',
          hash: ''
        });
      });
    });

    describe('given as an object', () => {
      it('normalizes double slashes at the start to prevent open redirect', () => {
        expect(
          createLocation({
            pathname: '//evil.com/path',
            search: '?the=query',
            hash: '#the-hash'
          })
        ).toMatchObject({
          pathname: '/evil.com/path',
          search: '?the=query',
          hash: '#the-hash'
        });
      });

      it('normalizes double slashes in the middle of the path', () => {
        expect(
          createLocation({
            pathname: '/the//path',
            search: '?the=query',
            hash: '#the-hash'
          })
        ).toMatchObject({
          pathname: '/the/path',
          search: '?the=query',
          hash: '#the-hash'
        });
      });

      it('normalizes multiple consecutive slashes', () => {
        expect(
          createLocation({
            pathname: '///the////path'
          })
        ).toMatchObject({
          pathname: '/the/path',
          search: '',
          hash: ''
        });
      });
    });

    describe('paths without double slashes', () => {
      it('does not modify normal paths', () => {
        expect(createLocation('/normal/path')).toMatchObject({
          pathname: '/normal/path',
          search: '',
          hash: ''
        });
      });

      it('does not modify paths with single slashes', () => {
        expect(createLocation('/path/to/resource')).toMatchObject({
          pathname: '/path/to/resource',
          search: '',
          hash: ''
        });
      });
    });
  });
});
