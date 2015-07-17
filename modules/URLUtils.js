import qs from 'qs';

export var parseQueryString = qs.parse;

var queryMatcher = /\?([\s\S]*)$/;

export function getPathname(path) {
  return path.replace(queryMatcher, '');
}

export function getQueryString(path) {
  var match = path.match(queryMatcher);
  return match ? match[1] : '';
}

export function isAbsolutePath(path) {
  return typeof path === 'string' && path.charAt(0) === '/';
}
