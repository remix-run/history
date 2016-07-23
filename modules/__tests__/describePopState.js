import expect from 'expect'

const describePopState = (createHistory) => {
  describe('when a listen or listenBefore hook is added', () => {
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
      const spy = expect.createSpy()
      unlisten = history.listen(spy)

      window.history.back()

      setTimeout(() => {
        expect(spy.calls.length).toEqual(1)
        done()
      }, 500)
    })

    it('is called when only a hash is navigated to', (done) => {
      setTimeout(() => {
        const spy = expect.createSpy()
        unlisten = history.listen(spy)

        window.location.hash = 'newhash'

        setTimeout(() => {
          expect(spy.calls.length).toEqual(1)
          done()
        }, 750)
      }, 250)
    })
  })
}

export default describePopState
