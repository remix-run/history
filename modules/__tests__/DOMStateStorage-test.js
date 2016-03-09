import expect from 'expect'
import { saveState, readState } from '../DOMStateStorage'

describe('dom state storage', () => {
  it('saves and reads state data', () => {
    saveState('key1', { id: 1 })
    expect(readState('key1')).toEqual({ id: 1 })

    saveState('key1', null)
    expect(readState('key1')).toBe(undefined)

    saveState('key2', { id: 2 })
    expect(readState('key2')).toEqual({ id: 2 })

    expect(readState('key3')).toBe(undefined)
  })
})
