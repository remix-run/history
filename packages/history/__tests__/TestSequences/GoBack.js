import expect from 'expect';

import { execSteps } from './utils.js';

export default (history, done) => {
  let steps = [
    ({ location }) => {
      expect(location).toMatchObject({
        pathname: '/'
      });

      history.push('/home');
    },
    ({ location }) => {
      expect(location).toMatchObject({
        pathname: '/home'
      });

      history.back();
    },
    ({ location }) => {
      expect(location).toMatchObject({
        pathname: '/'
      });
    }
  ];

  execSteps(steps, history, done);
};
