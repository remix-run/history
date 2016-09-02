import expect from 'expect'

export default (history, done) => {
  const unlistenBefore = history.listenBefore((location, callback) => {
    expect(location).toMatch({
      pathname: '/home'
    })

    setTimeout(() => {
      callback('Are you sure?')

      setTimeout(() => {
        expect(history.getCurrentLocation()).toMatch({
          pathname: '/'
        })

        unlistenBefore()
        done()
      })
    })
  })

  expect(history.getCurrentLocation()).toMatch({
    pathname: '/'
  })

  history.push('/home')
}
