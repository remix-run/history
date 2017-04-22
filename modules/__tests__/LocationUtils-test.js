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

    describe('given as a string', () => {
      it('throws custom message when decodeURI throws a URIError', () => {
        expect(() => {
          createLocation('/test%')
        }).toThrow('Pathname "/test%" could not be decoded.')
      })
    })

    describe('given as an object', () => {
      it('throws custom message when decodeURI throws a URIError', () => {
        expect(() => {
          createLocation({ pathname: '/test%' })
        }).toThrow('Pathname "/test%" could not be decoded.')
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
