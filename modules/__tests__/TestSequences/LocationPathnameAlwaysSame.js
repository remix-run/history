import expect from 'expect';

import execSteps from './execSteps.js';

export default (history, done) => {
  let steps = [
    () => {
      // encoded string
      let pathname = '/%E6%AD%B4%E5%8F%B2';
      history.replace(pathname);
    },
    ({ location }) => {
      expect(location).toMatchObject({
        pathname: '/%E6%AD%B4%E5%8F%B2'
      });
      // encoded object
      let pathname = '/%E6%AD%B4%E5%8F%B2';
      history.replace({ pathname });
    },
    ({ location }) => {
      expect(location).toMatchObject({
        pathname: '/%E6%AD%B4%E5%8F%B2'
      });
      // unencoded string
      let pathname = '/歴史';
      history.replace(pathname);
    },
    ({ location }) => {
      expect(location).toMatchObject({
        pathname: '/%E6%AD%B4%E5%8F%B2'
      });
      // unencoded object
      let pathname = '/歴史';
      history.replace({ pathname });
    },
    ({ location }) => {
      expect(location).toMatchObject({
        pathname: '/%E6%AD%B4%E5%8F%B2'
      });
    }
  ];

  execSteps(steps, history, done);
};
