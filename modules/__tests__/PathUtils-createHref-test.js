import expect from 'expect'
import { createHref } from '../PathUtils'

describe('PathUtils createHref function without options', () => {
  describe('where location only has slash pathname', () => {
    let location
    beforeEach(() => {
      location = {
        pathname: '/'
      }
    })

    it('handles empty basename', () => {
      const href = createHref('', location)
      expect(href).toEqual('/')
    })

    it('handles slash basename', () => {
      const href = createHref('/', location)
      expect(href).toEqual('/')
    })

    it('handles normal basename', () => {
      const href = createHref('/the/base', location)
      expect(href).toEqual('/the/base/')
    })

    it('handles basename with trailing slash', () => {
      const href = createHref('/the/base/', location)
      expect(href).toEqual('/the/base/')
    })
  })

  describe('where location has slash pathname with search and hash', () => {
    let location
    beforeEach(() => {
      location = {
        pathname: '/',
        search: '?the=query',
        hash: '#the-hash'
      }
    })

    it('handles empty basename', () => {
      const href = createHref('', location)
      expect(href).toEqual('/?the=query#the-hash')
    })

    it('handles slash basename', () => {
      const href = createHref('/', location)
      expect(href).toEqual('/?the=query#the-hash')
    })

    it('handles normal basename', () => {
      const href = createHref('/the/base', location)
      expect(href).toEqual('/the/base/?the=query#the-hash')
    })
    
    it('handles basename with trailing slash', () => {
      const href = createHref('/the/base/', location)
      expect(href).toEqual('/the/base/?the=query#the-hash')
    })
  })

  describe('where location has normalized pathname with search and hash', () => {
    let location
    beforeEach(() => {
      location = {
        pathname: '/the/path',
        search: '?the=query',
        hash: '#the-hash'
      }
    })
    
    it('handles empty basename', () => {
      const href = createHref('', location)
      expect(href).toEqual('/the/path?the=query#the-hash')
    })

    it('handles slash basename', () => {
      const href = createHref('/', location)
      expect(href).toEqual('/the/path?the=query#the-hash')
    })

    it('handles normal basename', () => {
      const href = createHref('/the/base', location)
      expect(href).toEqual('/the/base/the/path?the=query#the-hash')
    })
    
    it('handles basename with trailing slash', () => {
      const href = createHref('/the/base/', location)
      expect(href).toEqual('/the/base/the/path?the=query#the-hash')
    })
  })
  
  describe('where location only has normalized pathname', () => {
    let location
    beforeEach(() => {
      location = {
        pathname: '/the/path'
      }
    })
    
    it('handles empty basename', () => {
      const href = createHref('', location)
      expect(href).toEqual('/the/path')
    })

    it('handles slash basename', () => {
      const href = createHref('/', location)
      expect(href).toEqual('/the/path')
    })

    it('handles normal basename', () => {
      const href = createHref('/the/base', location)
      expect(href).toEqual('/the/base/the/path')
    })
    
    it('handles basename with trailing slash', () => {
      const href = createHref('/the/base/', location)
      expect(href).toEqual('/the/base/the/path')
    })
  })

  describe('where location has pathname with trailing slash', () => {
    let location
    beforeEach(() => {
      location = {
        pathname: '/the/path/'
      }
    })

    it('handles empty basename', () => {
      const href = createHref('', location)
      expect(href).toEqual('/the/path/')
    })

    it('handles normal basename', () => {
      const href = createHref('/the/base', location)
      expect(href).toEqual('/the/base/the/path/')
    })

  })

  describe('where location has pathname with trailing slash, search and hash', () => {
    let location
    beforeEach(() => {
      location = {
        pathname: '/the/path/',
        search: '?the=query',
        hash: '#the-hash'
      }
    })

    it('handles empty basename', () => {
      const href = createHref('', location)
      expect(href).toEqual('/the/path/?the=query#the-hash')
    })

    it('handles normal basename', () => {
      const href = createHref('/the/base', location)
      expect(href).toEqual('/the/base/the/path/?the=query#the-hash')
    })
  })
})

describe('PathUtils createHref function with enforce trailing slash policy', () => {
  let options
  beforeEach(() => {
    options = {
      enforcePolicy: true
    }
  })
  describe('where location has no trailing slash', () => {
    let location
    beforeEach(() => {
      location = {
        pathname: '/the/path'
      }
    })

    it('handles empty basename', () => {
      const href = createHref('', location, options)
      expect(href).toEqual('/the/path/')
    })

    it('handles normal basename', () => {
      const href = createHref('/the/base', location, options)
      expect(href).toEqual('/the/base/the/path/')
    })
  })

  describe('where location has trailing slash', () => {
    let location
    beforeEach(() => {
      location = {
        pathname: '/the/path/'
      }
    })
    
    it('handles empty basename', () => {
      const href = createHref('', location, options)
      expect(href).toEqual('/the/path/')
    })

    it('handles normal basename', () => {
      const href = createHref('/the/base', location, options)
      expect(href).toEqual('/the/base/the/path/')
    })
  })

  describe('where location has root pathname', () => {
    let location
    beforeEach(() => {
      location = {
        pathname: '/'
      }
    })
    
    it('handles empty basename', () => {
      const href = createHref('', location, options)
      expect(href).toEqual('/')
    })

    it('handles normal basename', () => {
      const href = createHref('/the/base', location, options)
      expect(href).toEqual('/the/base/')
    })
  })
})

describe('PathUtils createHref function with enforce no trailing slash policy', () => {
  let options
  beforeEach(() => {
    options = {
      enforcePolicy: false
    }
  })

  describe('where location has no trailing slash', () => {
    let location
    beforeEach(() => {
      location = {
        pathname: '/the/path'
      }
    })
    
    it('handles empty basename', () => {
      const href = createHref('', location, options)
      expect(href).toEqual('/the/path')
    })

    it('handles normal basename', () => {
      const href = createHref('/the/base', location, options)
      expect(href).toEqual('/the/base/the/path')
    })
  })

  describe('where location has trailing slash', () => {
    let location
    beforeEach(() => {
      location = {
        pathname: '/the/path/'
      }
    })
    
    it('handles empty basename', () => {
      const href = createHref('', location, options)
      expect(href).toEqual('/the/path')
    })

    it('handles normal basename', () => {
      const href = createHref('/the/base', location, options)
      expect(href).toEqual('/the/base/the/path')
    })
  })

  describe('where location has root pathname', () => {
    let location
    beforeEach(() => {
      location = {
        pathname: '/'
      }
    })
    
    it('handles empty basename', () => {
      const href = createHref('', location, options)
      expect(href).toEqual('/')
    })

    it('handles normal basename', () => {
      const href = createHref('/the/base', location, options)
      expect(href).toEqual('/the/base')
    })
  })
})

describe('PathUtils createHref function with basename trailing slash option', () => {
  let options
  beforeEach(() => {
    options = {
      basePath: true
    }
  })

  describe('where location has root pathname', () => {
    let location
    beforeEach(() => {
      location = {
        pathname: '/'
      }
    })

    it('handles normal basename', () => {
      const href = createHref('/the/base', location, options)
      expect(href).toEqual('/the/base')
    })
  })

  describe('where location has root pathname with search and hash', () => {
    let location
    beforeEach(() => {
      location = {
        pathname: '/',
        search: '?the=query',
        hash: '#the-hash'
      }
    })

    it('handles normal basename', () => {
      const href = createHref('/the/base', location, options)
      expect(href).toEqual('/the/base?the=query#the-hash')
    })
  })
})