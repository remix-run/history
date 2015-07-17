import assert from 'assert';
import expect, { createSpy, spyOn } from 'expect';
import History, { RequiredSubclassMethods } from '../History';

function describeHistory(history) {
  it('is a History', function () {
    assert(History.isHistory(history));
  });

  RequiredSubclassMethods.forEach(function (method) {
    it('has a ' + method + ' method', function () {
      expect(history[method]).toBeA('function');
    });
  });

  describe('adding/removing a listener', function () {
    var pushStateSpy, goSpy;
    beforeEach(function () {
      // It's a bit tricky to test change listeners properly because
      // they are triggered when the URL changes. So we need to stub
      // out push/go to only notify listeners ... but we can't make
      // assertions on the location because it will be wrong.
      pushStateSpy = spyOn(history, 'pushState').andCall(history._notifyChange);
      goSpy = spyOn(history, 'go').andCall(history._notifyChange);
    });

    afterEach(function () {
      pushStateSpy.restore();
      goSpy.restore();
    });

    it('works', function () {
      var spy = expect.createSpy(function () {});

      history.addChangeListener(spy);
      history.pushState(null, '/home'); // call #1
      expect(pushStateSpy).toHaveBeenCalled();

      expect(spy.calls.length).toEqual(1);

      history.removeChangeListener(spy)
      history.back(); // call #2
      expect(goSpy).toHaveBeenCalled();

      expect(spy.calls.length).toEqual(1);
    });
  });
}

export default describeHistory;
