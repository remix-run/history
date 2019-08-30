import expect from 'expect';
import mock from 'jest-mock';
import { createHashHistory } from 'history';

describe('a hash history with a basename', () => {
  it('knows how to create hrefs', () => {
    window.location.hash = '#/the/base';
    const history = createHashHistory({ basename: '/the/base' });
    const href = history.createHref({
      pathname: '/the/path',
      search: '?the=query'
    });

    expect(href).toEqual('#/the/base/the/path?the=query');
  });

  describe('with a bad basename', () => {
    it('knows how to create hrefs', () => {
      window.location.hash = '#/the/bad/base/';
      const history = createHashHistory({ basename: '/the/bad/base/' });
      const href = history.createHref({
        pathname: '/the/path',
        search: '?the=query'
      });

      expect(href).toEqual('#/the/bad/base/the/path?the=query');
    });
  });

  describe('with a slash basename', () => {
    it('knows how to create hrefs', () => {
      const history = createHashHistory({ basename: '/' });
      const href = history.createHref({
        pathname: '/the/path',
        search: '?the=query'
      });

      expect(href).toEqual('#/the/path?the=query');
    });
  });

  it('strips the basename from the pathname', () => {
    window.location.hash = '/prefix/hello';
    const history = createHashHistory({ basename: '/prefix' });
    expect(history.location.pathname).toEqual('/hello');
  });

  it('is not case-sensitive', () => {
    window.location.hash = '/PREFIX/hello';
    const history = createHashHistory({ basename: '/prefix' });
    expect(history.location.pathname).toEqual('/hello');
  });

  it('allows special regex characters', () => {
    window.location.hash = '/prefix$special/hello';
    const history = createHashHistory({ basename: '/prefix$special' });
    expect(history.location.pathname).toEqual('/hello');
  });

  it('does not strip partial prefix matches', () => {
    window.location.hash = '/no-match/hello';

    // A warning is issued when the prefix is not present.
    const spy = mock.spyOn(console, 'warn').mockImplementation(() => {});

    const history = createHashHistory({ basename: '/prefix' });
    expect(history.location.pathname).toEqual('/no-match/hello');

    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });

  describe('when the pathname is only the prefix', () => {
    it('strips the prefix', () => {
      window.location.hash = '/prefix';
      const history = createHashHistory({ basename: '/prefix' });
      expect(history.location.pathname).toEqual('/');
    });

    it('strips the prefix when there is a search string', () => {
      window.location.hash = '/prefix?a=b';
      const history = createHashHistory({ basename: '/prefix' });
      expect(history.location.pathname).toEqual('/');
    });

    it('strips the prefix when there is a hash', () => {
      window.location.hash = '/prefix#hash';
      const history = createHashHistory({ basename: '/prefix' });
      expect(history.location.pathname).toEqual('/');
    });
  });
});
