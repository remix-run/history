import expect from 'expect'

const describeListen = (createHistory) => {
  let history, unlisten
  beforeEach(() => {
    history = createHistory()
  })

  afterEach(() => {
    if (unlisten)
      unlisten()
  })

  describe('listen', () => {
    it('does not immediately call listeners', () => {
      const spy = expect.createSpy()
      unlisten = history.listen(spy)
      expect(spy).toNotHaveBeenCalled()
    })
  })
}

export default describeListen
