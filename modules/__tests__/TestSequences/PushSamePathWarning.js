import expect from 'expect';

import execSteps from './execSteps';

export default function(history, done) {
  let prevLocation;

  const steps = [
    location => {
      expect(location).toMatchObject({
        pathname: '/'
      });

      history.push('/home');
    },
    (location, action) => {
      expect(action).toBe('PUSH');
      expect(location).toMatchObject({
        pathname: '/home'
      });

      prevLocation = location;

      history.push('/home');
    },
    (location, action) => {
      expect(action).toBe('PUSH');
      expect(location).toMatchObject({
        pathname: '/home'
      });

      // We should get the SAME location object. Nothing
      // new was added to the history stack.
      expect(location).toBe(prevLocation);

      // We should see a warning message.
      expect(warningMessage).toMatch(
        'Hash history cannot PUSH the same path; a new entry will not be added to the history stack'
      );
    }
  ];

  let consoleWarn = console.error; // eslint-disable-line no-console
  let warningMessage;

  // eslint-disable-next-line no-console
  console.warn = message => {
    warningMessage = message;
  };

  execSteps(steps, history, (...args) => {
    console.warn = consoleWarn; // eslint-disable-line no-console
    done(...args);
  });
}
