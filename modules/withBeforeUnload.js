import useBeforeUnload from './useBeforeUnload'
import EnhancerSecret from './EnhancerSecret'

const withBeforeUnload = (history) => (
  useBeforeUnload(() => history, EnhancerSecret)()
)

export default withBeforeUnload
