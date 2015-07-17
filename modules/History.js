import invariant from 'invariant';
import warning from 'warning';
import NavigationTypes from './NavigationTypes';
import { getPathname, getSearchString } from './URLUtils';
import Location from './Location';

export var RequiredSubclassMethods = [ 'pushState', 'replaceState', 'go' ];

function removeItem(array, object) {
  return array.filter(item => item !== object);
}

/**
 * A history interface that normalizes the differences across
 * various environments and implementations. Requires concrete
 * subclasses to implement the following methods:
 *
 * - pushState(state, path)
 * - replaceState(state, path)
 * - go(n)
 */
class History {

  static isHistory(object) {
    return object instanceof History;
  }

  constructor(options={}) {
    RequiredSubclassMethods.forEach(function (method) {
      invariant(
        typeof this[method] === 'function',
        '%s needs a "%s" method',
        this.constructor.name, method
      );
    }, this);

    this.getUserConfirmation = options.getUserConfirmation;

    this.transitionHooks = [];
    this.changeListeners = [];

    this.path = null;
    this.location = null;
  }

  registerTransitionHook(hook) {
    var hooks = this.transitionHooks;

    if (hooks.indexOf(hook) === -1)
      hooks.push(hook);
  }

  unregisterTransitionHook(hook) {
    this.transitionHooks = removeItem(this.transitionHooks, hook);
  }

  getTransitionConfirmationMessage() {
    var hooks = this.transitionHooks;

    var message;
    for (var i = 0, len = hooks.length; i < len && typeof message !== 'string'; ++i)
      message = hooks[i].call(this);

    return message;
  }

  confirmTransition(callback) {
    var message;
    if (this.getUserConfirmation && (message = this.getTransitionConfirmationMessage())) {
      this.getUserConfirmation(message, (ok) => {
        callback.call(this, ok !== false);
      });
    } else {
      callback.call(this, true);
    }
  }

  _notifyChange() {
    for (var i = 0, len = this.changeListeners.length; i < len; ++i)
      this.changeListeners[i].call(this, this.location);
  }

  addChangeListener(listener) {
    this.changeListeners.push(listener);
  }

  removeChangeListener(listener) {
    this.changeListeners = removeItem(this.changeListeners, listener);
  }

  listen(listener) {
    this.addChangeListener(listener);

    if (this.location) {
      listener.call(this, this.location);
    } else {
      this.setup();
    }

    return this.removeChangeListener.bind(this, listener);
  }

  setup(path, entry = {}) {
    if (this.location)
      return;

    if (!entry.key)
      entry = this.replace(path, this.createRandomKey());

    var state = null;
    if (typeof this.readState === 'function')
      state = this.readState(entry.key);

    var location = this._createLocation(path, state, entry, NavigationTypes.POP);
    this._update(path, location, false);
  }

  teardown() {
    this.changeListeners = [];

    this.path = null;
    this.location = null;
  }

  handlePop(path, entry={}) {
    var state = null;
    if (entry.key && typeof this.readState === 'function')
      state = this.readState(entry.key);

    var pendingLocation = this._createLocation(path, state, entry, NavigationTypes.POP);

    this.confirmTransition(ok => {
      if (ok)
        this._update(path, pendingLocation);
    });
  }

  createRandomKey() {
    return Math.random().toString(36).substr(2);
  }

  _saveNewState(state) {
    var key = this.createRandomKey();

    if (state != null) {
      invariant(
        typeof this.saveState === 'function',
        '%s needs a saveState method in order to store state',
        this.constructor.name
      );

      this.saveState(key, state);
    }

    return key;
  }

  canUpdateState() {
    return typeof this.readState === 'function'
      && typeof this.saveState === 'function'
      && this.location
      && this.location.state
      && this.location.state.key;
  }

  updateState(extraState) {
    invariant(
      this.canUpdateState(),
      '%s is unable to update state right now',
      this.constructor.name
    );

    var key = this.location.state.key;
    var state = this.readState(key);
    this.saveState(key, { ...state, ...extraState });
  }

  pushState(state, path) {
    this.confirmTransition(ok => {
      if (ok)
        this._doPushState(state, path)
    });
  }

  _doPushState(state, path) {
    var key = this._saveNewState(state);
    var entry = null;

    if (this.path === path) {
      entry = this.replace(path, key) || {};
    } else {
      entry = this.push(path, key) || {};
    }

    warning(
      entry.key || state == null,
      '%s does not support storing state',
      this.constructor.name
    );

    var location = this._createLocation(path, state, entry, NavigationTypes.PUSH);
    this._update(path, location);
  }

  replaceState(state, path) {
    this.confirmTransition(ok => {
      if (ok)
        this._doReplaceState(state, path);
    });
  }

  _doReplaceState(state, path) {
    var key = this._saveNewState(state);
    var entry = this.replace(path, key) || {};

    warning(
      entry.key || state == null,
      '%s does not support storing state',
      this.constructor.name
    );

    var location = this._createLocation(path, state, entry, NavigationTypes.REPLACE);
    this._update(path, location);
  }

  back() {
    this.go(-1);
  }

  forward() {
    this.go(1);
  }

  _update(path, location, notify=true) {
    this.path = path;
    this.location = location;

    if (notify)
      this._notifyChange();
  }

  _createLocation(path, state, entry, navigationType) {
    var pathname = getPathname(path);
    var searchString = getSearchString(path);
    return new Location(pathname, searchString, {...state, ...entry}, navigationType);
  }

}

export default History;
