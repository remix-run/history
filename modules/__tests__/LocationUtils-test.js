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
          pathname: '',
          search: '?the=query',
          hash: '#the-hash'
        })
      })
    })

    describe('given as an object', () => {
      it('has the correct properties', () => {
        expect(createLocation({ search: '?the=query', hash: '#the-hash' })).toMatch({
          pathname: '',
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

  describe('with a current location', () => {
    const currentLocation = {
      pathname: '/The/Old/Path',
      search: '?theQuery',
      hash: '#fragment'
    };

    describe('can resolve a relative pathname', () => {
      describe('without any dots', () => {
        it('has the correct properties', () => {
          expect(createLocation('new/path', undefined, undefined, currentLocation)).toMatch({
            pathname: '/The/Old/new/path',
            search: '',
            hash: ''
          })
        })
      })
      describe('with a leading dot', () => {
        it('has the correct properties', () => {
          expect(createLocation('./new/path', undefined, undefined, currentLocation)).toMatch({
            pathname: '/The/Old/new/path',
            search: '',
            hash: ''
          })
        })
      })
      describe('with two leading dots', () => {
        it('has the correct properties', () => {
          expect(createLocation('../new/path', undefined, undefined, currentLocation)).toMatch({
            pathname: '/The/new/path',
            search: '',
            hash: ''
          })
        })
      })
    })
    describe('can resolve a relative query', () => {
      it('has the correct properties', () => {
        expect(createLocation('?newquery', undefined, undefined, currentLocation)).toMatch({
          pathname: '/The/Old/Path',
          search: '?newquery',
          hash: ''
        })
      })
    })
    describe('can resolve a relative fragment', () => {
      it('has the correct properties', () => {
        expect(createLocation('#foo', undefined, undefined, currentLocation)).toMatch({
          pathname: '/The/Old/Path',
          search: '?theQuery',
          hash: '#foo'
        })
      })
    })
  })
})
