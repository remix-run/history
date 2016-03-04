import invariant from 'invariant'
import { canUseDOM } from './ExecutionEnvironment'
import { getUserConfirmation, go } from './DOMUtils'
import createHistory from './createHistory'

const createDOMHistory = (options) => {
  const history = createHistory({
    getUserConfirmation,
    ...options,
    go
  })

  const listen = (listener) => {
    invariant(
      canUseDOM,
      'DOM history needs a DOM'
    )

    return history.listen(listener)
  }

  return {
    ...history,
    listen
  }
}

export default createDOMHistory
