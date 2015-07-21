import describeHistory from './describeHistory';
import createMemoryHistory from '../createMemoryHistory';

describe('memory history', function () {
  describeHistory(createMemoryHistory);

  describe('when the user cancels a POP transition', function () {
    it('preserves the existing URL');
  });
});
