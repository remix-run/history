import expect from 'expect'

function describeUnlisten(createHistory) {
  describe('location never has stale path', function () {
    let unlisten, history
    beforeEach(function () {
      history = createHistory()
    })

    afterEach(function () {
      if (unlisten)
        unlisten()
    })

    it('stale history test', function (done) {

      unlisten = history.listen(function () {
      })

      history.push({
        pathname: '/stale',
        state: { initial: 'state' }
      })

      unlisten()

      window.history.pushState({ initial: 'state' }, undefined, '/#/notstale')

      unlisten = history.listen(function (location) {
        expect(location.pathname).toNotEqual('/stale')
        done()
      })

    })
  })
}

export default describeUnlisten
