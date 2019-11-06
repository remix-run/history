import expect from 'expect';

import execSteps from './execSteps.js';

export default (history, done) => {
  let steps = [
    ({ location }) => {
      expect(location).toMatchObject({
        pathname: '/'
      });

      history.navigate('/home?the=query#the-hash', { state: { the: 'state' } });
    },
    ({ action, location }) => {
      expect(action).toBe('PUSH');
      expect(location).toMatchObject({
        pathname: '/home',
        search: '?the=query',
        hash: '#the-hash',
        state: { the: 'state' }
      });
    }
  ];

  execSteps(steps, history, done);
};
