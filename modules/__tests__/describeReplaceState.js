import assert from 'assert';
import expect from 'expect';
import { REPLACE } from '../Actions';

function describeReplaceState(createHistory) {
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

  describe('replaceState', function () {
    it('calls change listeners with the new location', function () {
      history.replaceState({ more: 'state' }, '/feed?more=query');

      assert(location);
      expect(location.pathname).toEqual('/feed');
      expect(location.search).toEqual('?more=query');
      expect(location.state).toEqual({ more: 'state' });
      expect(location.action).toEqual(REPLACE);
      assert(location.key);
    });
  });
}

export default describeReplaceState;
