import { POP } from './Actions';

function createLocation(path='/', state=null, action=POP, key=null, current=-1) {
  var index = path.indexOf('?');

  var pathname, search;
  if (index !== -1) {
    pathname = path.substring(0, index);
    search = path.substring(index);
  } else {
    pathname = path;
    search = '';
  }

  if (pathname === '')
    pathname = '/';

  return {
    pathname,
    search,
    state,
    action,
    key,
    current
  };
}

export default createLocation;
