var searchMatcher = /\?[\s\S]*$/;

export function getPathname(path) {
  return path.replace(searchMatcher, '');
}

export function getSearchString(path) {
  var match = path.match(searchMatcher);
  return match ? match[0] : '';
}

export function isAbsolutePath(path) {
  return typeof path === 'string' && path.charAt(0) === '/';
}
