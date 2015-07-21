(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["History"] = factory();
	else
		root["History"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _createBrowserHistory = __webpack_require__(6);

	var _createBrowserHistory2 = _interopRequireDefault(_createBrowserHistory);

	exports.createHistory = _createBrowserHistory2['default'];

	var _createHashHistory2 = __webpack_require__(7);

	var _createHashHistory3 = _interopRequireDefault(_createHashHistory2);

	exports.createHashHistory = _createHashHistory3['default'];

	var _createMemoryHistory2 = __webpack_require__(8);

	var _createMemoryHistory3 = _interopRequireDefault(_createMemoryHistory2);

	exports.createMemoryHistory = _createMemoryHistory3['default'];

	var _createLocation2 = __webpack_require__(2);

	var _createLocation3 = _interopRequireDefault(_createLocation2);

	exports.createLocation = _createLocation3['default'];

	var _Actions2 = __webpack_require__(1);

	var _Actions3 = _interopRequireDefault(_Actions2);

	exports.Actions = _Actions3['default'];

/***/ },
/* 1 */
/***/ function(module, exports) {

	/**
	 * Indicates that navigation was caused by a call to history.push.
	 */
	'use strict';

	exports.__esModule = true;
	var PUSH = 'PUSH';

	exports.PUSH = PUSH;
	/**
	 * Indicates that navigation was caused by a call to history.replace.
	 */
	var REPLACE = 'REPLACE';

	exports.REPLACE = REPLACE;
	/**
	 * Indicates that navigation was caused by some other action such
	 * as using a browser's back/forward buttons and/or manually manipulating
	 * the URL in a browser's location bar. This is the default.
	 *
	 * See https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onpopstate
	 * for more information.
	 */
	var POP = 'POP';

	exports.POP = POP;
	exports['default'] = {
	  PUSH: PUSH,
	  REPLACE: REPLACE,
	  POP: POP
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _Actions = __webpack_require__(1);

	function createLocation() {
	  var path = arguments.length <= 0 || arguments[0] === undefined ? '/' : arguments[0];
	  var state = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
	  var action = arguments.length <= 2 || arguments[2] === undefined ? _Actions.POP : arguments[2];
	  var key = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];

	  var index = path.indexOf('?');

	  var pathname, search;
	  if (index !== -1) {
	    pathname = path.substring(0, index);
	    search = path.substring(index);
	  } else {
	    pathname = path;
	    search = '';
	  }

	  if (pathname === '') pathname = '/';

	  return {
	    pathname: pathname,
	    search: search,
	    state: state,
	    action: action,
	    key: key
	  };
	}

	exports['default'] = createLocation;
	module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports.addEventListener = addEventListener;
	exports.removeEventListener = removeEventListener;
	exports.getHashPath = getHashPath;
	exports.replaceHashPath = replaceHashPath;
	exports.getWindowPath = getWindowPath;
	exports.saveState = saveState;
	exports.readState = readState;
	exports.go = go;
	exports.supportsHistory = supportsHistory;
	var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

	exports.canUseDOM = canUseDOM;

	function addEventListener(node, event, listener) {
	  if (node.addEventListener) {
	    node.addEventListener(event, listener, false);
	  } else {
	    node.attachEvent('on' + event, listener);
	  }
	}

	function removeEventListener(node, event, listener) {
	  if (node.removeEventListener) {
	    node.removeEventListener(event, listener, false);
	  } else {
	    node.detachEvent('on' + event, listener);
	  }
	}

	function getHashPath() {
	  // We can't use window.location.hash here because it's not
	  // consistent across browsers - Firefox will pre-decode it!
	  return window.location.href.split('#')[1] || '';
	}

	function replaceHashPath(path) {
	  window.location.replace(window.location.pathname + window.location.search + '#' + path);
	}

	function getWindowPath() {
	  return window.location.pathname + window.location.search;
	}

	function saveState(key, state) {
	  window.sessionStorage.setItem(key, JSON.stringify(state));
	}

	function readState(key) {
	  var json = window.sessionStorage.getItem(key);

	  if (json) {
	    try {
	      return JSON.parse(json);
	    } catch (error) {}
	  }

	  return null;
	}

	function go(n) {
	  if (n) window.history.go(n);
	}

	/**
	 * taken from modernizr
	 * https://github.com/Modernizr/Modernizr/blob/master/LICENSE
	 * https://github.com/Modernizr/Modernizr/blob/master/feature-detects/history.js
	 * changed to avoid false negatives for Windows Phones: https://github.com/rackt/react-router/issues/586
	 */

	function supportsHistory() {
	  var ua = navigator.userAgent;
	  if ((ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) && ua.indexOf('Mobile Safari') !== -1 && ua.indexOf('Chrome') === -1 && ua.indexOf('Windows Phone') === -1) {
	    return false;
	  }
	  return window.history && 'pushState' in window.history;
	}

	// Ignore invalid JSON.

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _DOMUtils = __webpack_require__(3);

	var _createHistory = __webpack_require__(5);

	var _createHistory2 = _interopRequireDefault(_createHistory);

	function getUserConfirmation(message, callback) {
	  callback(window.confirm(message));
	}

	function startBeforeUnloadListener(_ref) {
	  var getTransitionConfirmationMessage = _ref.getTransitionConfirmationMessage;

	  function listener(event) {
	    var message = getTransitionConfirmationMessage();

	    if (typeof message === 'string') {
	      (event || window.event).returnValue = message;
	      return message;
	    }
	  }

	  _DOMUtils.addEventListener(window, 'beforeunload', listener);

	  return function () {
	    _DOMUtils.removeEventListener(window, 'beforeunload', listener);
	  };
	}

	function createDOMHistory(options) {
	  var history = _createHistory2['default'](_extends({
	    getUserConfirmation: getUserConfirmation
	  }, options, {
	    saveState: _DOMUtils.saveState,
	    readState: _DOMUtils.readState,
	    go: _DOMUtils.go
	  }));

	  var listenerCount = 0;
	  var stopBeforeUnloadListener;

	  function listen(listener) {
	    var unlisten = history.listen(listener);

	    listenerCount += 1;

	    if (listenerCount === 1) stopBeforeUnloadListener = startBeforeUnloadListener(history);

	    return function () {
	      unlisten();
	      listenerCount -= 1;

	      if (listenerCount === 0) stopBeforeUnloadListener();
	    };
	  }

	  return _extends({}, history, {
	    listen: listen
	  });
	}

	exports['default'] = createDOMHistory;
	module.exports = exports['default'];

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _Actions = __webpack_require__(1);

	var _createLocation = __webpack_require__(2);

	var _createLocation2 = _interopRequireDefault(_createLocation);

	var DefaultKeyLength = 6;

	function createRandomKey(length) {
	  return Math.random().toString(36).substr(2, length);
	}

	function createHistory() {
	  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	  var transitionHooks = [];
	  var changeListeners = [];
	  var location, pendingLocation;

	  var getCurrentLocation = options.getCurrentLocation;
	  var finishTransition = options.finishTransition;
	  var cancelTransition = options.cancelTransition;
	  var go = options.go;
	  var keyLength = options.keyLength;
	  var getUserConfirmation = options.getUserConfirmation;

	  if (typeof keyLength !== 'number') keyLength = DefaultKeyLength;

	  function updateLocation(newLocation) {
	    location = newLocation;

	    changeListeners.forEach(function (listener) {
	      listener(location);
	    });
	  }

	  function addChangeListener(listener) {
	    changeListeners.push(listener);
	  }

	  function removeChangeListener(listener) {
	    changeListeners = changeListeners.filter(function (item) {
	      return item !== listener;
	    });
	  }

	  function listen(listener) {
	    addChangeListener(listener);

	    if (location) {
	      listener(location);
	    } else {
	      updateLocation(getCurrentLocation());
	    }

	    return function () {
	      removeChangeListener(listener);
	    };
	  }

	  function registerTransitionHook(hook) {
	    if (transitionHooks.indexOf(hook) === -1) transitionHooks.push(hook);
	  }

	  function unregisterTransitionHook(hook) {
	    transitionHooks = transitionHooks.filter(function (item) {
	      return item !== hook;
	    });
	  }

	  function getTransitionConfirmationMessage() {
	    var message = null;

	    for (var i = 0, len = transitionHooks.length; i < len && typeof message !== 'string'; ++i) message = transitionHooks[i].call(this);

	    return message;
	  }

	  function confirmTransition(callback) {
	    var message;

	    if (getUserConfirmation && (message = getTransitionConfirmationMessage())) {
	      getUserConfirmation(message, function (ok) {
	        callback(ok !== false);
	      });
	    } else {
	      callback(true);
	    }
	  }

	  function transitionTo(nextLocation) {
	    pendingLocation = nextLocation;

	    confirmTransition(function (ok) {
	      if (pendingLocation !== nextLocation) return; // Last transitionTo wins.

	      if (ok) {
	        finishTransition(nextLocation);
	        updateLocation(nextLocation);
	      } else if (cancelTransition) {
	        cancelTransition(nextLocation);
	      }
	    });
	  }

	  function pushState(state, path) {
	    transitionTo(_createLocation2['default'](path, state, _Actions.PUSH, createKey()));
	  }

	  function replaceState(state, path) {
	    transitionTo(_createLocation2['default'](path, state, _Actions.REPLACE, createKey()));
	  }

	  function goBack() {
	    go(-1);
	  }

	  function goForward() {
	    go(1);
	  }

	  function createKey() {
	    return createRandomKey(keyLength);
	  }

	  return {
	    listen: listen,
	    registerTransitionHook: registerTransitionHook,
	    unregisterTransitionHook: unregisterTransitionHook,
	    getTransitionConfirmationMessage: getTransitionConfirmationMessage,
	    transitionTo: transitionTo,
	    pushState: pushState,
	    replaceState: replaceState,
	    go: go,
	    goBack: goBack,
	    goForward: goForward,
	    createKey: createKey
	  };
	}

	exports['default'] = createHistory;
	module.exports = exports['default'];

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _Actions = __webpack_require__(1);

	var _DOMUtils = __webpack_require__(3);

	var _createDOMHistory = __webpack_require__(4);

	var _createDOMHistory2 = _interopRequireDefault(_createDOMHistory);

	var _createLocation = __webpack_require__(2);

	var _createLocation2 = _interopRequireDefault(_createLocation);

	function getCurrentLocation(historyState) {
	  historyState = historyState || window.history.state || {};

	  var key = historyState.key;

	  var state = key && _DOMUtils.readState(key);
	  var path = _DOMUtils.getWindowPath();

	  return _createLocation2['default'](path, state, undefined, key);
	}

	var ignoreNextPopState = false;

	function startPopStateListener(_ref) {
	  var transitionTo = _ref.transitionTo;

	  function listener(event) {
	    if (event.state === undefined) return; // Ignore extraneous popstate events in WebKit.

	    if (ignoreNextPopState) {
	      ignoreNextPopState = false;
	      return;
	    }

	    transitionTo(getCurrentLocation(event.state));
	  }

	  _DOMUtils.addEventListener(window, 'popstate', listener);

	  return function () {
	    _DOMUtils.removeEventListener(window, 'popstate', listener);
	  };
	}

	function finishTransition(location) {
	  var key = location.key;
	  var pathname = location.pathname;
	  var search = location.search;

	  var path = pathname + search;
	  var state = {
	    key: key
	  };

	  switch (location.action) {
	    case _Actions.PUSH:
	      _DOMUtils.saveState(location.key, location.state);
	      window.history.pushState(state, null, path);
	      break;
	    case _Actions.REPLACE:
	      _DOMUtils.saveState(location.key, location.state);
	      window.history.replaceState(state, null, path);
	      break;
	  }
	}

	function cancelTransition(location) {
	  if (location.action === _Actions.POP) {
	    var n = 0; // TODO: Figure out what n will put the URL back.

	    if (n) {
	      ignoreNextPopState = true;
	      _DOMUtils.go(n);
	    }
	  }
	}

	function createBrowserHistory(options) {
	  var history = _createDOMHistory2['default'](_extends({}, options, {
	    getCurrentLocation: getCurrentLocation,
	    finishTransition: finishTransition,
	    cancelTransition: cancelTransition
	  }));

	  var listenerCount = 0;
	  var stopPopStateListener;

	  function listen(listener) {
	    if (++listenerCount === 1) stopPopStateListener = startPopStateListener(history);

	    var unlisten = history.listen(listener);

	    return function () {
	      unlisten();

	      if (--listenerCount === 0) stopPopStateListener();
	    };
	  }

	  return _extends({}, history, {
	    listen: listen
	  });
	}

	exports['default'] = createBrowserHistory;
	module.exports = exports['default'];

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _warning = __webpack_require__(10);

	var _warning2 = _interopRequireDefault(_warning);

	var _Actions = __webpack_require__(1);

	var _DOMUtils = __webpack_require__(3);

	var _createDOMHistory = __webpack_require__(4);

	var _createDOMHistory2 = _interopRequireDefault(_createDOMHistory);

	var _createLocation = __webpack_require__(2);

	var _createLocation2 = _interopRequireDefault(_createLocation);

	function isAbsolutePath(path) {
	  return typeof path === 'string' && path.charAt(0) === '/';
	}

	function ensureSlash() {
	  var path = _DOMUtils.getHashPath();

	  if (isAbsolutePath(path)) return true;

	  _DOMUtils.replaceHashPath('/' + path);

	  return false;
	}

	function addQueryStringValueToPath(path, key, value) {
	  return path + (path.indexOf('?') === -1 ? '?' : '&') + (key + '=' + value);
	}

	function stripQueryStringValueFromPath(path, key) {
	  return path.replace(new RegExp('[?&]?' + key + '=[a-zA-Z0-9]+'), '');
	}

	function getQueryStringValueFromPath(path, key) {
	  var match = path.match(new RegExp('\\?.*?\\b' + key + '=(.+?)\\b'));
	  return match && match[1];
	}

	var DefaultQueryKey = '_k';

	function createHashHistory() {
	  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	  var queryKey = options.queryKey;

	  if (queryKey === undefined || !!queryKey) {
	    queryKey = typeof queryKey === 'string' ? queryKey : DefaultQueryKey;
	  }

	  function getCurrentLocation() {
	    var path = _DOMUtils.getHashPath();

	    var key, state;
	    if (queryKey) {
	      key = getQueryStringValueFromPath(path, queryKey);
	      path = stripQueryStringValueFromPath(path, queryKey);
	      state = key && _DOMUtils.readState(key);
	    }

	    return _createLocation2['default'](path, state, undefined, key);
	  }

	  var ignoreNextHashChange = false;
	  var lastHashPath;

	  function startHashChangeListener(_ref) {
	    var transitionTo = _ref.transitionTo;

	    function listener() {
	      var hashPath = _DOMUtils.getHashPath();

	      if (!ensureSlash()) return; // Always make sure hashes are preceeded with a /.

	      if (lastHashPath === hashPath) return; // Prevent false positives.

	      lastHashPath = hashPath;

	      if (ignoreNextHashChange) {
	        ignoreNextHashChange = false;
	        return;
	      }

	      transitionTo(getCurrentLocation());
	    }

	    ensureSlash();
	    _DOMUtils.addEventListener(window, 'hashchange', listener);

	    return function () {
	      _DOMUtils.removeEventListener(window, 'hashchange', listener);
	    };
	  }

	  function finishTransition(location) {
	    var key = location.key;
	    var pathname = location.pathname;
	    var search = location.search;

	    var path = pathname + search;

	    if (queryKey) path = addQueryStringValueToPath(path, queryKey, key);

	    var hashWillChange = path !== _DOMUtils.getHashPath();

	    _warning2['default'](hashWillChange, 'You cannot push/replace the same path using hash history');

	    switch (location.action) {
	      case _Actions.PUSH:
	        if (hashWillChange) {
	          ignoreNextHashChange = true;

	          if (queryKey) {
	            _DOMUtils.saveState(location.key, location.state);
	          }

	          window.location.hash = path;
	        }
	        break;
	      case _Actions.REPLACE:
	        if (hashWillChange) {
	          ignoreNextHashChange = true;

	          if (!!queryKey) {
	            _DOMUtils.saveState(location.key, location.state);
	          }

	          _DOMUtils.replaceHashPath(path);
	        }
	        break;
	    }
	  }

	  function cancelTransition(location) {
	    if (location.action === _Actions.POP) {
	      var n = 0; // TODO: Figure out what n will put the URL back.

	      if (n) {
	        ignoreNextHashChange = true;
	        _DOMUtils.go(n);
	      }
	    }
	  }

	  var history = _createDOMHistory2['default'](_extends({}, options, {
	    getCurrentLocation: getCurrentLocation,
	    finishTransition: finishTransition,
	    cancelTransition: cancelTransition
	  }));

	  var listenerCount = 0;
	  var stopHashChangeListener;

	  function listen(listener) {
	    if (++listenerCount === 1) stopHashChangeListener = startHashChangeListener(history);

	    var unlisten = history.listen(listener);

	    return function () {
	      unlisten();

	      if (--listenerCount === 0) stopHashChangeListener();
	    };
	  }

	  return _extends({}, history, {
	    listen: listen
	  });
	}

	exports['default'] = createHashHistory;
	module.exports = exports['default'];

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _invariant = __webpack_require__(9);

	var _invariant2 = _interopRequireDefault(_invariant);

	var _Actions = __webpack_require__(1);

	var _createLocation = __webpack_require__(2);

	var _createLocation2 = _interopRequireDefault(_createLocation);

	var _createHistory = __webpack_require__(5);

	var _createHistory2 = _interopRequireDefault(_createHistory);

	function createStorage(entries) {
	  return entries.filter(function (entry) {
	    return entry.state;
	  }).reduce(function (memo, entry) {
	    memo[entry.key] = entry.state;
	    return memo;
	  }, {});
	}

	function createMemoryHistory() {
	  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

	  if (Array.isArray(options)) {
	    options = { entries: options };
	  } else if (typeof options === 'string') {
	    options = { entries: [options] };
	  }

	  var history = _createHistory2['default'](_extends({}, options, {
	    getCurrentLocation: getCurrentLocation,
	    saveState: saveState,
	    readState: readState,
	    finishTransition: finishTransition,
	    cancelTransition: cancelTransition,
	    go: go
	  }));

	  var entries = options.entries;
	  var current = options.current;

	  if (typeof entries === 'string') {
	    entries = [entries];
	  } else if (!Array.isArray(entries)) {
	    entries = ['/'];
	  }

	  entries = entries.map(function (entry) {
	    var key = history.createKey();

	    if (typeof entry === 'string') return { pathname: entry, key: key };

	    if (typeof entry === 'object' && entry) return _extends({}, entry, { key: key });

	    _invariant2['default'](false, 'Unable to create history entry from %s', entry);
	  });

	  if (current == null) {
	    current = entries.length - 1;
	  } else {
	    _invariant2['default'](current >= 0 && current < entries.length, 'Current index must be >= 0 and < %s, was %s', entries.length, current);
	  }

	  var storage = createStorage(entries);

	  function saveState(key, state) {
	    storage[key] = state;
	  }

	  function readState(key) {
	    return storage[key];
	  }

	  function getCurrentLocation() {
	    var _entries$current = entries[current];
	    var key = _entries$current.key;
	    var pathname = _entries$current.pathname;
	    var search = _entries$current.search;

	    var path = pathname + (search || '');
	    var state = readState(key);

	    return _createLocation2['default'](path, state, undefined, key);
	  }

	  function canGo(n) {
	    var index = current + n;
	    return index >= 0 && index < entries.length;
	  }

	  function go(n) {
	    if (n) {
	      _invariant2['default'](canGo(n), 'Cannot go(%s); there is not enough history', n);

	      current += n;

	      var currentLocation = getCurrentLocation();

	      // change action to POP
	      history.transitionTo(_extends({}, currentLocation, { action: _Actions.POP }));
	    }
	  }

	  function finishTransition(location) {
	    switch (location.action) {
	      case _Actions.PUSH:
	        current += 1;
	        entries.push(location);
	        saveState(location.key, location.state);
	        break;
	      case _Actions.REPLACE:
	        entries[current] = location;
	        saveState(location.key, location.state);
	        break;
	    }
	  }

	  function cancelTransition(location) {
	    if (location.action === _Actions.POP) {
	      var n = 0; // TODO: Figure out what n will restore current.
	      current += n;
	    }
	  }

	  return history;
	}

	exports['default'] = createMemoryHistory;
	module.exports = exports['default'];

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2013-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 *
	 * @providesModule invariant
	 */

	'use strict';

	/**
	 * Use invariant() to assert state which your program assumes to be true.
	 *
	 * Provide sprintf-style format (only %s is supported) and arguments
	 * to provide information about what broke and what you were
	 * expecting.
	 *
	 * The invariant message will be stripped in production, but the invariant
	 * will remain to ensure logic does not differ in production.
	 */

	var invariant = function(condition, format, a, b, c, d, e, f) {
	  if (false) {
	    if (format === undefined) {
	      throw new Error('invariant requires an error message argument');
	    }
	  }

	  if (!condition) {
	    var error;
	    if (format === undefined) {
	      error = new Error(
	        'Minified exception occurred; use the non-minified dev environment ' +
	        'for the full error message and additional helpful warnings.'
	      );
	    } else {
	      var args = [a, b, c, d, e, f];
	      var argIndex = 0;
	      error = new Error(
	        'Invariant Violation: ' +
	        format.replace(/%s/g, function() { return args[argIndex++]; })
	      );
	    }

	    error.framesToPop = 1; // we don't care about invariant's own frame
	    throw error;
	  }
	};

	module.exports = invariant;


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * Copyright 2014-2015, Facebook, Inc.
	 * All rights reserved.
	 *
	 * This source code is licensed under the BSD-style license found in the
	 * LICENSE file in the root directory of this source tree. An additional grant
	 * of patent rights can be found in the PATENTS file in the same directory.
	 */

	'use strict';

	/**
	 * Similar to invariant but only logs a warning if the condition is not met.
	 * This can be used to log issues in development environments in critical
	 * paths. Removing the logging code for production environments will keep the
	 * same logic and follow the same code paths.
	 */

	var warning = function() {};

	if (false) {
	  warning = function(condition, format, args) {
	    var len = arguments.length;
	    args = new Array(len > 2 ? len - 2 : 0);
	    for (var key = 2; key < len; key++) {
	      args[key - 2] = arguments[key];
	    }
	    if (format === undefined) {
	      throw new Error(
	        '`warning(condition, format, ...args)` requires a warning ' +
	        'message argument'
	      );
	    }

	    if (format.length < 10 || (/^[s\W]*$/).test(format)) {
	      throw new Error(
	        'The warning format should be able to uniquely identify this ' +
	        'warning. Please, use a more descriptive format than: ' + format
	      );
	    }

	    if (!condition) {
	      var argIndex = 0;
	      var message = 'Warning: ' +
	        format.replace(/%s/g, function() {
	          return args[argIndex++];
	        });
	      if (typeof console !== 'undefined') {
	        console.error(message);
	      }
	      try {
	        // This error was thrown as a convenience so that you can use this stack
	        // to find the callsite that caused this warning to fire.
	        throw new Error(message);
	      } catch(x) {}
	    }
	  };
	}

	module.exports = warning;


/***/ }
/******/ ])
});
;