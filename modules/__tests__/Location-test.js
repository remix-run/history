import expect from 'expect';
import createLocation from '../createLocation';
import { POP } from '../Actions';

describe('a location', function () {
  it('knows its pathname', function () {
    let location = createLocation('/home?the=query');
    expect(location.pathname).toEqual('/home');
  });

  it('knows its search string', function () {
    let location = createLocation('/home?the=query');
    expect(location.search).toEqual('?the=query');
  });

  it('has null state by default', function () {
    let location = createLocation();
    expect(location.state).toBe(null);
  });

  it('uses pop navigation by default', function () {
    let location = createLocation();
    expect(location.action).toBe(POP);
  })

  it('has null key by default', function () {
    let location = createLocation();
    expect(location.key).toBe(null);
  });
});
