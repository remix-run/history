import expect from 'expect';

import execSteps from './execSteps.js';

export default (history, done) => {
  let prevLocation;

  let steps = [
    ({ location }) => {
      expect(location).toMatchObject({
        pathname: '/'
      });

      history.navigate('/home', { replace: true });
    },
    ({ action, location }) => {
      expect(action).toBe('REPLACE');
      expect(location).toMatchObject({
        pathname: '/home'
      });

      prevLocation = location;

      history.navigate('/home', { replace: true });
    },
    ({ action, location }) => {
      expect(action).toBe('REPLACE');
      expect(location).toMatchObject({
        pathname: '/home'
      });

      expect(location).not.toBe(prevLocation);
    }
  ];

  execSteps(steps, history, done);
};
