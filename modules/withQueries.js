import useQueries from './useQueries'
import EnhancerSecret from './EnhancerSecret'

const withQueries = (history, { parse, stringify } = {}) => (
  useQueries(() => history, EnhancerSecret)({
    parseQueryString: parse,
    stringifyQuery: stringify
  })
)

export default withQueries
