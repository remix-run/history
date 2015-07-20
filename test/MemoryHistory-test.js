import describeHistory from './describeHistory';
import createMemoryHistory from '../modules/createMemoryHistory';

describe('memory history', function () {
  describeHistory(createMemoryHistory);
});
