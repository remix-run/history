import expect from 'expect';

import execSteps from './execSteps';

export default function(history, done) {
  const steps = [
    location => {
      expect(location).toMatchObject({
        pathname: '/'
      });

      const pathname = '/歴史';
      history.push(pathname);
    },
    () => {
      expect(warningMessage).toMatch(
        'location.pathname is not fully encoded, which may result in bugs.'
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
