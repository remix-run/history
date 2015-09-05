import warning from 'warning'
import useQueries from './useQueries'

function enableQueries() {
  warning(
    false,
    'enableQueries is deprecated, use useQueries instead'
  )

  return useQueries.apply(this, arguments)
}

export default enableQueries
