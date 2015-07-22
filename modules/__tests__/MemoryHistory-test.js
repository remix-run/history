import describeHistory from './describeHistory';
import createMemoryHistory from '../createMemoryHistory';
import expect from 'expect';

describe('memory history', function () {
  describeHistory(createMemoryHistory);

  describe('when the user pushState in middle of stack', function() {
    it('clears rest of stack so the user can not go forward', function() {
      var history = createMemoryHistory(), currentLocation;

      history.listen(function(loc) {
        currentLocation = loc;
      });

      history.pushState({ state: 1 }, '/1');
      history.pushState({ state: 2 }, '/2');
      history.pushState({ state: 3 }, '/3');
      history.pushState({ state: 4 }, '/4');

      expect(currentLocation.state).toEqual({ state: 4 });

      history.go(-2);

      expect(currentLocation.state).toEqual({ state: 2 });

      history.pushState({ state: 5 }, '/5');

      expect(currentLocation.state).toEqual({ state: 5 });
      expect(currentLocation.pathname).toEqual('/5');

      history.goBack();

      expect(currentLocation.state).toEqual({ state: 2 });

      history.goForward();

      expect(currentLocation.state).toEqual({ state: 5 });
      expect(currentLocation.pathname).toEqual('/5');

      expect(function() {
        history.goForward();
      }).toThrow(/Cannot go\(\d+\); there is not enough history/);
    });
  });

  describe('when the user cancels a POP transition', function () {
    it('preserves the existing URL');
  });
});
