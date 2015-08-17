import expect from 'expect';
import { PUSH, POP } from '../Actions';
import execSteps from './execSteps';

function describeGo(createHistory) {
  describe('go', function () {
    var history, unlisten;
    beforeEach(function () {
      history = createHistory();
    });

    afterEach(function () {
      if (unlisten)
        unlisten();
    });

    describe('back', function () {
      it('calls change listeners with the previous location', function (done) {
        var steps = [
          function (location) {
            expect(location.pathname).toEqual('/');
            expect(location.search).toEqual('');
            expect(location.state).toEqual(null);
            expect(location.action).toEqual(POP);
            expect(location.current).toEqual(0);

            history.pushState({ the: 'state' }, '/home?the=query');
          },
          function (location) {
            expect(location.pathname).toEqual('/home');
            expect(location.search).toEqual('?the=query');
            expect(location.state).toEqual({ the: 'state' });
            expect(location.action).toEqual(PUSH);
            expect(location.current).toEqual(1);

            history.goBack();
          },
          function (location) {
            expect(location.pathname).toEqual('/');
            expect(location.search).toEqual('');
            expect(location.state).toEqual(null);
            expect(location.action).toEqual(POP);
            expect(location.current).toEqual(0);
          }
        ];

        unlisten = history.listen(execSteps(steps, done));
      });
    });

    describe('forward', function () {
      it('calls change listeners with the next location', function (done) {
        var steps = [
          function (location) {
            expect(location.pathname).toEqual('/');
            expect(location.search).toEqual('');
            expect(location.state).toEqual(null);
            expect(location.action).toEqual(POP);
            expect(location.current).toEqual(0);

            history.pushState({ the: 'state' }, '/home?the=query');
          },
          function (location) {
            expect(location.pathname).toEqual('/home');
            expect(location.search).toEqual('?the=query');
            expect(location.state).toEqual({ the: 'state' });
            expect(location.action).toEqual(PUSH);
            expect(location.current).toEqual(1);

            history.goBack();
          },
          function (location) {
            expect(location.pathname).toEqual('/');
            expect(location.search).toEqual('');
            expect(location.state).toEqual(null);
            expect(location.action).toEqual(POP);
            expect(location.current).toEqual(0);

            history.goForward();
          },
          function (location) {
            expect(location.pathname).toEqual('/home');
            expect(location.search).toEqual('?the=query');
            expect(location.state).toEqual({ the: 'state' });
            expect(location.action).toEqual(POP);
            expect(location.current).toEqual(1);
          }
        ];

        unlisten = history.listen(execSteps(steps, done));
      });
    });
  });
}

export default describeGo;
