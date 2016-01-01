function describePop(createHistory) {
  describe('when a listenBefore hook is added', function () {
    let history, unlisten

    beforeEach(function () {
      history = createHistory()
      history.push('/home')
    })

    afterEach(function () {
      if (unlisten)
        unlisten()
    })

    it('is called when browser navigation is used', function (done) {
      unlisten = history.listenBefore(function () {
        done()
      })

      window.history.back()
    })
  })
}

export default describePop
