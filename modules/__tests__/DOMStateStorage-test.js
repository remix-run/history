/*eslint-env mocha */
import expect from 'expect'
import { saveState, readState } from '../DOMStateStorage'

function patchSetItem() {
  const _setItem = window.sessionStorage.setItem
  window.sessionStorage.setItem = function () {
    window.sessionStorage.setItem = _setItem
    let error = new Error()
    error.name = 'QuotaExceededError'
    throw error
  }
}

describe('saving state to sessionStorage after reaching quota', function () {
  beforeEach(function () {
    window.sessionStorage.clear()
  })

  it('removes the first history item from sessionStorage', function () {
    window.sessionStorage.setItem('@@History/1', JSON.stringify({ key: '1' }))
    window.sessionStorage.setItem('@@History/2', JSON.stringify({ key: '2' }))
    patchSetItem()
    saveState('3', { key: '3' })
    expect(window.sessionStorage.getItem('@@History/1')).toEqual(undefined)
    expect(readState('2')).toEqual({ key: '2' })
  })

  it('does not remove non history items from sessionStorage', function () {
    window.sessionStorage.setItem('someKey', 'someValue')
    window.sessionStorage.setItem('@@History/1', JSON.stringify({ key: '1' }))
    patchSetItem()
    saveState('2', { key: '2' })
    expect(window.sessionStorage.getItem('someKey')).toEqual('someValue')
    expect(window.sessionStorage.getItem('@@History/1')).toEqual(undefined)
  })

  it('saves passed state to sessionStorage', function () {
    window.sessionStorage.setItem('@@History/1', JSON.stringify({ key: '1' }))
    patchSetItem()
    saveState('2', { key: '2' })
    expect(readState('2')).toEqual({ key: '2' })
  })
})
