const describePopState = (createHistory) => {
  describe('popState', () => {
    let history, unlisten
    beforeEach(() => {
      history = createHistory()
      history.push('/home')
    })

    afterEach(() => {
      if (unlisten)
        unlisten()
    })

    describe('when a listenBefore hook is added', () => {
      it('is called when browser navigation is used', (done) => {
        unlisten = history.listenBefore(() => {
          done()
        })

        window.history.back()
      })
    })

    describe('when a listener is added', () => {
      it('is called when only a hash is navigated to', (done) => {
        unlisten = history.listen(() => {
          done()
        })

        window.location.hash = 'newhash'
      })
    })
  })
}

export default describePopState
