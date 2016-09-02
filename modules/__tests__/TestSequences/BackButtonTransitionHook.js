export default (history, done) => {
  history.push('/home')

  const unlistenBefore = history.listenBefore(() => {
    unlistenBefore()
    done()
  })

  window.history.back()
}
