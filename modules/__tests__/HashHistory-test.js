import assert from 'assert';
import expect from 'expect';
import { PUSH, POP } from '../Actions';
import { supportsGoWithoutReloadUsingHash } from '../DOMUtils';
import createHashHistory from '../createHashHistory';
import describeTransitions from './describeTransitions';
import describePushState from './describePushState';
import describeReplaceState from './describeReplaceState';
import describeSetState from './describeSetState';
import describeGo from './describeGo';
import execSteps from './execSteps';
import describeInitialLocation from './describeInitialLocation';

function describeStatePersistence(createHistory) {
  describe('when the user does not want to persist a state', function () {
    var history, unlisten;
    beforeEach(function () {
      history = createHistory({ queryKey: false });
    });

    afterEach(function () {
      if (unlisten)
        unlisten();
    });

    it('forgets state across transitions', function (done) {
      var steps = [
        function (location) {
          expect(location.pathname).toEqual('/');
          expect(location.search).toEqual('');
          expect(location.state).toEqual(null);
          expect(location.action).toEqual(POP);

          history.pushState(null, '/home?the=query');
        },
        function (location) {
          expect(location.pathname).toEqual('/home');
          expect(location.search).toEqual('?the=query');
          expect(location.state).toEqual(null);
          expect(location.action).toEqual(PUSH);

          history.goBack();
        },
        function (location) {
          expect(location.pathname).toEqual('/');
          expect(location.search).toEqual('');
          expect(location.state).toEqual(null);
          expect(location.action).toEqual(POP);

          history.goForward();
        },
        function (location) {
          expect(location.pathname).toEqual('/home');
          expect(location.search).toEqual('?the=query');
          expect(location.state).toEqual(null); // State is missing.
          expect(location.action).toEqual(POP);
        }
      ];

      unlisten = history.listen(execSteps(steps, done));
    });
  });

  describe('when the user wants to persist state', function () {
    var history, unlisten;
    beforeEach(function () {
      history = createHistory({ queryKey: 'a' });
    });

    afterEach(function () {
      if (unlisten)
        unlisten();
    });

    it('remembers state across transitions', function (done) {
      var steps = [
        function (location) {
          expect(location.pathname).toEqual('/');
          expect(location.search).toEqual('');
          expect(location.state).toEqual(null);
          expect(location.action).toEqual(POP);

          history.pushState({ the: 'state' }, '/home?the=query');
        },
        function (location) {
          expect(location.pathname).toEqual('/home');
          expect(location.search).toEqual('?the=query');
          expect(location.state).toEqual({ the: 'state' });
          expect(location.action).toEqual(PUSH);

          history.goBack();
        },
        function (location) {
          expect(location.pathname).toEqual('/');
          expect(location.search).toEqual('');
          expect(location.state).toEqual(null);
          expect(location.action).toEqual(POP);

          history.goForward();
        },
        function (location) {
          expect(location.pathname).toEqual('/home');
          expect(location.search).toEqual('?the=query');
          expect(location.state).toEqual({ the: 'state' }); // State is present.
          expect(location.action).toEqual(POP);
        }
      ];

      unlisten = history.listen(execSteps(steps, done));
    });
  });
}

describe('hash history', function () {
  beforeEach(function () {
    if (window.location.hash !== '')
      window.location.hash = '';
  });

  describeInitialLocation(createHashHistory);
  describeTransitions(createHashHistory);
  describePushState(createHashHistory);
  describeReplaceState(createHashHistory);
  describeSetState(createHashHistory);

  if (supportsGoWithoutReloadUsingHash()) {
    describeGo(createHashHistory);
    describeStatePersistence(createHashHistory);
  } else {
    describe.skip(null, function () {
      describeGo(createHashHistory);
      describeStatePersistence(createHashHistory);
    });
  }

  it('knows how to make hrefs', function () {
    var history = createHashHistory();
    expect(history.createHref('/a/path')).toEqual('#/a/path');
  });
});
