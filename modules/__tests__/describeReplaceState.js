import expect from 'expect';
import { REPLACE, POP } from '../Actions';
import execSteps from './execSteps';

function describeReplaceState(createHistory) {
  describe('replaceState', function () {
    var history, unlisten;
    beforeEach(function () {
      history = createHistory();
    });

    afterEach(function () {
      if (unlisten)
        unlisten();
    });

    it('calls change listeners with the new location', function (done) {
      var steps = [
        function (location) {
          expect(location.pathname).toEqual('/');
          expect(location.search).toEqual('');
          expect(location.state).toEqual(null);
          expect(location.action).toEqual(POP);

          history.replaceState({ the: 'state' }, '/home?the=query');
        },
        function (location) {
          expect(location.pathname).toEqual('/home');
          expect(location.search).toEqual('?the=query');
          expect(location.state).toEqual({ the: 'state' });
          expect(location.action).toEqual(REPLACE);
        }
      ];

      unlisten = history.listen(execSteps(steps, done));
    });
  });
}

export default describeReplaceState;
