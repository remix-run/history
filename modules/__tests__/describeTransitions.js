import assert from 'assert';
import expect from 'expect';
import { PUSH } from '../Actions';

function describeTransitions(createHistory) {
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

  describe('when middleware delays a transition', function() {
    var location, history, unlisten, unregister;
    beforeEach(function () {
      location = null;

      history = createHistory();

      unregister = history.registerTransitionMiddleware(function (nextLocation, prevLocation, fnNext) {
        setTimeout(fnNext, 10);
      });

      unlisten = history.listen(function (loc) {
        location = loc;
      });
    });

    afterEach(function () {
      unlisten();
      unregister();
    });

    it('does not immediately update the location', function () {
      var prevLocation = location;
      history.pushState(null, '/home1');
      expect(prevLocation).toBe(location);
    });

    it('does update the location after the middleware completes', function (done) {
      var prevLocation = location;
      history.pushState(null, '/home2');
      setTimeout(function() {
        expect(prevLocation).toNotBe(location);
        done();
      }, 25);
    });

  });

  describe('when the user cancels a POP transition', function () {
    it('puts the URL back');
  });
}

export default describeTransitions;
