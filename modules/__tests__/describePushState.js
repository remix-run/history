import assert from 'assert';
import expect from 'expect';
import { PUSH } from '../Actions';

function describePushState(createHistory) {
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

  describe('pushState', function () {
    it('calls change listeners with the new location', function () {
      history.pushState({ the: 'state' }, '/home?the=query');

      assert(location);
      expect(location.pathname).toEqual('/home');
      expect(location.search).toEqual('?the=query');
      expect(location.state).toEqual({ the: 'state' });
      expect(location.action).toEqual(PUSH);
      assert(location.key);
    });
  });
}

export default describePushState;
