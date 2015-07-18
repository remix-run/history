import expect from 'expect';
import { getPathname, getSearchString } from '../StringUtils';

describe('getPathname', function () {
  it('returns the pathname portion of a path', function () {
    expect(getPathname('/a/b/c?id=def')).toEqual('/a/b/c');
  });
});

describe('getSearchString', function () {
  it('returns the search portion of a path', function () {
    expect(getSearchString('/a/b/?id=def')).toEqual('?id=def');
  });
});
