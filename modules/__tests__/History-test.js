import assert from 'assert';
import expect from 'expect';
import History from '../History';

describe('History.isHistory', function () {
  it('returns true for History objects', function () {
    assert(History.isHistory(Object.create(History.prototype)));
  });

  it('returns false for other objects', function () {
    expect(History.isHistory('hello')).toBe(false);
    expect(History.isHistory(1234567)).toBe(false);
  });
});
