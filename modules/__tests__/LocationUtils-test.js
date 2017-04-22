import expect from 'expect'
import { createLocation } from '../LocationUtils'

describe('createLocation', () => {
  describe('with a full path', () => {
    describe('given as a string', () => {
      it('has the correct properties', () => {
        expect(createLocation('/the/path?the=query#the-hash')).toMatch({
          pathname: '/the/path',
          search: '?the=query',
          hash: '#the-hash'
        })
      })
    })

    describe('given as an object', () => {
      it('has the correct properties', () => {
        expect(createLocation({ pathname: '/the/path', search: '?the=query', hash: '#the-hash' })).toMatch({
          pathname: '/the/path',
          search: '?the=query',
          hash: '#the-hash'
        })
      })
    })
  })

  describe('with a relative path', () => {
    describe('given as a string', () => {
      it('has the correct properties', () => {
        expect(createLocation('the/path?the=query#the-hash')).toMatch({
          pathname: 'the/path',
          search: '?the=query',
          hash: '#the-hash'
        })
      })
    })

    describe('given as an object', () => {
      it('has the correct properties', () => {
        expect(createLocation({ pathname: 'the/path', search: '?the=query', hash: '#the-hash' })).toMatch({
          pathname: 'the/path',
          search: '?the=query',
          hash: '#the-hash'
        })
      })
    })
  })

  describe('with a path with no pathname', () => {
    describe('given as a string', () => {
      it('has the correct properties', () => {
        expect(createLocation('?the=query#the-hash')).toMatch({
          pathname: '/',
          search: '?the=query',
          hash: '#the-hash'
        })
      })
    })

    describe('given as an object', () => {
      it('has the correct properties', () => {
        expect(createLocation({ search: '?the=query', hash: '#the-hash' })).toMatch({
          pathname: '/',
          search: '?the=query',
          hash: '#the-hash'
        })
      })
    })
  })

  describe('with a path with no search', () => {
    describe('given as a string', () => {
      it('has the correct properties', () => {
        expect(createLocation('/the/path#the-hash')).toMatch({
          pathname: '/the/path',
          search: '',
          hash: '#the-hash'
        })
      })
    })

    describe('given as an object', () => {
      it('has the correct properties', () => {
        expect(createLocation({ pathname: '/the/path', hash: '#the-hash' })).toMatch({
          pathname: '/the/path',
          search: '',
          hash: '#the-hash'
        })
      })
    })
  })

  describe('with a path with no hash', () => {
    describe('given as a string', () => {
      it('has the correct properties', () => {
        expect(createLocation('/the/path?the=query')).toMatch({
          pathname: '/the/path',
          search: '?the=query',
          hash: ''
        })
      })
    })

    describe('given as an object', () => {
      it('has the correct properties', () => {
        expect(createLocation({ pathname: '/the/path', search: '?the=query' })).toMatch({
          pathname: '/the/path',
          search: '?the=query',
          hash: ''
        })
      })
    })
  })

  describe('with a path that cannot be decoded', () => {
    let consoleError = console.error // eslint-disable-line no-console
    let warningMessage

    beforeEach(() => {
      console.error = (message) => { // eslint-disable-line no-console
        warningMessage = message
      }
    })

    afterEach(() => {
      console.error = consoleError // eslint-disable-line no-console
    })

    describe('given as a string', () => {
      it('does not throw when decodeURI throws a URIError, but logs warning', () => {
        expect(() => {
          createLocation('/test%')
          expect(warningMessage).toBe(
            'Warning: Pathname "/test%" could not be decoded. ' +
            'Location\'s pathname will be encoded.'
          )
        }).toNotThrow()
      })

      it('sets pathname to be encoded string', () => {
        const location = createLocation('/test%')
        expect(location).toMatch({ pathname: '/test%' })
      })
    })

    describe('given as an object', () => {
      it('does not throw when decodeURI throws a URIError, but logs warning', () => {
        expect(() => {
          createLocation({ pathname: '/test%' })
          expect(warningMessage).toBe(
            'Warning: Pathname "/test%" could not be decoded. ' +
            'Location\'s pathname will be encoded.'
          )
        }).toNotThrow()
      })

      it('sets pathname to be encoded string', () => {
        const location = createLocation({ pathname: '/test%' })
        expect(location).toMatch({ pathname: '/test%' })
      })
    })
  })

  describe('key', () => {
    it('has a key property if a key is provided', () => {
      const location = createLocation('/the/path', undefined, 'key')
      expect(location).toIncludeKey('key')
    })

    it('has no key property if no key is provided', () => {
      const location = createLocation('/the/path')
      expect(location).toExcludeKey('key')
    })
  })
})
