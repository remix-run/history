import { POP } from './NavigationTypes';

function createLocation(key, state=null, path='/', navigationType=POP) {
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
    key,
    state,
    pathname,
    search,
    navigationType
  };
}

export default createLocation;
