import describeHistory from './describeHistory';
import createMemoryHistory from '../createMemoryHistory';

describe('memory history', function () {
  describeHistory(createMemoryHistory);
});
