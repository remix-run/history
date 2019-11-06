import expect from 'expect';

import execSteps from './execSteps.js';

export default (history, done) => {
  let steps = [
    ({ location }) => {
      expect(location).toMatchObject({
        pathname: '/'
      });

      history.navigate('/home?the=query#the-hash', { replace: true });
    },
    ({ action, location }) => {
      expect(action).toBe('REPLACE');
      expect(location).toMatchObject({
        pathname: '/home',
        search: '?the=query',
        hash: '#the-hash'
      });
    }
  ];

  execSteps(steps, history, done);
};
