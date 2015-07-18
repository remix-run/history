import invariant from 'invariant';
import NavigationTypes from './NavigationTypes';
import createLocation from './createLocation';
import createHistory from './createHistory';

function createStorage(entries) {
  return entries
    .filter(entry => entry.state)
    .reduce((memo, entry) => {
      memo[entry.key] = entry.state;
      return memo;
    }, {});
}

function createMemoryHistory(options={}) {
  if (Array.isArray(options)) {
    options = { entries: options };
  } else if (typeof options === 'string') {
    options = { entries: [ options ] };
  }

  var history = createHistory({
    ...options,
    getCurrentLocation,
    saveState,
    readState,
    finishTransition,
    go
  });

  var { entries, current } = options;

  if (typeof entries === 'string') {
    entries = [ entries ];
  } else if (!Array.isArray(entries)) {
    entries = [ '/' ];
  }

  entries = entries.map(function (entry) {
    var key = history.createKey();

    if (typeof entry === 'string')
      return { path: entry, key };

    if (typeof entry === 'object' && entry)
      return { ...entry, key };

    invariant(
      false,
      'Unable to create history entry from %s',
      entry
    );
  });

  if (current == null) {
    current = entries.length - 1;
  } else {
    invariant(
      current >= 0 && current < entries.length,
      'Current index must be >= 0 and < %s, was %s',
      entries.length, current
    );
  }

  var storage = createStorage(entries);

  function saveState(key, state) {
    storage[key] = state;
  }

  function readState(key) {
    return storage[key];
  }

  function getCurrentLocation() {
    var { key, path } = entries[current];
    var state = readState(key);
    return createLocation(key, state, path);
  }

  function canGo(n) {
    var index = current + n;
    return index >= 0 && index < entries.length;
  }

  function go(n) {
    if (n) {
      invariant(
        canGo(n),
        'Cannot go(%s); there is not enough history',
        n
      );

      current += n;

      history.transitionTo(getCurrentLocation());
    }
  }

  function finishTransition(location) {
    switch (location.navigationType) {
      case NavigationTypes.PUSH:
        current += 1;
        // fall through
      case NavigationTypes.REPLACE:
        saveState(location.key, location.state);
        break;
    }
  }

  function cancelTransition(location) {
    if (location.navigationType === NavigationTypes.POP) {
      var n = 0; // TODO: Figure out what n will restore current.
      current += n;
    }
  }

  return history;
}

export default createMemoryHistory;
