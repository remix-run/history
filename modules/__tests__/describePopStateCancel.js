import expect from 'expect'

const describePopStateCancel = (createHistory) => {
  describe('when popstate transitons are canceled', () => {
    let history, unlistenBefore
    beforeEach(() => {
      history = createHistory()
      history.push('/a')
      history.push('/b')
      history.push('/c')

      unlistenBefore = history.listenBefore(() => false)
    })

    afterEach(() => {
      if (unlistenBefore)
        unlistenBefore()
    })

    it('restores the previous location', (done) => {
      window.history.back()

      setTimeout(() => {
        const currentLocation = history.getCurrentLocation()
        expect(currentLocation.pathname).toBe('/c')
        done()
      }, 100)
    })
  })
}

export default describePopStateCancel
