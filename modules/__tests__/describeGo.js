import expect from 'expect';
import { PUSH, POP } from '../Actions';
import execSteps from './execSteps';

function describeGo(createHistory) {
  var history, unlisten;
  beforeEach(function () {
    history = createHistory();
  });

  afterEach(function () {
    if (unlisten)
      unlisten();
  });

  describe('goBack', function () {
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

  describe('goForward', function () {
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

export default describeGo;
