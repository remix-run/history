import expect from 'expect'
import createLocationProvider from '../createLocationProvider'
import useBasename from '../useBasename'
import useQueries from '../useQueries'

describe('a location provider', function () {
  const locationProvider = createLocationProvider()

  it('creates locations', function () {
    const location = locationProvider.createLocation('/foo?q=baz#bar')

    expect(location.pathname).toEqual('/foo')
    expect(location.search).toEqual('?q=baz')
    expect(location.hash).toEqual('#bar')
  })

  it('creates paths', function () {
    expect(
      locationProvider.createPath({
        pathname: '/foo',
        hash: '#bar',
        search: '?q=baz'
      })
    ).toEqual('/foo?q=baz#bar')
  })

  it('creates hrefs', function () {
    expect(
      locationProvider.createHref({
        pathname: '/foo',
        hash: '#bar',
        search: '?q=baz'
      })
    ).toEqual('/foo?q=baz#bar')
  })

  describe('useBasename', function () {
    const locationProvider = useBasename(createLocationProvider())({
      basename: '/bar'
    })

    it('creates locations with the basename', function () {
      const location = locationProvider.createLocation('/foo')

      expect(location.pathname).toEqual('/foo')
      expect(location.basename).toEqual('/bar')
    })

    it('creates paths with the basename', function () {
      expect(
        locationProvider.createPath('/foo')
      ).toEqual('/bar/foo')
    })

    it('creates hrefs with the basename', function () {
      expect(
        locationProvider.createHref('/foo')
      ).toEqual('/bar/foo')
    })
  })

  describe('useQueries', function () {
    const locationProvider = useQueries(createLocationProvider())()

    it('creates locations with queries', function () {
      const location = locationProvider.createLocation('/foo?bar=baz')

      expect(location.pathname).toEqual('/foo')
      expect(location.query).toEqual({ bar: 'baz' })
    })

    it('creates paths with queries', function () {
      expect(
        locationProvider.createPath({
          pathname: '/foo',
          query: { bar: 'baz' }
        })
      ).toEqual('/foo?bar=baz')
    })

    it('creates hrefs with queries', function () {
      expect(
        locationProvider.createHref({
          pathname: '/foo',
          query: { bar: 'baz' }
        })
      ).toEqual('/foo?bar=baz')
    })
  })
})
