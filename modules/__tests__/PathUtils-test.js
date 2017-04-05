import expect from 'expect'
import { stripPrefix } from '../PathUtils'

describe('stripPrefix', () => {
  it('strips the prefix from the pathname', () => {
    const path = '/prefix/pathname'
    const prefix = '/prefix'
    expect(stripPrefix(path, prefix)).toEqual('/pathname')
  })

  it('is not case-sensitive', () => {
    const path = '/PREFIX/pathname'
    const prefix = '/prefix'
    expect(stripPrefix(path, prefix)).toEqual('/pathname')
  })

  it('does not strip partial prefix matches', () => {
    const path = '/prefixed/pathname'
    const prefix = '/prefix'
    expect(stripPrefix(path, prefix)).toEqual(path)
  })

  it('strips when path is only the prefix', () => {
    const path = '/prefix'
    const prefix = '/prefix'
    expect(stripPrefix(path, prefix)).toEqual('')
  })

  it('strips with no pathname, but with a search string', () => {
    const path = '/prefix?a=b'
    const prefix = '/prefix'
    expect(stripPrefix(path, prefix)).toEqual('?a=b')
  })

  it('strips with no pathname, but with a hash string', () => {
    const path = '/prefix#rest'
    const prefix = '/prefix'
    expect(stripPrefix(path, prefix)).toEqual('#rest')
  })
})
