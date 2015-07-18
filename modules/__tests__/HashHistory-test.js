import describeDOMHistory from './describeDOMHistory';
import createHashHistory from '../createHashHistory';

describe('hash history', function () {
  describeDOMHistory(createHashHistory);
});
