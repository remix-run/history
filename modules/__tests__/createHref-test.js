import expect from 'expect'
import createBrowserHistory from '../createBrowserHistory'
import createHashHistory from '../createHashHistory'
import createMemoryHistory from '../createMemoryHistory'

describe('a browser history', () => {
  describe('with no basename', () => {
    let history
    beforeEach(() => {
      history = createBrowserHistory()
    })

    it('knows how to create hrefs', () => {
      const href = history.createHref({
        pathname: '/the/path',
        search: '?the=query',
        hash: '#the-hash'
      })

      expect(href).toEqual('/the/path?the=query#the-hash')
    })

    it('creates href with root pathname, search and hash', () => {
      const href = history.createHref({
        pathname: '/',
        search: '?the=query',
        hash: '#the-hash'
      })

      expect(href).toEqual('/?the=query#the-hash')
    })

    it('creates href with root pathname', () => {
      const href = history.createHref({
        pathname: '/'
      })

      expect(href).toEqual('/')
    })
  })

  describe('with a basename', () => {
    let history
    beforeEach(() => {
      history = createBrowserHistory({ basename: '/the/base' })
    })

    it('knows how to create hrefs', () => {
      const href = history.createHref({
        pathname: '/the/path',
        search: '?the=query',
        hash: '#the-hash'
      })

      expect(href).toEqual('/the/base/the/path?the=query#the-hash')
    })

    it('creates href with root pathname, search and query', () => {
      const href = history.createHref({
        pathname: '/',
        search: '?the=query',
        hash: '#the-hash'
      })

      expect(href).toEqual('/the/base?the=query#the-hash')
    })

    it('creates href with root pathname', () => {
      const href = history.createHref({
        pathname: '/'
      })

      expect(href).toEqual('/the/base')
    })
  })

  describe('with a bad basename', () => {
    let history
    beforeEach(() => {
      history = createBrowserHistory({ basename: '/the/bad/base/' })
    })

    it('knows how to create hrefs', () => {
      const href = history.createHref({
        pathname: '/the/path',
        search: '?the=query',
        hash: '#the-hash'
      })

      expect(href).toEqual('/the/bad/base/the/path?the=query#the-hash')
    })

    it('creates href with root pathname, search and query', () => {
      const href = history.createHref({
        pathname: '/',
        search: '?the=query',
        hash: '#the-hash'
      })

      expect(href).toEqual('/the/bad/base?the=query#the-hash')
    })

    it('creates href with root pathname', () => {
      const href = history.createHref({
        pathname: '/'
      })

      expect(href).toEqual('/the/bad/base')
    })
  })

  describe('with a slash basename', () => {
    let history
    beforeEach(() => {
      history = createBrowserHistory({ basename: '/' })
    })

    it('knows how to create hrefs', () => {
      const href = history.createHref({
        pathname: '/the/path',
        search: '?the=query',
        hash: '#the-hash'
      })

      expect(href).toEqual('/the/path?the=query#the-hash')
    })

    it('creates href with root pathname, search and query', () => {
      const href = history.createHref({
        pathname: '/',
        search: '?the=query',
        hash: '#the-hash'
      })

      expect(href).toEqual('/?the=query#the-hash')
    })

    it('creates href with root pathname', () => {
      const href = history.createHref({
        pathname: '/'
      })

      expect(href).toEqual('/')
    })
  })

  describe('with a unicode location', () => {
    let history
    beforeEach(() => {
      history = createBrowserHistory({ basename: '/' })
    })

    it('encodes the pathname', () => {
      const href = history.createHref({
        pathname: '/歴史'
      })

      expect(href).toEqual('/%E6%AD%B4%E5%8F%B2')
    })

    it('does not encode the hash', () => {
      const href = history.createHref({
        pathname: '/',
        hash: '#ハッシュ'
      })

      expect(href).toEqual('/#ハッシュ')
    })

    it('does not encode the search string', () => {
      const href = history.createHref({
        pathname: '/',
        search: '?キー=値'
      })

      expect(href).toEqual('/?キー=値')
    })
  })
})

describe('a hash history', () => {
  describe('with default encoding', () => {
    let history
    beforeEach(() => {
      history = createHashHistory()
    })

    it('knows how to create hrefs', () => {
      const href = history.createHref({
        pathname: '/the/path',
        search: '?the=query',
        hash: '#the-hash'
      })

      expect(href).toEqual('#/the/path?the=query#the-hash')
    })
  })

  describe('with hashType="noslash"', () => {
    let history
    beforeEach(() => {
      history = createHashHistory({ hashType: 'noslash' })
    })

    it('knows how to create hrefs', () => {
      const href = history.createHref({
        pathname: '/the/path',
        search: '?the=query',
        hash: '#the-hash'
      })

      expect(href).toEqual('#the/path?the=query#the-hash')
    })
  })

  describe('with hashType="hashbang"', () => {
    let history
    beforeEach(() => {
      history = createHashHistory({ hashType: 'hashbang' })
    })

    it('knows how to create hrefs', () => {
      const href = history.createHref({
        pathname: '/the/path',
        search: '?the=query',
        hash: '#the-hash'
      })

      expect(href).toEqual('#!/the/path?the=query#the-hash')
    })
  })

  describe('with a basename', () => {
    let history
    beforeEach(() => {
      history = createHashHistory({ basename: '/the/base' })
    })

    it('knows how to create hrefs', () => {
      const href = history.createHref({
        pathname: '/the/path',
        search: '?the=query'
      })

      expect(href).toEqual('#/the/base/the/path?the=query')
    })
  })

  describe('with a bad basename', () => {
    let history
    beforeEach(() => {
      history = createHashHistory({ basename: '/the/bad/base/' })
    })

    it('knows how to create hrefs', () => {
      const href = history.createHref({
        pathname: '/the/path',
        search: '?the=query'
      })

      expect(href).toEqual('#/the/bad/base/the/path?the=query')
    })
  })

  describe('with a slash basename', () => {
    let history
    beforeEach(() => {
      history = createHashHistory({ basename: '/' })
    })

    it('knows how to create hrefs', () => {
      const href = history.createHref({
        pathname: '/the/path',
        search: '?the=query'
      })

      expect(href).toEqual('#/the/path?the=query')
    })
  })

  describe('with a unicode location', () => {
    let history
    beforeEach(() => {
      history = createHashHistory({ basename: '/' })
    })

    it('encodes the pathname', () => {
      const href = history.createHref({
        pathname: '/歴史'
      })

      const pathname = '/%E6%AD%B4%E5%8F%B2'
      expect(href).toEqual('#' + pathname)
    })

    it('does not encode the hash', () => {
      const href = history.createHref({
        pathname: '/',
        hash: '#ハッシュ'
      })

      const hash = '#ハッシュ'
      expect(href).toEqual('#/' + hash)
    })

    it('does not encode the search string', () => {
      const href = history.createHref({
        pathname: '/',
        search: '?キー=値'
      })

      const search = '?キー=値'
      expect(href).toEqual('#/' + search)
    })
  })
})

describe('a memory history', () => {
  let history
  beforeEach(() => {
    history = createMemoryHistory()
  })

  it('knows how to create hrefs', () => {
    const href = history.createHref({
      pathname: '/the/path',
      search: '?the=query',
      hash: '#the-hash'
    })

    expect(href).toEqual('/the/path?the=query#the-hash')
  })

  describe('with a unicode location', () => {
    let history
    beforeEach(() => {
      history = createMemoryHistory()
    })

    it('encodes the pathname', () => {
      const href = history.createHref({
        pathname: '/歴史'
      })

      expect(href).toEqual('/%E6%AD%B4%E5%8F%B2')
    })

    it('does not encode the hash', () => {
      const href = history.createHref({
        pathname: '/',
        hash: '#ハッシュ'
      })

      expect(href).toEqual('/#ハッシュ')
    })

    it('does not encode the search string', () => {
      const href = history.createHref({
        pathname: '/',
        search: '?キー=値'
      })

      expect(href).toEqual('/?キー=値')
    })
  })
})
