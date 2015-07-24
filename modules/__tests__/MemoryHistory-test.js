import describeHistory from './describeHistory';
import createMemoryHistory from '../createMemoryHistory';
import expect from 'expect';

describe('memory history', function () {
  describeHistory(createMemoryHistory);

  describe('when the user pushState in middle of stack', function() {
    it('clears rest of stack so the user can not go forward', function() {
      var history = createMemoryHistory(), location;

      history.listen(function(loc) {
        location = loc;
      });

      history.pushState({ id: 1 }, '/1');
      history.pushState({ id: 2 }, '/2');
      history.pushState({ id: 3 }, '/3');
      history.pushState({ id: 4 }, '/4');

      expect(location.state).toEqual({ id: 4 });

      history.go(-2);

      expect(location.state).toEqual({ id: 2 });

      history.pushState({ id: 5 }, '/5');

      expect(location.state).toEqual({ id: 5 });
      expect(location.pathname).toEqual('/5');

      history.goBack();

      expect(location.state).toEqual({ id: 2 });

      history.goForward();

      expect(location.state).toEqual({ id: 5 });
      expect(location.pathname).toEqual('/5');

      expect(function () {
        history.goForward();
      }).toThrow(/Cannot go\(\d+\); there is not enough history/);
    });
  });

  describe('when the user cancels a POP transition', function () {
    it('preserves the existing URL');
  });
});
