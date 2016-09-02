export default (history, done) => {
  history.push('/home')

  const unlistenBefore = history.listenBefore(() => {
    unlistenBefore()
    done()
  })

  window.location.hash = 'something-new'
}
