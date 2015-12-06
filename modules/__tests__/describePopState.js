function describePopState(createHistory) {
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

  describe('when a deprecated transition hook is added', function () {
    let history, listener

    beforeEach(function () {
      history = createHistory()
      history.push('/home')
    })

    afterEach(function () {
      history.unregisterTransitionHook(listener)
    })

    it('is called when browser navigation is used', function (done) {
      listener = function () {
        done()
      }

      history.registerTransitionHook(listener)

      window.history.back()
    })
  })
}

export default describePopState
