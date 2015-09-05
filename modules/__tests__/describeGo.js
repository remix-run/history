import expect from 'expect';
import { PUSH, POP } from '../Actions';
import execSteps from './execSteps';

function describeGo(createHistory) {
  describe('go', function () {
    let history, unlisten;
    beforeEach(function () {
      history = createHistory();
    });

    afterEach(function () {
      if (unlisten)
        unlisten();
    });

    describe('back', function () {
      it('calls change listeners with the previous location', function (done) {
        let steps = [
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
          }
        ];

        unlisten = history.listen(execSteps(steps, done));
      });
    });

    describe('forward', function () {
      it('calls change listeners with the next location', function (done) {
        let steps = [
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
            expect(location.state).toEqual({ the: 'state' });
            expect(location.action).toEqual(POP);
          }
        ];

        unlisten = history.listen(execSteps(steps, done));
      });
    });
  });
}

export default describeGo;
