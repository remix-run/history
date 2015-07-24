import assert from 'assert';
import expect from 'expect';
import { PUSH, REPLACE, POP } from '../Actions';
import execSteps from './execSteps';

function describeHistory(createHistory, goCausesReload) {
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
      var prevLocation = location;
      history.pushState(null, '/home');
      expect(prevLocation).toBe(location);
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

  var describeGo = goCausesReload ? describe.skip : describe;

  describeGo('goBack', function () {
    var history, unlisten;
    beforeEach(function () {
      history = createHistory();
    });

    afterEach(function () {
      if (unlisten)
        unlisten();
    });

    it('calls change listeners with the previous location', function (done) {
      var prevLocation;
      var steps = [
        function (location) {
          prevLocation = location;
          history.pushState({ the: 'state' }, '/one?the=query');
        },
        function (location) {
          expect(location.state).toEqual({ the: 'state' });
          expect(location.pathname).toEqual('/one');
          expect(location.search).toEqual('?the=query');
          expect(location.action).toEqual(PUSH);
          history.goBack();
        },
        function (location) {
          expect(location.action).toEqual(POP);
          expect(prevLocation).toEqual(location);
        }
      ];

      unlisten = history.listen(execSteps(steps, done));
    });
  });

  describeGo('goForward', function () {
    var history, unlisten;
    beforeEach(function () {
      history = createHistory();
    });

    afterEach(function () {
      if (unlisten)
        unlisten();
    });

    it('calls change listeners with the previous location', function (done) {
      var prevLocation, nextLocation;
      var steps = [
        function (location) {
          prevLocation = location;
          history.pushState({ the: 'state' }, '/one?the=query');
        },
        function (location) {
          nextLocation = location;
          expect(location.state).toEqual({ the: 'state' });
          expect(location.pathname).toEqual('/one');
          expect(location.search).toEqual('?the=query');
          expect(location.action).toEqual(PUSH);
          history.goBack();
        },
        function (location) {
          expect(location.action).toEqual(POP);
          expect(prevLocation).toEqual(location);
          history.goForward();
        },
        function (location) {
          var nextLocationPop = { ...nextLocation, action: POP };
          expect(nextLocationPop).toEqual(location);
        }
      ];

      unlisten = history.listen(execSteps(steps, done));
    });
  });
}

export default describeHistory;
