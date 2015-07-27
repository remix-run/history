import assert from 'assert';
import expect from 'expect';
import { PUSH } from '../Actions';
import { supportsGoUsingHashWithoutReload } from '../DOMUtils';
import createHashHistory from '../createHashHistory';
import describeTransitions from './describeTransitions';
import describePushState from './describePushState';
import describeReplaceState from './describeReplaceState';
import describeGo from './describeGo';
import execSteps from './execSteps';

function describeHashStatePersistence(createHistory) {
  describe('when the user does not want to persist a state', function () {
    var history, unlisten;
    beforeEach(function () {
      history = createHashHistory({ queryKey: false });
    });

    afterEach(function () {
      if (unlisten)
        unlisten();
    });

    it('forgets state across transitions and do not store key in query string', function (done) {
      var steps = [
        function () {
          history.pushState({ the: 'state' }, '/home?the=query');
        },
        function (location) {
          expect(location.state).toEqual({ the: 'state' });
          expect(location.pathname).toEqual('/home');
          expect(location.search).toEqual('?the=query');
          expect(location.action).toEqual(PUSH);
          history.goBack();
        },
        function () {
          history.goForward();
        },
        function (location) {
          expect(location.state).toEqual(null);
          expect(location.search).toEqual('?the=query');
          expect(window.location.hash).toEqual('#/home?the=query');
        }
      ];

      unlisten = history.listen(execSteps(steps, done));
    });
  });

  describe('when the user wants to persist a state', function () {
    var location, history, unlisten;
    beforeEach(function () {
      location = null;
      history = createHashHistory({ queryKey: 'a' });
      unlisten = history.listen(function (loc) {
        location = loc;
      });
    });

    afterEach(function () {
      if (unlisten)
        unlisten();
    });

    it('remembers state across transitions and store key in the given query parameter', function (done) {
      var steps = [
        function () {
          history.pushState({ the: 'state' }, '/home?the=query');
        },
        function (location) {
          expect(location.state).toEqual({ the: 'state' });
          expect(location.pathname).toEqual('/home');
          expect(location.search).toEqual('?the=query');
          expect(location.action).toEqual(PUSH);
          expect(window.location.hash).toEqual('#/home?the=query&a=' + location.key);
          history.goBack();
        },
        function () {
          history.goForward();
        },
        function (location) {
          expect(location.state).toEqual({ the: 'state' });
          expect(location.search).toEqual('?the=query');
          expect(window.location.hash).toEqual('#/home?the=query&a=' + location.key);
        }
      ];

      unlisten = history.listen(execSteps(steps, done));
    });
  });
}

describe('hash history', function () {
  afterEach(function () {
    if (window.location.hash !== '')
      window.location.hash = '';
  });

  describeTransitions(createHashHistory);
  describePushState(createHashHistory);
  describeReplaceState(createHashHistory);

  var canTestGo = supportsGoUsingHashWithoutReload();

  if (canTestGo) {
    describe(null, function () {
      describeGo(createHashHistory);
      describeHashStatePersistence(createHashHistory);
    });
  } else {
    describe.skip(null, function () {
      describeGo(createHashHistory);
      describeHashStatePersistence(createHashHistory);
    });
  }
});
