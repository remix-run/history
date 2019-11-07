import expect from 'expect';

import execSteps from './execSteps.js';

export default (history, done) => {
  let steps = [
    ({ location }) => {
      expect(location).toMatchObject({
        pathname: '/'
      });

      history.push('/the/path?the=query#the-hash');
    },
    ({ action, location }) => {
      expect(action).toBe('PUSH');
      expect(location).toMatchObject({
        pathname: '/the/path',
        search: '?the=query',
        hash: '#the-hash'
      });

      try {
        history.push('../other/path?another=query#another-hash');
      } catch (error) {
        expect(error.message).toMatch(/relative pathnames are not supported/i);
      }
    }
  ];

  execSteps(steps, history, done);
};
