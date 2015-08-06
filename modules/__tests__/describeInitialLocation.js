import expect from 'expect';
import { POP } from '../Actions';
import createMemoryHistory from '../createMemoryHistory';

function describeInitialLocation(createHistory) {
  describe('location has key on initial pop', function() {
    var unlisten, history;

    beforeEach(function() {
      history = createHistory();
    });

    afterEach(function() {
      if (unlisten) unlisten();
    });

    it('replaces state if location key is missing', function(done) {
      unlisten = history.listen(function(location) {
        try {
          expect(location.action).toEqual(POP);
          expect(location.key).toNotEqual(null);
          expect(location.state).toEqual(null);
          done();
        } catch (e) {
          done(e);
        }
      });
    });

    it('emits POP with current location key', function(done) {
      // set initial state, this is needed because all implementations gets state from different places
      history.pushState({ initial: 'state' }, '/');

      // now create history for testing if initial POP event has location.key
      history = createHistory();

      unlisten = history.listen(function(location) {
        try {
          expect(location.action).toEqual(POP);
          expect(location.key).toNotEqual(null);

          // in case of memory history we can get saved state, because generated key is always unique
          // and even if we save state to sessionStorage, we can not get it between instances of MemoryHistory
          // because key will be not mapped to given state
          if (createHistory !== createMemoryHistory) {
            expect(location.state).toEqual({ initial: 'state' });
          } else {
            expect(location.state).toEqual(null);
          }

          done();
        } catch (e) {
          done(e);
        }
      });
    });
  });
}

export default describeInitialLocation;