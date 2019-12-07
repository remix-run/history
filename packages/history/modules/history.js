export {
  default as browserHistory,
  createHistory as createBrowserHistory
} from './browser.js';
export {
  default as hashHistory,
  createHistory as createHashHistory
} from './hash.js';
export { createHistory as createMemoryHistory } from './memory.js';
