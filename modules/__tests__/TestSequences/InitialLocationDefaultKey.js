import expect from 'expect';

import execSteps from './execSteps.js';

export default function(history, done) {
  let steps = [
    ({ location }) => {
      expect(location.key).toBe('default');
    }
  ];

  execSteps(steps, history, done);
}
