export function createEvents() {
  let handlers = [];

  return {
    get length() {
      return handlers.length;
    },
    push(fn) {
      handlers.push(fn);
      return function() {
        handlers = handlers.filter(handler => handler !== fn);
      };
    },
    call(arg) {
      handlers.forEach(fn => fn && fn(arg));
    }
  };
}

export function createKey() {
  return Math.random()
    .toString(36)
    .substr(2, 8);
}

export function createPath({ pathname = '/', search = '', hash = '' }) {
  return pathname + search + hash;
}

export function parsePath(path) {
  let pieces = {};

  if (path) {
    let hashIndex = path.indexOf('#');
    if (hashIndex >= 0) {
      pieces.hash = path.substr(hashIndex);
      path = path.substr(0, hashIndex);
    }

    let searchIndex = path.indexOf('?');
    if (searchIndex >= 0) {
      pieces.search = path.substr(searchIndex);
      path = path.substr(0, searchIndex);
    }

    if (path) {
      pieces.pathname = path;
    }
  }

  return pieces;
}
