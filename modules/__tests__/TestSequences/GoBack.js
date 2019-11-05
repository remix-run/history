import expect from 'expect';

import execSteps from './execSteps.js';

export default function(history, done) {
  let steps = [
    ({ location }) => {
      expect(location).toMatchObject({
        pathname: '/'
      });

      history.push('/home');
    },
    ({ action, location }) => {
      expect(action).toEqual('PUSH');
      expect(location).toMatchObject({
        pathname: '/home'
      });

      history.back();
    },
    ({ action, location }) => {
      expect(action).toEqual('POP');
      expect(location).toMatchObject({
        pathname: '/'
      });
    }
  ];

  execSteps(steps, history, done);
}
