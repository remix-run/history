export const addLeadingSlash = (path) =>
  path.charAt(0) === '/' ? path : '/' + path

export const stripLeadingSlash = (path) =>
  path.charAt(0) === '/' ? path.substr(1) : path

export const stripPrefix = (path, prefix) =>
  path.indexOf(prefix) === 0 ? path.substr(prefix.length) : path
