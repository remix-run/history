import expect from 'expect';

import execSteps from './execSteps.js';

export default (history, done) => {
  let steps = [
    ({ location }) => {
      expect(location).toMatchObject({
        pathname: '/'
      });

      let pathname = '/歴史';
      let search = '?キー=値';
      let hash = '#ハッシュ';
      history.navigate(pathname + search + hash);
    },
    ({ action, location }) => {
      expect(action).toBe('PUSH');
      expect(location).toMatchObject({
        pathname: '/%E6%AD%B4%E5%8F%B2',
        search: '?%E3%82%AD%E3%83%BC=%E5%80%A4',
        hash: '#%E3%83%8F%E3%83%83%E3%82%B7%E3%83%A5'
        // pathname: '/歴史',
        // search: '?キー=値',
        // hash: '#ハッシュ'
      });
    }
  ];

  execSteps(steps, history, done);
};
