import expect from 'expect'
import {
  addQueryStringValueToPath,
  getQueryStringValueFromPath,
  stripQueryStringValueFromPath,
  createPath
} from '../PathUtils'

describe('addQueryStringValueToPath', () => {
  describe('when the path has no query string', () => {
    it('creates a new query string', () => {
      expect(addQueryStringValueToPath('/a/b/c', 'key', 'value')).toEqual('/a/b/c?key=value')
    })
  })

  describe('when the path has a query string', () => {
    it('appends to the existing query string', () => {
      expect(addQueryStringValueToPath('/a/b/c?a=b', 'key', 'value'))
        .toEqual('/a/b/c?a=b&key=value')
    })
  })

  describe('when the path has a hash', () => {
    describe('but no query string', () => {
      it('creates a new query string', () => {
        expect(addQueryStringValueToPath('/a/b/c#the-hash', 'key', 'value'))
          .toEqual('/a/b/c?key=value#the-hash')
      })
    })

    describe('and a query string', () => {
      it('appends to the existing query string', () => {
        expect(addQueryStringValueToPath('/a/b/c?a=b#the-hash', 'key', 'value'))
          .toEqual('/a/b/c?a=b&key=value#the-hash')
      })
    })
  })
})

describe('stripQueryStringValueFromPath', () => {
  describe('when the path has no query string', () => {
    it('returns the same path', () => {
      const path = '/a/b/c'
      expect(stripQueryStringValueFromPath(path, 'key')).toEqual(path)
    })
  })

  describe('when the path has a query string with no matching key', () => {
    it('returns the same path', () => {
      const path = '/a/b/c?a=b'
      expect(stripQueryStringValueFromPath(path, 'key')).toEqual(path)
    })
  })

  describe('when the path has a query string with a matching key', () => {
    it('removes the key/value pair', () => {
      expect(
        stripQueryStringValueFromPath('/a/b/c?key=value&a=b', 'key')
      ).toEqual('/a/b/c?a=b')

      expect(
        stripQueryStringValueFromPath('/a/b/c?a=b&key=value', 'key')
      ).toEqual('/a/b/c?a=b')

      expect(
        stripQueryStringValueFromPath('/a/b/c?a=b&key=value&c=d', 'key')
      ).toEqual('/a/b/c?a=b&c=d')
    })
  })

  describe('when the path has a query string with only that matching key', () => {
    it('removes the entire query string', () => {
      expect(stripQueryStringValueFromPath('/a/b/c?key=value', 'key')).toEqual('/a/b/c')
    })
  })

  describe('when the path has a hash', () => {
    describe('but no query string', () => {
      it('returns the same path', () => {
        expect(stripQueryStringValueFromPath('/a/b/c#the-hash')).toEqual('/a/b/c#the-hash')
      })
    })

    describe('and a query string with a matching key', () => {
      it('removes the key/value pair', () => {
        expect(
          stripQueryStringValueFromPath('/a/b/c?key=value&a=b#the-hash', 'key')
        ).toEqual('/a/b/c?a=b#the-hash')

        expect(
          stripQueryStringValueFromPath('/a/b/c?a=b&key=value&c=d#the-hash', 'key')
        ).toEqual('/a/b/c?a=b&c=d#the-hash')
      })
    })
  })
})

describe('getQueryStringValueFromPath', () => {
  describe('when the path has no query string', () => {
    it('returns null', () => {
      expect(getQueryStringValueFromPath('/a/b/c', 'key')).toBe(null)
    })
  })

  describe('when the path has a query string with a matching key', () => {
    it('returns the value for that key', () => {
      expect(getQueryStringValueFromPath('/a/b/c?a=b&c=value', 'c')).toBe('value')
    })
  })
})

describe('createPath', () => {
  describe('with a search of "?"', () => {
    it('omits the search entirely', () => {
      expect(
        createPath({
          pathname: '/a/b/c',
          search: '?',
          hash: '#the-hash'
        })
      ).toEqual('/a/b/c#the-hash')
    })
  })
})
