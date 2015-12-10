//import warning from 'warning'

function deprecate(fn) {
  return fn
  //return function () {
  //  warning(false, '[history] ' + message)
  //  return fn.apply(this, arguments)
  //}
}

export default deprecate
