import describeDOMHistory from './describeDOMHistory';
import createHashHistory from '../modules/createHashHistory';

describe('hash history', function () {
  describeDOMHistory(createHashHistory);
});
