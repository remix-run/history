import warning from 'warning'
import useBeforeUnload from './useBeforeUnload'

function enableBeforeUnload() {
  warning(
    false,
    'enableBeforeUnload is deprecated, use useBeforeUnload instead'
  )

  return useBeforeUnload.apply(this, arguments)
}

export default enableBeforeUnload
