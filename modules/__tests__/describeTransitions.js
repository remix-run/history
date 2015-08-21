import assert from 'assert';
import expect from 'expect';
import { PUSH } from '../Actions';
import execSteps from './execSteps';

function describeTransitions(createHistory) {
  describe('a synchronous transition hook', function () {
    var history, unlisten;
    beforeEach(function () {
      history = createHistory();
    });

    afterEach(function () {
      if (unlisten)
        unlisten();
    });

    it('receives the next location', function (done) {
      var steps = [
        function () {
          history.pushState({ the: 'state' }, '/home?the=query');
        },
        function (location) {
          expect(nextLocation).toBe(location);
        }
      ];

      var nextLocation;
      history.registerTransitionHook(function (location) {
        nextLocation = location;
      });

      unlisten = history.listen(execSteps(steps, done));
    });
  });

  describe('an asynchronous transition hook', function () {
    var history, unlisten;
    beforeEach(function () {
      history = createHistory();
    });

    afterEach(function () {
      if (unlisten)
        unlisten();
    });

    it('receives the next location', function (done) {
      var steps = [
        function () {
          history.pushState({ the: 'state' }, '/home?the=query');
        },
        function (location) {
          expect(nextLocation).toBe(location);
        }
      ];

      var nextLocation;
      history.registerTransitionHook(function (location, callback) {
        nextLocation = location;
        setTimeout(callback);
      });

      unlisten = history.listen(execSteps(steps, done));
    });
  });

  describe('when the user confirms a transition', function () {
    var confirmationMessage, location, history, unlisten;
    beforeEach(function () {
      location = null;
      confirmationMessage = 'Are you sure?';

      history = createHistory({
        getUserConfirmation(message, callback) {
          expect(message).toBe(confirmationMessage);
          callback(true);
        }
      });

      history.registerTransitionHook(function () {
        return confirmationMessage;
      });

      unlisten = history.listen(function (loc) {
        location = loc;
      });
    });

    afterEach(function () {
      if (unlisten)
        unlisten();
    });

    it('updates the location', function () {
      var prevLocation = location;
      history.pushState({ the: 'state' }, '/home?the=query');
      expect(prevLocation).toNotBe(location);

      assert(location);
      expect(location.pathname).toEqual('/home');
      expect(location.search).toEqual('?the=query');
      expect(location.state).toEqual({ the: 'state' });
      expect(location.action).toEqual(PUSH);
      assert(location.key);
    });
  });

  describe('when the user cancels a transition', function () {
    var confirmationMessage, location, history, unlisten;
    beforeEach(function () {
      location = null;
      confirmationMessage = 'Are you sure?';

      history = createHistory({
        getUserConfirmation(message, callback) {
          expect(message).toBe(confirmationMessage);
          callback(false);
        }
      });

      history.registerTransitionHook(function () {
        return confirmationMessage;
      });

      unlisten = history.listen(function (loc) {
        location = loc;
      });
    });

    afterEach(function () {
      if (unlisten)
        unlisten();
    });

    it('does not update the location', function () {
      var prevLocation = location;
      history.pushState(null, '/home');
      expect(prevLocation).toBe(location);
    });
  });

  describe('when the transition hook cancels a transition', function () {
    var location, history, unlisten;
    beforeEach(function () {
      location = null;

      history = createHistory();

      history.registerTransitionHook(function () {
        return false;
      });

      unlisten = history.listen(function (loc) {
        location = loc;
      });
    });

    afterEach(function () {
      if (unlisten)
        unlisten();
    });

    it('does not update the location', function () {
      var prevLocation = location;
      history.pushState(null, '/home');
      expect(prevLocation).toBe(location);
    });
  });
}

export default describeTransitions;
