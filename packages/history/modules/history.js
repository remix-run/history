export { createHistory as createBrowserHistory } from './browser.js';
export { createHistory as createHashHistory } from './hash.js';
export { createHistory as createMemoryHistory } from './memory.js';

if (__DEV__) {
  // TODO: warn about tree-shakability of this module. Needs
  // testing to be sure about recommendations for use.
}
