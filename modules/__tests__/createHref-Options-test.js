import expect from 'expect'
import createBrowserHistory from '../createBrowserHistory'
import createHashHistory from '../createHashHistory'

const createExpectation = (getLocation, getOverrideOptions) => (history, shouldHref) => {
  const href = history.createHref(getLocation(), getOverrideOptions && getOverrideOptions())
  expect(href).toEqual(shouldHref)
}

describe('when history is created with default trailing slash options', () => {
  describe('when history has a basename', () => {
    const basename = "/the/base"
    const testBrowserHistory = () => createBrowserHistory({ basename })
    const testHashHistory = () => createHashHistory({ basename })

    describe('when createHref is called with override basePath==true', () => {
      let overrideOptions
      beforeEach(() => {
        overrideOptions = {
          basePath: true
        }
      })

      describe('when location is root pathname', () => {
        let location
        beforeEach(() => {
          location = {
            pathname: '/'
          }
        })
        const expectation = createExpectation(() => location, () => overrideOptions)

        it('browser history uses override', () => {
          expectation(testBrowserHistory(), '/the/base/')
        })

        it('hash history uses override', () => {
          expectation(testHashHistory(), '#/the/base/')
        })
      })

      describe('when location is root pathname with search and query', () => {
        let location
        beforeEach(() => {
          location = {
            pathname: '/',
            search: '?the=query',
            hash: '#the-hash'
          }
        })
        const expectation = createExpectation(() => location, () => overrideOptions)

        it('browser history uses override setting', () => {
          expectation(testBrowserHistory(), '/the/base/?the=query#the-hash')
        })

        it('hash history uses override setting', () => {
          expectation(testHashHistory(), '#/the/base/?the=query#the-hash')
        })
      })
    })
  })

  describe('when history has no basename', () => {
    const testBrowserHistory = () => createBrowserHistory()
    const testHashHistory = () => createHashHistory()

    describe('when createHref is called with override enforcePolicy==true', () => {
      let overrideOptions
      beforeEach(() => {
        overrideOptions = {
          enforcePolicy: true
        }
      })

      describe('when location has pathname with no trailing slash', () => {
        let location
        beforeEach(() => {
          location = {
            pathname: '/the/path'
          }
        })
        const expectation = createExpectation(() => location, () => overrideOptions)

        it('browser history uses override setting', () => {
          expectation(testBrowserHistory(), '/the/path/')
        })

        it('hash history uses override setting', () => {
          expectation(testHashHistory(), '#/the/path/')
        })
      })

      describe('when location has pathname with no trailing slash, with search and hash', () => {
        let location
        beforeEach(() => {
          location = {
            pathname: '/the/path',
            search: '?the=query',
            hash: '#the-hash'
          }
        })
        const expectation = createExpectation(() => location, () => overrideOptions)

        it('browser history uses override setting', () => {
          expectation(testBrowserHistory(), '/the/path/?the=query#the-hash')
        })

        it('hash history uses override setting', () => {
          expectation(testHashHistory(), '#/the/path/?the=query#the-hash')
        })
      })
    })

    describe('when createHref is called with override enforcePolicy==false', () => {
      let overrideOptions
      beforeEach(() => {
        overrideOptions = {
          enforcePolicy: false
        }
      })

      describe('when location has pathname with trailing slash', () => {
        let location
        beforeEach(() => {
          location = {
            pathname: '/the/path/'
          }
        })
        const expectation = createExpectation(() => location, () => overrideOptions)

        it('browser history uses override setting', () => {
          expectation(testBrowserHistory(), '/the/path')
        })

        it('hash history uses override setting', () => {
          expectation(testHashHistory(), '#/the/path')
        })
      })

      describe('when location has pathname with trailing slash, with search and hash', () => {
        let location
        beforeEach(() => {
          location = {
            pathname: '/the/path/',
            search: '?the=query',
            hash: '#the-hash'
          }
        })
        const expectation = createExpectation(() => location, () => overrideOptions)

        it('browser history uses override setting', () => {
          expectation(testBrowserHistory(), '/the/path?the=query#the-hash')
        })

        it('hash history uses override setting', () => {
          expectation(testHashHistory(), '#/the/path?the=query#the-hash')
        })
      })
    })
  })
})

describe('when history is created with option to keep trailing slash on base path', () => {
  let ownOptions
  beforeEach(() => {
    ownOptions = {
      basePath: true
    }
  })

  describe('when history has a basename', () => {
    const basename = '/the/base'
    const testBrowserHistory = () => createBrowserHistory({
      basename,
      trailingSlashOptions: ownOptions
    })
    const testHashHistory = () => createHashHistory({
      basename,
      trailingSlashOptions: ownOptions
    })

    describe('when createHref is called without override options', () => {
      describe('when location is root pathname', () => {
        let location
        beforeEach(() => {
          location = {
            pathname: '/'
          }
        })
        const expectation = createExpectation(() => location)

        it('browser history uses its own options', () => {
          expectation(testBrowserHistory(), '/the/base/')
        })

        it('hash history uses its own options', () => {
          expectation(testHashHistory(), '#/the/base/')
        })
      })

      describe('when location is root pathname with search and hash', () => {
        let location
        beforeEach(() => {
          location = {
            pathname: '/',
            search: '?the=query',
            hash: '#the-hash'
          }
        })
        const expectation = createExpectation(() => location)

        it('browser history uses its own options', () => {
          expectation(testBrowserHistory(), '/the/base/?the=query#the-hash')
        })

        it('hash history uses its own options', () => {
          expectation(testHashHistory(), '#/the/base/?the=query#the-hash')
        })
      })
    })

    describe('when createHref is called with override option basePath==false', () => {
      let overrideOptions
      beforeEach(() => {
        overrideOptions = {
          basePath: false
        }
      })

      describe('when location is root pathname', () => {
        let location
        beforeEach(() => {
          location = {
            pathname: '/'
          }
        })
        const expectation = createExpectation(() => location, () => overrideOptions)

        it('browser history uses override setting', () => {
          expectation(testBrowserHistory(), '/the/base')
        })

        it('hash history uses override setting', () => {
          expectation(testHashHistory(), '#/the/base')
        })
      })

      describe('when location is root pathname with search and hash', () => {
        let location
        beforeEach(() => {
          location = {
            pathname: '/',
            search: '?the=query',
            hash: '#the-hash'
          }
        })
        const expectation = createExpectation(() => location, () => overrideOptions)

        it('browser history uses override setting', () => {
          expectation(testBrowserHistory(), '/the/base?the=query#the-hash')
        })

        it('hash history uses override setting', () => {
          expectation(testHashHistory(), '#/the/base?the=query#the-hash')
        })
      })
    })
  })
})

describe('when history is created with option to enforce trailing slashes on all paths', () => {
  let ownOptions
  beforeEach(() => {
    ownOptions = {
      enforcePolicy: true
    }
  })

  describe('when history has no basename', () => {
    const testBrowserHistory = () => createBrowserHistory({
      trailingSlashOptions: ownOptions
    })
    const testHashHistory = () => createHashHistory({
      trailingSlashOptions: ownOptions
    })

    describe('when createHref is called without override options', () => {
      describe('when location pathname has no trailing slash', () => {
        let location
        beforeEach(() => {
          location = {
            pathname: '/the/path'
          }
        })
        const expectation = createExpectation(() => location)

        it('browser history uses its own options', () => {
          expectation(testBrowserHistory(), '/the/path/')
        })

        it('hash history uses its own options', () => {
          expectation(testHashHistory(), '#/the/path/')
        })
      })

      describe('when location pathname has no trailing slash with search and hash', () => {
        let location
        beforeEach(() => {
          location = {
            pathname: '/the/path',
            search: '?the=query',
            hash: '#the-hash'
          }
        })
        const expectation = createExpectation(() => location)

        it('browser history uses its own options', () => {
          expectation(testBrowserHistory(), '/the/path/?the=query#the-hash')
        })

        it('hash history uses its own options', () => {
          expectation(testHashHistory(), '#/the/path/?the=query#the-hash')
        })
      })
    })

    describe('when createHref is called with override option enforcePolicy==false', () => {
      let overrideOptions
      beforeEach(() => {
        overrideOptions = {
          enforcePolicy: false
        }
      })

      describe('when location pathname has a trailing slash', () => {
        let location
        beforeEach(() => {
          location = {
            pathname: '/the/path/'
          }
        })
        const expectation = createExpectation(() => location, () => overrideOptions)

        it('browser history uses override setting', () => {
          expectation(testBrowserHistory(), '/the/path')
        })

        it('hash history uses override setting', () => {
          expectation(testHashHistory(), '#/the/path')
        })
      })

      describe('when location pathname has a trailing slash with search and hash', () => {
        let location
        beforeEach(() => {
          location = {
            pathname: '/the/path/',
            search: '?the=query',
            hash: '#the-hash'
          }
        })
        const expectation = createExpectation(() => location, () => overrideOptions)

        it('browser history uses override setting', () => {
          expectation(testBrowserHistory(), '/the/path?the=query#the-hash')
        })

        it('hash history uses override setting', () => {
          expectation(testHashHistory(), '#/the/path?the=query#the-hash')
        })
      })
    })
  })
})

describe('when history is created with option to enforce no trailing slash on all paths', () => {
  let ownOptions
  beforeEach(() => {
    ownOptions = {
      enforcePolicy: false
    }
  })

  describe('when history has no basename', () => {
    const testBrowserHistory = () => createBrowserHistory({
      trailingSlashOptions: ownOptions
    })
    const testHashHistory = () => createHashHistory({
      trailingSlashOptions: ownOptions
    })

    describe('when createHref is called without override options', () => {
      describe('when location pathname has a trailing slash', () => {
        let location
        beforeEach(() => {
          location = {
            pathname: '/the/path/'
          }
        })
        const expectation = createExpectation(() => location)

        it('browser history uses its own options', () => {
          expectation(testBrowserHistory(), '/the/path')
        })

        it('hash history uses its own options', () => {
          expectation(testHashHistory(), '#/the/path')
        })
      })

      describe('when location pathname has a trailing slash with search and hash', () => {
        let location
        beforeEach(() => {
          location = {
            pathname: '/the/path/',
            search: '?the=query',
            hash: '#the-hash'
          }
        })
        const expectation = createExpectation(() => location)

        it('browser history uses its own options', () => {
          expectation(testBrowserHistory(), '/the/path?the=query#the-hash')
        })

        it('hash history uses its own options', () => {
          expectation(testHashHistory(), '#/the/path?the=query#the-hash')
        })
      })
    })

    describe('when createHref is called with override option enforcePolicy==true', () => {
      let overrideOptions
      beforeEach(() => {
        overrideOptions = {
          enforcePolicy: true
        }
      })

      describe('when location pathname has no trailing slash', () => {
        let location
        beforeEach(() => {
          location = {
            pathname: '/the/path'
          }
        })
        const expectation = createExpectation(() => location, () => overrideOptions)

        it('browser history uses override setting', () => {
          expectation(testBrowserHistory(), '/the/path/')
        })

        it('hash history uses override setting', () => {
          expectation(testHashHistory(), '#/the/path/')
        })
      })

      describe('when location pathname has no trailing slash with search and hash', () => {
        let location
        beforeEach(() => {
          location = {
            pathname: '/the/path',
            search: '?the=query',
            hash: '#the-hash'
          }
        })
        const expectation = createExpectation(() => location, () => overrideOptions)

        it('browser history uses override setting', () => {
          expectation(testBrowserHistory(), '/the/path/?the=query#the-hash')
        })

        it('hash history uses override setting', () => {
          expectation(testHashHistory(), '#/the/path/?the=query#the-hash')
        })
      })
    })
  })
})