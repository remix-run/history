const describePopState = (createHistory) => {
  describe('when a listenBefore hook is added', () => {
    let history, unlisten
    beforeEach(() => {
      history = createHistory()
      history.push('/home')
    })

    afterEach(() => {
      if (unlisten)
        unlisten()
    })

    it('is called when browser navigation is used', (done) => {
      unlisten = history.listenBefore(() => {
        done()
      })

      window.history.back()
    })
  })
}

export default describePopState
