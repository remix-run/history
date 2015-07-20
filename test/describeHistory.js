import assert from 'assert';
import expect from 'expect';
import { PUSH, REPLACE, POP } from '../modules/Actions';

function describeHistory(createHistory) {
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
      var initialLocation = location;
      history.pushState({ the: 'state' }, '/home?the=query');
      expect(initialLocation).toNotBe(location);

      assert(location);
      assert(location.key);
      expect(location.state).toEqual({ the: 'state' });
      expect(location.pathname).toEqual('/home');
      expect(location.search).toEqual('?the=query');
      expect(location.action).toEqual(PUSH);
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
      var initialLocation = location;
      history.pushState(null, '/home');
      expect(initialLocation).toBe(location);
    });
  });

  describe('pushState', function () {
    var location, history, unlisten;
    beforeEach(function () {
      location = null;
      history = createHistory();
      unlisten = history.listen(function (loc) {
        location = loc;
      });
    });

    afterEach(function () {
      if (unlisten)
        unlisten();
    });

    it('calls change listeners with the new location', function () {
      history.pushState({ the: 'state' }, '/home?the=query');

      assert(location);
      assert(location.key);
      expect(location.state).toEqual({ the: 'state' });
      expect(location.pathname).toEqual('/home');
      expect(location.search).toEqual('?the=query');
      expect(location.action).toEqual(PUSH);
    });
  });

  describe('replaceState', function () {
    var location, history, unlisten;
    beforeEach(function () {
      location = null;
      history = createHistory();
      unlisten = history.listen(function (loc) {
        location = loc;
      });
    });

    afterEach(function () {
      if (unlisten)
        unlisten();
    });

    it('calls change listeners with the new location', function () {
      history.replaceState({ more: 'state' }, '/feed?more=query');

      assert(location);
      assert(location.key);
      expect(location.state).toEqual({ more: 'state' });
      expect(location.pathname).toEqual('/feed');
      expect(location.search).toEqual('?more=query');
      expect(location.action).toEqual(REPLACE);
    });
  });

  describe('goBack', function () {
    var history, unlisten;
    beforeEach(function () {
      window.history.replaceState(null, null, '/');
      history = createHistory();
    });

    afterEach(function () {
      if (unlisten)
        unlisten();
    });

    it('calls change listeners with the previous location', function (done) {
      var initialLocation;
      var steps = [
        function (location) {
          initialLocation = location;
          history.pushState({ the: 'state' }, '/two?a=query');
        },
        function (location) {
          expect(location.state).toEqual({ the: 'state' });
          expect(location.pathname).toEqual('/two');
          expect(location.search).toEqual('?a=query');
          expect(location.action).toEqual(PUSH);
          history.goBack();
        },
        function (location) {
          expect(location.action).toEqual(POP);
          expect(initialLocation).toEqual(location);
          done();
        }
      ];

      function execNextStep() {
        try {
          steps.shift().apply(this, arguments);
        } catch (error) {
          done(error);
        }
      }

      unlisten = history.listen(execNextStep);
    });
  });

  describe('goForward', function () {
    var history, unlisten;
    beforeEach(function () {
      window.history.replaceState(null, null, '/');
      history = createHistory();
    });

    afterEach(function () {
      if (unlisten)
        unlisten();
    });

    it('calls change listeners with the previous location', function (done) {
      var initialLocation, nextLocation;
      var steps = [
        function (location) {
          initialLocation = location;
          history.pushState({ the: 'state' }, '/two?a=query');
        },
        function (location) {
          nextLocation = location;
          expect(location.state).toEqual({ the: 'state' });
          expect(location.pathname).toEqual('/two');
          expect(location.search).toEqual('?a=query');
          expect(location.action).toEqual(PUSH);
          history.goBack();
        },
        function (location) {
          expect(location.action).toEqual(POP);
          expect(initialLocation).toEqual(location);
          history.goForward();
        },
        function (location) {
          const nextLocationPop = { ...nextLocation, action: POP };
          expect(nextLocationPop).toEqual(location);
          done()
        }
      ];

      function execNextStep() {
        try {
          steps.shift().apply(this, arguments);
        } catch (error) {
          done(error);
        }
      }

      unlisten = history.listen(execNextStep);
    });
  });

  describe('when the user replaces state and goes back/forth', function() {
    var history, unlisten;
    beforeEach(function () {
      window.history.replaceState(null, null, '/');
      history = createHistory();
    });

    afterEach(function () {
      if (unlisten)
        unlisten();
    });

    it('replaces current history record with a new state', function(done) {
      var locations = {};
      var steps = [
        function (location) {
          locations[0] = location;
          history.pushState({ the: 'state' }, '/two?a=query');
        },
        function (location) {
          locations[1] = location;
          expect(location.state).toEqual({ the: 'state' });
          expect(location.pathname).toEqual('/two');
          expect(location.search).toEqual('?a=query');
          expect(location.action).toEqual(PUSH);
          history.goBack();
        },
        function (location) {
          expect(location.action).toEqual(POP);
          expect(locations[0]).toEqual(location);
          history.replaceState({ the: 'new state' }, location.pathname + (location.search || ''))
        },
        function (location) {
          locations[0] = location;
          history.goForward();
        },
        function (location) {
          const loc = locations[1];
          const nextLocationPop = { ...loc, action: POP };
          expect(nextLocationPop).toEqual(location);
          history.replaceState({ the: 'new state 2' }, location.pathname + (location.search || ''));
        },
        function (location) {
          locations[1] = location;
          history.goBack();
        },
        function(location) {
          expect(location.state).toEqual({ the: 'new state' });
          expect(location.key).toEqual(locations[0].key);
          expect(locations[0]).toNotEqual(location);
          history.goForward();
        },
        function(location) {
          expect(location.state).toEqual({ the: 'new state 2' });
          expect(location.key).toEqual(locations[1].key);
          done();
        }
      ];

      function execNextStep() {
        try {
          steps.shift().apply(this, arguments);
        } catch (error) {
          done(error);
        }
      }

      unlisten = history.listen(execNextStep);
    });
  });
}

export default describeHistory;
