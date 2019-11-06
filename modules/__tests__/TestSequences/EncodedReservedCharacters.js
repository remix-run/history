import expect from 'expect';

import execSteps from './execSteps.js';

export default (history, done) => {
  let steps = [
    () => {
      // encoded string
      let pathname = '/view/%23abc';
      history.navigate(pathname, { replace: true });
    },
    ({ location }) => {
      expect(location).toMatchObject({
        pathname: '/view/%23abc'
      });

      // encoded object
      let pathname = '/view/%23abc';
      history.navigate({ pathname }, { replace: true });
    },
    ({ location }) => {
      expect(location).toMatchObject({
        pathname: '/view/%23abc'
      });
      // unencoded string
      let pathname = '/view/#abc';
      history.navigate(pathname, { replace: true });
    },
    ({ location }) => {
      expect(location).toMatchObject({
        pathname: '/view/',
        hash: '#abc'
      });
    }
  ];

  execSteps(steps, history, done);
};
