import warning from 'warning';
import { POP } from './Actions';

function extractPath(string) {
  var match = string.match(/https?:\/\/[^\/]*/);

  if (match == null)
    return string;

  warning(
    false,
    'Location path must be pathname + query string only, not a fully qualified URL like "%s"',
    string
  );

  return string.substring(match[0].length);
}

function createLocation(path='/', state=null, action=POP, key=null) {
  path = extractPath(path);

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
    key
  };
}

export default createLocation;
