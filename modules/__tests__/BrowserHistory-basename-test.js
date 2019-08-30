import expect from 'expect';
import mock from 'jest-mock';
import { createBrowserHistory } from 'history';

describe('a browser history with a basename', () => {
  it('knows how to create hrefs', () => {
    window.history.replaceState(null, null, '/the/base');
    const history = createBrowserHistory({ basename: '/the/base' });
    const href = history.createHref({
      pathname: '/the/path',
      search: '?the=query',
      hash: '#the-hash'
    });

    expect(href).toEqual('/the/base/the/path?the=query#the-hash');
  });

  describe('with a bad basename', () => {
    it('knows how to create hrefs', () => {
      window.history.replaceState(null, null, '/the/bad/base');
      const history = createBrowserHistory({ basename: '/the/bad/base/' });
      const href = history.createHref({
        pathname: '/the/path',
        search: '?the=query',
        hash: '#the-hash'
      });

      expect(href).toEqual('/the/bad/base/the/path?the=query#the-hash');
    });
  });

  describe('with a slash basename', () => {
    it('knows how to create hrefs', () => {
      window.history.replaceState(null, null, '/');
      const history = createBrowserHistory({ basename: '/' });
      const href = history.createHref({
        pathname: '/the/path',
        search: '?the=query',
        hash: '#the-hash'
      });

      expect(href).toEqual('/the/path?the=query#the-hash');
    });
  });

  it('strips the basename from the pathname', () => {
    window.history.replaceState(null, null, '/prefix/pathname');
    const history = createBrowserHistory({ basename: '/prefix' });
    expect(history.location.pathname).toEqual('/pathname');
  });

  it('is not case-sensitive', () => {
    window.history.replaceState(null, null, '/PREFIX/pathname');
    const history = createBrowserHistory({ basename: '/prefix' });
    expect(history.location.pathname).toEqual('/pathname');
  });

  it('does not strip partial prefix matches', () => {
    const spy = mock.spyOn(console, 'warn').mockImplementation(() => {});

    window.history.replaceState(null, null, '/prefixed/pathname');
    const history = createBrowserHistory({ basename: '/prefix' });
    expect(history.location.pathname).toEqual('/prefixed/pathname');

    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });

  describe('when the pathname is only the prefix', () => {
    it('strips the prefix', () => {
      window.history.replaceState(null, null, '/prefix');
      const history = createBrowserHistory({ basename: '/prefix' });
      expect(history.location.pathname).toEqual('/');
    });

    it('strips the prefix when there is a search string', () => {
      window.history.replaceState(null, null, '/prefix?a=b');
      const history = createBrowserHistory({ basename: '/prefix' });
      expect(history.location.pathname).toEqual('/');
    });

    it('strips the prefix when there is a hash', () => {
      window.history.replaceState(null, null, '/prefix#rest');
      const history = createBrowserHistory({ basename: '/prefix' });
      expect(history.location.pathname).toEqual('/');
    });
  });
});
