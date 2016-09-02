import expect from 'expect'

export default (history, done) => {
  const unlistenBefore = history.listenBefore(location => {
    expect(location).toMatch({
      pathname: '/home'
    })

    return 'Are you sure?'
  })

  expect(history.getCurrentLocation()).toMatch({
    pathname: '/'
  })

  history.push('/home')

  expect(history.getCurrentLocation()).toMatch({
    pathname: '/'
  })

  unlistenBefore()
  done()
}
