import useBasename from './useBasename'
import EnhancerSecret from './EnhancerSecret'

const withBasename = (history, basename) => (
  useBasename(() => history, EnhancerSecret)({ basename })
)

export default withBasename
