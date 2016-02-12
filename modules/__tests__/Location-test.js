import expect from 'expect'
import createHistory from '../createHistory'
import createLocation from '../createLocation'
import { POP } from '../Actions'

describe('a location', function () {
  it('knows its pathname', function () {
    const location = createLocation('/home?the=query#the-hash')
    expect(location.pathname).toEqual('/home')
  })

  it('knows its search string', function () {
    const location = createLocation('/home?the=query#the-hash')
    expect(location.search).toEqual('?the=query')
  })

  it('knows its hash', function () {
    const location = createLocation('/home?the=query#the-hash')
    expect(location.hash).toEqual('#the-hash')
  })

  it('compensates if the location is fully qualified', function () {
    const location = createLocation('https://example.com/home')
    expect(location.pathname).toEqual('/home')
  })

  it('does not strip URL-like strings in the query', function () {
    const location = createLocation('/home?redirect=https://example.com/')
    expect(location.pathname).toEqual('/home')
    expect(location.search).toEqual('?redirect=https://example.com/')
  })

  it('has null state by default', function () {
    const location = createLocation()
    expect(location.state).toBe(null)
  })

  it('uses pop navigation by default', function () {
    const location = createLocation()
    expect(location.action).toBe(POP)
  })

  it('has a null key by default', function () {
    const location = createLocation()
    expect(location.key).toBe(null)
  })

  describe('created by a history object', function () {
    let history
    beforeEach(function () {
      history = createHistory()
    })

    it('has a key by default', function () {
      const location = history.createLocation()
      expect(location.key).toExist()
    })
  })
})

describe('creating a location with an object', function () {
  it('puts the pathname, search, and hash in the proper order', function () {
    const location = createLocation({
      pathname: '/the/path',
      search: '?the=query',
      hash: '#the-hash'
    })

    expect(location.pathname).toEqual('/the/path')
    expect(location.search).toEqual('?the=query')
    expect(location.hash).toEqual('#the-hash')
  })
})
