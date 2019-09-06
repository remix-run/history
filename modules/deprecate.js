import warning from './warning.js';

export default function deprecate(fn, message) {
  let alreadyWarned = false;
  return function() {
    warning(alreadyWarned, message);
    alreadyWarned = true;
    return fn.apply(this, arguments);
  };
}
