export { default as createBrowserHistory } from './createBrowserHistory.js';
export { default as createHashHistory } from './createHashHistory.js';
export { default as createMemoryHistory } from './createMemoryHistory.js';
export { parsePath, createPath } from './PathUtils.js';

import deprecate from './deprecate.js';
import { createLocation, locationsAreEqual } from './LocationUtils.js';

const deprecatedCreateLocation = deprecate(
  createLocation,
  'createLocation is deprecated and will be removed in the next major release.' +
    ' To create a location object from a URL string, use `location = parsePath(url)` instead.'
);

const deprecatedLocationsAreEqual = deprecate(
  locationsAreEqual,
  'locationsAreEqual is deprecated and will be removed in the next major release.' +
    ' To check if two location objects represent the same location, compare `locationA.key === locationB.key` instead.'
);

export {
  deprecatedCreateLocation as createLocation,
  deprecatedLocationsAreEqual as locationsAreEqual
};
