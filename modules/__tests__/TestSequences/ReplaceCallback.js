import expect from 'expect';

import execSteps from './execSteps';

export default function (history, done) {
  const replaceCallback = (newState, oldState) => ({ ...oldState, ...newState, foo: 'bar' });
  const steps = [
    location => {
      expect(location).toMatchObject({
        pathname: '/'
      });

      history.replace('/home?the=query#the-hash', { the: 'state' }, replaceCallback);
    },
    (location, action) => {
      expect(action).toBe('REPLACE');
      expect(location).toMatchObject({
        pathname: '/home',
        search: '?the=query',
        hash: '#the-hash',
        state: { the: 'state', foo: "bar" }
      });
    }
  ];

  execSteps(steps, history, done);
}
