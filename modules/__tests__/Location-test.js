/*eslint-env mocha */
import expect from 'expect'
import createHistory from '../createHistory'
import { POP } from '../Actions'

describe('a location', function () {
  let createLocation
  beforeEach(function () {
    createLocation = createHistory().createLocation
  })

  it('knows its pathname', function () {
    let location = createLocation('/home?the=query#the-hash')
    expect(location.pathname).toEqual('/home')
  })

  it('knows its hash', function () {
    let location = createLocation('/home?the=query#the-hash')
    expect(location.hash).toEqual('#the-hash')
  })

  it('knows its search string', function () {
    let location = createLocation('/home?the=query#the-hash')
    expect(location.search).toEqual('?the=query')
  })

  it('has null state by default', function () {
    let location = createLocation()
    expect(location.state).toBe(null)
  })

  it('uses pop navigation by default', function () {
    let location = createLocation()
    expect(location.action).toBe(POP)
  })

  it('has a key by default', function () {
    let location = createLocation()
    expect(location.key).toExist()
  })
})
