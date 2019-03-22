import expect from 'expect';

import execSteps from './execSteps';

export default function(history, done) {
  const steps = [
    location => {
      expect(location).toMatchObject({
        pathname: '/'
      });

      const pathname = '/test';
      history.push(pathname);
    },
    (location, action) => {
      expect(action).toBe('PUSH');
      expect(location).toMatchObject({
        pathname: '/TEST'
      });
    }
  ];

  execSteps(steps, history, done);
}
